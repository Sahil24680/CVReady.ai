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
  
  export type QuestionFeedback = {
    question: string;
    answerSnippet: string;
    suggestions: string[];
  };
  
  export type Evaluation = {
    overallScore: number; // 0-100
    metrics: ScoreMetric[];
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
    questions: QuestionFeedback[];
  };
  
  export type Report = {
    transcript: string;
    evaluation: Evaluation;
    createdAt: string;
    durationSeconds?: number;
    source: "recording" | "upload";
    filename?: string;
  };
  