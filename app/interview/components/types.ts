/**
 * Interview Evaluation Types
 *
 * TypeScript type definitions for interview feedback data.
 * These types mirror the Zod schemas in schema.ts but provide
 * direct TypeScript types for component usage.
 */

/**
 * Individual performance metric (e.g., enthusiasm, clarity)
 */
export type ScoreMetric = {
    key:
      | "enthusiasm"
      | "clarity"
      | "confidence"
      | "structure"
      | "relevance"
      | "conciseness"
      | "fillerWords";
    label: string;
    score: number; // 0-100
    feedback: string;
  };
  
  /**
 * Feedback for a specific interview question
 */
export type QuestionFeedback = {
    question: string;
    answerSnippet: string;
    suggestions: string[];
  };
  
  /**
 * Complete evaluation with scores, strengths, and improvement areas
 */
export type Evaluation = {
    overallScore: number; // 0-100
    metrics: ScoreMetric[];
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
    questions: QuestionFeedback[];
  };
  
  /**
 * Full interview report with transcript, evaluation, and session metadata
 */
export type Report = {
    transcript: string;
    evaluation: Evaluation;
    createdAt: string;
    durationSeconds?: number;
    source: "recording" | "upload";
    filename?: string;
  };
  