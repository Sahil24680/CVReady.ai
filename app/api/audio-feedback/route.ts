export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

import { Report, ReportSchema } from "@/app/interview/components/schema";
import { zodTextFormat } from "openai/helpers/zod";
import {
  getUser,
  request_lock_and_tokens,
  set_request_lock,
  release_request_lock,
} from "@/app/utils/supabase/action";
import { safe } from "@/lib/safe";
import { SYSTEM_PROMPT } from "@/app/interview/components/prompts";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });


export async function POST(req: Request) {
  let userId: string | null = null;
  let lockHeld = false;

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ---------------------- AUTH & LOCK BOOTSTRAP ----------------------
    const user = await getUser();
    if ("error" in user || !user?.id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }
    userId = user.id;

    // 1) Initialize lock row & token quota for user
    const lockInit = await safe(() =>
      request_lock_and_tokens(userId as string)
    );
    if (!lockInit.success) {
      console.error("[audio-feedback] lock bootstrap failed:", lockInit.error);
      return NextResponse.json(
        { error: "We couldn't start your request. Please try again." },
        { status: 500 }
      );
    }

    const { is_available, tokens } = lockInit.data;

    // 2) Rate-limit: user has no available tokens
    if (tokens <= 0) {
      return NextResponse.json(
        { error: "You’re out of runs. Please try again later." },
        { status: 429 }
      );
    }

    // 3) Ensure no other concurrent job for same user
    if (!is_available) {
      return NextResponse.json(
        { error: "You already have a recording processing. Please wait." },
        { status: 409 }
      );
    }

    // 4) Acquire lock for current operation
    const gotLock = await set_request_lock(userId as string);
    if (!gotLock) {
      return NextResponse.json(
        { error: "You already have a recording processing. Please wait." },
        { status: 409 }
      );
    }
    lockHeld = true;

    // ---------------------- 1️⃣ TRANSCRIPTION ----------------------
    const transcriptResp = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    console.log(
      "🧾 Whisper full JSON output:\n",
      JSON.stringify(transcriptResp, null, 2)
    );

    if (transcriptResp.segments) {
      console.log("📊 Segment count:", transcriptResp.segments.length);
      console.log(
        "📈 First segment example:\n",
        JSON.stringify(transcriptResp.segments[0], null, 2)
      );
    }

    // Build transcript and insert [PAUSE n s] tags for long silences
    const segments = transcriptResp.segments || [];
    let reconstructed = "";
    for (let i = 0; i < segments.length; i++) {
      const curr = segments[i];
      const next = segments[i + 1];
      reconstructed += curr.text + " ";
      if (next && next.start - curr.end > 1.5) {
        const pause = Math.round(next.start - curr.end);
        reconstructed += `[PAUSE ${pause}s] `;
      }
    }

    const transcript =
      reconstructed.trim() ||
      transcriptResp.text?.trim() ||
      "Transcription unavailable";
    const durationSeconds = segments.length
      ? segments[segments.length - 1].end
      : null;

    console.log("🗣️ Full reconstructed transcript:\n", transcript);
    console.log("⏱️ Total duration (seconds):", durationSeconds);

    // ---------------------- 2️⃣ TONE ANNOTATION ----------------------
    const annotationResp = await openai.responses.create({
      model: "gpt-4o-mini",
      temperature: 0,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `You are an annotator. Enhance the transcript with delivery cues:
- Keep filler words ('um', 'uh', 'like') exactly as spoken.
- Preserve any [PAUSE n s] tags from timing data.
- Infer tone shifts using language and pacing:
  • Frequent fillers, self-corrections, or long pauses → [TONE: nervous]
  • Steady phrasing, assertive language → [TONE: confident]
  • Upbeat, expressive wording → [TONE: enthusiastic]
  • Flat or minimal variation → [TONE: monotone]
- Never summarize or rephrase sentences.
Return only the annotated transcript.`,
            },
          ],
        },
        { role: "user", content: [{ type: "input_text", text: transcript }] },
      ],
    });

    const annotatedTranscript =
      annotationResp.output_text?.trim() || transcript;
    console.log("🧠 Full annotated transcript:\n", annotatedTranscript);

    // ---------------------- 3️⃣ GRADING PHASE ----------------------
    const gradingResp = await openai.responses.parse({
      model: "gpt-4o-mini",
      temperature: 0,
      max_output_tokens: 1200,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Evaluate the following annotated transcript of an interview response and return STRICT JSON following the Report schema.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: annotatedTranscript }],
        },
      ],
      text: { format: zodTextFormat(ReportSchema, "report") },
    });

    if (!gradingResp.output_parsed) {
      console.error("❌ Could not parse grading response.");
      return NextResponse.json(
        { error: "Could not parse AI grading" },
        { status: 500 }
      );
    }

    // ---------------------- 4️⃣ SCORING NORMALIZATION ----------------------
    const parsed = gradingResp.output_parsed as Report;
    let evaluation = parsed.evaluation;

    const scores = evaluation.metrics.map((m) => m.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    let scaledMetrics = evaluation.metrics;
    if (maxScore <= 10 && minScore >= 0) {
      scaledMetrics = evaluation.metrics.map((m) => ({
        ...m,
        score: Math.round(m.score * 10),
      }));
    }
    scaledMetrics = scaledMetrics.map((m) => ({
      ...m,
      score: Math.max(0, Math.min(100, Math.round(m.score))),
    }));

    let overall = evaluation.overallScore;
    if (overall <= 10 && Math.max(...scaledMetrics.map((m) => m.score)) > 10) {
      const avg = Math.round(
        scaledMetrics.reduce((a, b) => a + b.score, 0) / scaledMetrics.length
      );
      overall = avg;
    }
    overall = Math.max(0, Math.min(100, Math.round(overall)));

    evaluation = {
      ...evaluation,
      metrics: scaledMetrics,
      overallScore: overall,
    };

    // ---------------------- 5️⃣ FINAL REPORT BUILD ----------------------
    const report: Report = {
      ...parsed,
      evaluation,
      durationSeconds,
      transcript: annotatedTranscript,
      createdAt: new Date().toISOString(),
      source: "upload",
      filename: file.name,
    };

    console.log("📦 Final full JSON report:\n", JSON.stringify(report, null, 2));

    // Return structured JSON to client
    return NextResponse.json(report, { status: 200 });
  } catch (err: any) {
    // Catch-all error guard
    console.error("❌ /api/audio-feedback error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  } finally {
    // ---------------------- LOCK RELEASE ----------------------
    if (lockHeld && userId) {
      const rel = await safe(() => release_request_lock(userId as string));
      if (!rel.success) {
        console.error("[audio-feedback] lock release error:", rel.error);
      }
    }
  }
}
