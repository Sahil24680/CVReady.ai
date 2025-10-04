import { z } from "zod";

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

export const QuestionFeedbackSchema = z.object({
  question: z.string(),
  answerSnippet: z.string(),
  suggestions: z.array(z.string()),
});

export const EvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  metrics: z.array(ScoreMetricSchema),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  nextSteps: z.array(z.string()),
  questions: z.array(QuestionFeedbackSchema),
});

export const ReportSchema = z.object({
  transcript: z.string(),
  evaluation: EvaluationSchema,
  createdAt: z.string(),
  durationSeconds: z.number().nullable(),
  source: z.enum(["recording", "upload"]),
  filename: z.string().nullable(),
});

export type Report = z.infer<typeof ReportSchema>;
