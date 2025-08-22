import { z } from "zod";

export const FeedbackSchema = z.object({
  feedback: z.object({
    big_tech_readiness_score: z.number(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    tips: z.array(z.string()),
    motivation: z.string(),
  }),
});

export type Feedback = z.infer<typeof FeedbackSchema>;



export const FormatChecksSchema = z.object({
    sections_present: z.object({
      experience: z.boolean(),
      projects: z.boolean(),
      education: z.boolean(),
      skills: z.boolean(),
    }),        
    tense_consistency: z.boolean(),
    bullet_style_consistency: z.boolean(),
    ats_safe: z.boolean(),
    contact_complete: z.boolean(),
    length_density_ok: z.boolean(),
    skills_normalized: z.boolean(),
  });
  
  
  export const GradeSchemaV2 = z.object({
    scores: z.object({
      format: z.number().min(0).max(5),
      impact: z.number().min(0).max(5),
      tech_depth: z.number().min(0).max(5),
      projects: z.number().min(0).max(5),
    }),
    focus_areas: z.array(z.enum(["format", "impact", "tech_depth", "projects"])).max(3),
    weak_bullets: z.array(
      z.object({
        section: z.enum(["experience", "projects", "education", "summary", "skills"]),
        idx: z.number().int().min(0),
        reason: z.string(),
      })
    ).max(8),
    format_checks: FormatChecksSchema,
  });
  
  export type FormatChecks = z.infer<typeof FormatChecksSchema>;
  export type GradeV2 = z.infer<typeof GradeSchemaV2>;