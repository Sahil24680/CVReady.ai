import { z } from "zod";

/**
 * Interview Evaluation Schemas
 *
 * Zod validation schemas for AI-generated interview feedback.
 * These schemas ensure structured, type-safe responses from OpenAI
 * when evaluating audio interview responses.
 */

/**
 * Individual scoring metric (e.g., enthusiasm, clarity, confidence)
 */
export const ScoreMetricSchema = z.object({
  key: z.enum([
    "enthusiasm",
    "clarity",
    "confidence",
    "structure",
    "relevance",
    "conciseness",
    "fillerWords",
  ]),
  label: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

/**
 * Feedback for a specific interview question answered
 */
export const QuestionFeedbackSchema = z.object({
  question: z.string(),
  answerSnippet: z.string(),
  suggestions: z.array(z.string()),
});

/**
 * Complete evaluation results including scores, feedback, and recommendations
 */
export const EvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  metrics: z.array(ScoreMetricSchema),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  nextSteps: z.array(z.string()),
  questions: z.array(QuestionFeedbackSchema),
});

/**
 * Full interview report including transcript, evaluation, and metadata
 */
export const ReportSchema = z.object({
  transcript: z.string(),
  evaluation: EvaluationSchema,
  createdAt: z.string(),
  durationSeconds: z.number().nullable(),
  source: z.enum(["recording", "upload"]),
  filename: z.string().nullable(),
});

export type Report = z.infer<typeof ReportSchema>;
