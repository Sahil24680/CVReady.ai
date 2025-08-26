import { FormatChecks } from "@/lib/schemas";

export function computeFormatScore(f: FormatChecks): number {
  let score = 0;

  // Sections present (0/1/2)
  const s = f.sections_present;
  const presentCount =
    (s.experience ? 1 : 0) +
    (s.projects ? 1 : 0) +
    (s.education ? 1 : 0) +
    (s.skills ? 1 : 0);
  score += presentCount >= 4 ? 2 : presentCount === 3 ? 1 : 0;

  // Tense consistency (2)
  score += f.tense_consistency ? 2 : 0;

  // Bullet style consistency (2)
  score += f.bullet_style_consistency ? 2 : 0;

  // ATS safety (1)
  score += f.ats_safe ? 1 : 0;

  // Contact complete (1)
  score += f.contact_complete ? 1 : 0;

  // Length/density ok (1)
  score += f.length_density_ok ? 1 : 0;

  // Skills normalized (1)
  score += f.skills_normalized ? 1 : 0;

  // Clamp [1,10]
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

export function combineReadinessWithFormat(
  modelScore1to7: number,
  formatScore0to10: number
): number {

  const normalizedModel =
    modelScore1to7 > 7 ? (7 * modelScore1to7) / 10 : modelScore1to7;

  const model7 = Math.max(1, Math.min(7, Math.round(normalizedModel))); 
  const added = (3 * Math.max(0, Math.min(10, formatScore0to10))) / 10; 
  const final10 = model7 + added;

  return Math.max(1, Math.min(10, Math.round(final10 * 10) / 10)); 
}
