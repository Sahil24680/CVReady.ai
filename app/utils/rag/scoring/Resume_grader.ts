import { FormatChecks } from "@/lib/schemas";

/**
 * Computes a deterministic format score (1-10) from the format checklist.
 * This score is combined with the AI's readiness score for the final rating.
 *
 * Point breakdown:
 * - Sections present: 0-2 points (4 sections = 2, 3 sections = 1)
 * - Tense consistency: 2 points
 * - Bullet style consistency: 2 points
 * - ATS safety: 1 point
 * - Contact complete: 1 point
 * - Length/density OK: 1 point
 * - Skills normalized: 1 point
 *
 * Maximum possible: 10 points
 */
export function computeFormatScore(formatChecks: FormatChecks): number {
  let score = 0;

  // Count how many required sections are present (experience, projects, education, skills)
  const sections = formatChecks.sections_present;
  const sectionCount =
    (sections.experience ? 1 : 0) +
    (sections.projects ? 1 : 0) +
    (sections.education ? 1 : 0) +
    (sections.skills ? 1 : 0);
  score += sectionCount >= 4 ? 2 : sectionCount === 3 ? 1 : 0;

  // Consistency checks (highest value items)
  score += formatChecks.tense_consistency ? 2 : 0;
  score += formatChecks.bullet_style_consistency ? 2 : 0;

  // Individual format checks (1 point each)
  score += formatChecks.ats_safe ? 1 : 0;
  score += formatChecks.contact_complete ? 1 : 0;
  score += formatChecks.length_density_ok ? 1 : 0;
  score += formatChecks.skills_normalized ? 1 : 0;

  return Math.max(1, Math.min(10, Math.round(score)));
}

export const DEFAULT_FORMAT_CHECKS: FormatChecks = {
  sections_present: {
    experience: true,
    projects: true,
    education: true,
    skills: true,
  },
  tense_consistency: true,
  bullet_style_consistency: false,
  ats_safe: true,
  contact_complete: true,
  length_density_ok: false,
  skills_normalized: false,
};

/**
 * Combines the AI model's readiness score with the deterministic format score
 * to produce the final 1-10 rating shown to users.
 *
 * Formula: final = readiness (1-7) + format bonus (0-3)
 * - Readiness score: 70% weight (capped at 7)
 * - Format score: 30% weight (scaled from 0-10 to 0-3)
 *
 * @param modelScore1to7 - AI-generated content quality score (1-7)
 * @param formatScore0to10 - Deterministic format checklist score (0-10)
 * @returns Final score between 1 and 10
 */
export function combineReadinessWithFormat(
  modelScore1to7: number,
  formatScore0to10: number
): number {
  // Normalize if model returned a score > 7 (shouldn't happen but handle gracefully)
  const normalizedModelScore =
    modelScore1to7 > 7 ? (7 * modelScore1to7) / 10 : modelScore1to7;

  // Clamp readiness to 1-7 range
  const readinessComponent = Math.max(1, Math.min(7, Math.round(normalizedModelScore)));

  // Scale format score from 0-10 to 0-3 (30% of final score)
  const formatBonus = (3 * Math.max(0, Math.min(10, formatScore0to10))) / 10;

  const finalScore = readinessComponent + formatBonus;

  return Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));
}
