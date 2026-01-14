export const runtime = "nodejs";
import { buildContext } from "@/app/utils/rag/context";
import { safe } from "@/lib/safe";
import {
  computeFormatScore,
  DEFAULT_FORMAT_CHECKS,
  combineReadinessWithFormat,
} from "@/app/utils/rag/scoring/Resume_grader";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  OPENAI_CONF,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  SYSTEM_PROMPT,
} from "@/lib/config";
import {
  GradeSchemaV2,
  type GradeV2,
  FeedbackSchema,
  RoleSchema,
  type Role,
} from "@/lib/schemas";
import { createClient as createSbServer } from "@/app/utils/supabase/server";
import { z } from "zod";
import { validateSinglePagePdf } from "./validatePdf";
import { zodTextFormat } from "openai/helpers/zod";
import {
  getUser,
  request_lock_and_tokens,
  set_request_lock,
  release_request_lock,
} from "@/app/utils/supabase/action";
import {
  buildAnalysisPrompt,
  buildGraderPrompt,
  buildScopedPrompt,
} from "./Prompt";

// ---------------------- CONSTANTS ----------------------

/**
 * Token budget scales with how many weak areas the resume has.
 * Stronger resumes need less feedback tokens; weaker ones get more detailed analysis.
 */
const TOKEN_BUDGET: Record<number, number> = {
  0: 900,  // Resume is strong - minimal feedback needed
  1: 1200, // One weak area
  2: 1500, // Two weak areas
};
const DEFAULT_TOKEN_BUDGET = 1800; // 3+ weak areas - maximum feedback

const DEFAULT_GRADING: GradeV2 = {
  scores: { format: 3, impact: 3, tech_depth: 3, projects: 3 },
  focus_areas: ["impact", "tech_depth"],
  weak_bullets: [],
  format_checks: DEFAULT_FORMAT_CHECKS,
};

const ANALYSIS_PROMPT_TEMPLATE = buildAnalysisPrompt();
const MODEL = OPENAI_CONF.MODEL;
const SMALL_MODEL = OPENAI_CONF.SMALL_MODEL;
const openai = new OpenAI({ apiKey: OPENAI_CONF.API_KEY });

// ---------------------- HANDLER ----------------------

/**
 * Resume upload and analysis endpoint.
 *
 * Uses a two-pass AI analysis system:
 * 1. GRADER PASS (fast, cheap model): Scores resume on format/impact/depth/projects,
 *    identifies weak areas, and determines token budget for detailed analysis
 * 2. DEEP PASS (powerful model): Generates detailed, actionable feedback using
 *    RAG context and scoped prompts based on the grader's findings
 *
 * Also implements:
 * - Request locking to prevent concurrent uploads per user
 * - Token-based rate limiting
 * - Deterministic format scoring combined with AI readiness score
 */
export async function POST(req: Request) {
  let userId: string | null = null;
  let lockHeld = false;
  try {
    // Quick sanity logging for critical envs + model selection
    console.log("[upload] env check", {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSbUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSbService: !!process.env.SUPABASE_SERVICE_ROLE,
      model: MODEL,
      smallModel: SMALL_MODEL,
    });

    // Parse multipart form-data and fetch the "file" field (Web File)
    const form = await req.formData();
    const file = form.get("file");
    const rawRole = form.get("role");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const roleResult = RoleSchema.safeParse(rawRole);
    if (!roleResult.success) {
      return NextResponse.json(
        { error: "Invalid or missing role" },
        { status: 400 }
      );
    }
    const role: Role = roleResult.data;

    const validation = await validateSinglePagePdf(
      file,
      MAX_FILE_SIZE,
      `${MAX_FILE_SIZE_MB}MB`
    );
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const user = await getUser();
    if ("error" in user || !user?.id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }
    const currentUserId = user.id;
    userId = currentUserId; // For finally block

    // Check if theres a lock row for this user; create if not
    const lockInit = await safe(() => request_lock_and_tokens(currentUserId));
    if (!lockInit.success) {
      console.error("[upload] lock bootstrap failed:", lockInit.error);
      return NextResponse.json(
        { error: "We couldn't start your upload. Please try again." },
        { status: 500 }
      );
    }

    const { is_available, tokens } = lockInit.data;

    // Rate limit first
    if (tokens <= 0) {
      return NextResponse.json(
        { error: "You’re out of runs. Please try again later." },
        { status: 429 }
      );
    }

    if (!is_available) {
      return NextResponse.json(
        { error: "You already have a resume processing. Please wait." },
        { status: 409 }
      );
    }

    const gotLock = await set_request_lock(currentUserId);
    if (!gotLock) {
      return NextResponse.json(
        {
          error: "You already have a resume processing. Please wait.",
        },
        { status: 409 }
      );
    }
    lockHeld = true;

    // 1) Upload file once to OpenAI Files and reuse the file_id for both passes
    const uploaded = await openai.files.create({
      file,
      purpose: "assistants",
    });

    // 2) MINI PASS — grading & routing
    const gradeResult = await safe(async () => {
      const gradeResp = await openai.responses.parse({
        model: SMALL_MODEL,
        temperature: 0.2,
        max_output_tokens: 600,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: "Return STRICT JSON only." }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: buildGraderPrompt() }],
          },
          {
            role: "user",
            content: [{ type: "input_file", file_id: uploaded.id }],
          },
        ],
        text: { format: zodTextFormat(GradeSchemaV2, "grading") },
      });

      if (!gradeResp.output_parsed) {
        throw new Error("We couldn't process your resume. Please try again.");
      }
      return gradeResp.output_parsed as GradeV2;
    });

    let grading: GradeV2;
    if (gradeResult.success) {
      grading = gradeResult.data;
      console.log("=== SMALL MODEL OUTPUT ===");
      console.log("[grader] parsed grading", JSON.stringify(grading, null, 2));
    } else {
      console.warn(
        "[upload] Grader pass failed, falling back to default scope.",
        gradeResult.error
      );
      grading = DEFAULT_GRADING;
    }

    // Deterministic format score from checklist (0–3)
    const deterministicFormatScore = computeFormatScore(
      grading.format_checks ?? DEFAULT_FORMAT_CHECKS
    );
    console.log(
      "[upload] deterministic format score =",
      deterministicFormatScore
    );

    // 3) Token budgeting for deep pass scales with number of deficits
    const deficits = grading.focus_areas.length;
    const maxTokens = TOKEN_BUDGET[deficits] ?? DEFAULT_TOKEN_BUDGET;

    // 3.5 RAG block - retrieves relevant context from vector database
    const contextResult = await safe(() => buildContext(role, grading));
    const ragContext = contextResult.success ? contextResult.data : "";
    if (!contextResult.success) {
      console.warn(
        "[upload] RAG retrieval failed; continuing without context",
        contextResult.error
      );
    }
    console.log("[upload] ragContext length", ragContext.length);
    console.log("context:", ragContext);

    // 4) DEEP PASS — combines scoped prompt with RAG context for detailed analysis
    const scopedTemplate =
      buildScopedPrompt(ANALYSIS_PROMPT_TEMPLATE, { ...grading, role }) +
      (ragContext ? `\n\n${ragContext}` : "");
    const analysisResponse = await openai.responses.parse({
      model: MODEL,
      temperature: 0.5, // slightly creative for coaching prose
      max_output_tokens: maxTokens,
      input: [
        { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
        {
          role: "user",
          content: [{ type: "input_text", text: scopedTemplate }],
        },
        {
          role: "user",
          content: [{ type: "input_file", file_id: uploaded.id }],
        },
      ],
      text: { format: zodTextFormat(FeedbackSchema, "feedback") },
    });

    if (!analysisResponse.output_parsed) {
      throw new Error("Failed to parse feedback from resume analysis.");
    }
    const parsedFeedback = analysisResponse.output_parsed as z.infer<typeof FeedbackSchema>;

    /**
     * Final score calculation:
     * - AI model provides a 1-7 "readiness" score based on content quality
     * - Format score (0-3) is computed deterministically from checklist
     * - Combined to produce final 1-10 score for user display
     */
    const rawModelReadiness = Number(
      parsedFeedback.feedback.big_tech_readiness_score ?? 0
    );
    const finalReadiness = combineReadinessWithFormat(
      rawModelReadiness,
      deterministicFormatScore
    );
    parsedFeedback.feedback.big_tech_readiness_score = finalReadiness;

    // Merge format score into the final feedback object
    const feedback = {
      ...parsedFeedback,
      feedback: {
        ...parsedFeedback.feedback,
        resume_format_score: deterministicFormatScore,
      },
    };

    // 5) Clean up uploaded file from OpenAI storage
    const deleteResult = await safe(() => openai.files.delete(uploaded.id));
    if (!deleteResult.success) {
      console.warn(
        "[upload] Could not delete OpenAI file (safe to ignore).",
        deleteResult.error
      );
    }

    // 6) Persist analysis results to database
    const supabase = await createSbServer();
    const { error: insertError } = await supabase.from("Resume_datas").insert({
      Resume_name: file.name,
      openai_feedback: feedback,
      user_id: currentUserId,
      created_at: new Date().toISOString(),
      Role: role,
    });
    if (insertError) {
      console.error("[upload] Supabase insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Return validated feedback JSON to the client
    return NextResponse.json(feedback, { status: 200 });
  } catch (err: unknown) {
    // Catch-all to avoid leaking stack traces to client; log server-side
    console.error("❌ /api/upload error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Always release the request lock to allow future uploads
    if (lockHeld && userId) {
      const userIdToRelease = userId;
      const releaseResult = await safe(() => release_request_lock(userIdToRelease));
      if (!releaseResult.success) {
        console.error("[upload] lock release error:", releaseResult.error);
      }
    }
  }
}
