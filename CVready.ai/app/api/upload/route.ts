export const runtime = "nodejs"; 
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient as createSb } from "@supabase/supabase-js";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import {
  buildAnalysisPrompt,
  buildGraderPrompt,
  buildScopedPrompt,
} from "./Prompt";

const MAX_FILE_SIZE_MB = 1; // Max PDF size allowed from client uploads
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// Big model for rich coaching/prose output
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-2024-08-06";
// Small model for fast/cheap grading + routing
const SMALL_MODEL = process.env.OPENAI_SMALL_MODEL || "gpt-4o-mini";

// OpenAI server client (uses API key from env)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Build a Supabase server client using service role (no session persistence)
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !serviceKey) {
    console.error("[upload] Missing Supabase envs:", {
      hasUrl: !!url,
      hasService: !!serviceKey,
    });
    throw new Error("Server misconfigured: SUPABASE env vars missing");
  }
  return createSb(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch },
  });
}

// ---------------------- SCHEMAS ----------------------
// System instruction for the deep coaching pass
const SYSTEM = `You are an expert Big Tech career advisor (ex-Google, Meta, Amazon) helping junior developers break into top companies. Be direct, supportive, and beginner-friendly.`;
// Base analysis template (large prompt) imported from Prompt.ts
const TEMPLATE = buildAnalysisPrompt();

// Final feedback shape expected by your UI (kept unchanged)
const FeedbackSchema = z.object({
  feedback: z.object({
    big_tech_readiness_score: z.number(),
    resume_format_score: z.number(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    tips: z.array(z.string()),
    motivation: z.string(),
  }),
});

// Small-model grading schema: scores + focus areas + targeted weak bullets
const GradeSchema = z.object({
  scores: z.object({
    format: z.number().min(0).max(5),
    impact: z.number().min(0).max(5),
    tech_depth: z.number().min(0).max(5),
    projects: z.number().min(0).max(5),
  }),
  focus_areas: z
    .array(z.enum(["format", "impact", "tech_depth", "projects"]))
    .max(3),
  weak_bullets: z
    .array(
      z.object({
        section: z.enum([
          "experience",
          "projects",
          "education",
          "summary",
          "skills",
        ]),
        idx: z.number().int().min(0),
        reason: z.string(), // required by Structured Outputs; can be empty string
      })
    )
    .max(8),
});
type Grade = z.infer<typeof GradeSchema>;

// ---------------------- HANDLER ----------------------
export async function POST(req: Request) {
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

    // Basic validations for presence, size, and type (PDF only)
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Must be under ${MAX_FILE_SIZE_MB}MB.` },
        { status: 400 }
      );
    }
    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // NOTE: Prefer resolving identity server-side; header is placeholder
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }

    // 1) Upload file once to OpenAI Files and reuse the file_id for both passes
    const uploaded = await openai.files.create({
      file, 
      purpose: "assistants",
    });

    // 2) MINI PASS — grading & routing (cheap, deterministic JSON only)
    let grading: Grade;
    try {
      const gradeResp = await openai.responses.parse({
        model: SMALL_MODEL,
        temperature: 0.2, // low temp for stable scoring
        max_output_tokens: 400, // small budget; JSON only
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
        text: { format: zodTextFormat(GradeSchema, "grading") }, // enforce schema
      });

      if (!gradeResp.output_parsed) throw new Error("Null parsed grading");
      grading = gradeResp.output_parsed;
    } catch (e) {
      // Fallback scope if the grader fails (keeps the pipeline resilient)
      console.warn(
        "[upload] Grader pass failed, falling back to default scope.",
        e
      );
      grading = {
        scores: { format: 3, impact: 3, tech_depth: 3, projects: 3 },
        focus_areas: ["impact", "tech_depth"],
        weak_bullets: [],
      };
    }

    // 3) Token budgeting for deep pass scales with number of deficits
    const deficits = grading.focus_areas.length;
    const maxTokens =
      deficits === 0
        ? 900   // short, when resume is already strong
        : deficits === 1
        ? 1200
        : deficits === 2
        ? 1500
        : 1800; // fullest budget when several areas are weak

    // 4) DEEP PASS — use scope guardrails + your original template (same UI shape)
    const scopedTemplate = buildScopedPrompt(TEMPLATE, grading);
    const resp = await openai.responses.parse({
      model: MODEL,
      temperature: 0.7, // slightly creative for coaching prose
      max_output_tokens: maxTokens,
      input: [
        { role: "system", content: [{ type: "input_text", text: SYSTEM }] },
        {
          role: "user",
          content: [{ type: "input_text", text: scopedTemplate }],
        },
        {
          role: "user",
          content: [{ type: "input_file", file_id: uploaded.id }],
        },
      ],
      text: { format: zodTextFormat(FeedbackSchema, "feedback") }, // final UI contract
    });

    const feedback = resp.output_parsed; // Parsed + validated JSON for frontend

    // 5) Clean up file from OpenAI (best effort; safe to ignore on failure)
    try {
      await openai.files.delete(uploaded.id);
    } catch {
      console.warn("[upload] Could not delete OpenAI file (safe to ignore).");
    }

    // 6) Persist final feedback to Supabase (keeps history for the user)
    const supabase = getServerSupabase();
    const { error: dbErr } = await supabase.from("Resume_datas").insert({
      Resume_name: file.name,
      openai_feedback: feedback, // same shape your UI renders
      user_id: userId,
      created_at: new Date().toISOString(),
    });
    if (dbErr) {
      console.error("[upload] Supabase insert error:", dbErr);
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    // Return validated feedback JSON to the client
    return NextResponse.json(feedback, { status: 200 });
  } catch (err: any) {
    // Catch-all to avoid leaking stack traces to client; log server-side
    console.error("❌ /api/upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
