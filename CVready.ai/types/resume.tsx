export interface FeedbackData {
  feedback: Feedback;
}

export interface Feedback {
  big_tech_readiness_score: number;
  resume_format_score: number;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  motivation?: string;
}

export interface ResumeRecord {
  id: number;
  resume_name: string;
  created_at: string;
  openai_feedback: FeedbackData;
  Role: string;
}

export interface User_profile {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
}
