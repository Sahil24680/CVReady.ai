import type { Role } from "@/app/utils/rag/retrieve";

export const seedsByRole: Record<Role, string[]> = {
  "Backend Engineer": [
    "reduce API latency with Redis caching",
    "improve database query performance with indexes",
    "design scalable REST APIs with authentication",
    "add observability with metrics and logging",
  ],
  "Frontend Engineer": [
    "improve Lighthouse performance score",
    "add accessibility ARIA roles and keyboard navigation",
    "optimize React rendering with memoization",
    "improve UX with responsive Tailwind components",
  ],
  "Full-Stack Engineer": [
    "own UI to API to DB feature with measurable result",
    "implement JWT auth end-to-end",
    "implement CI/CD pipeline reducing deploy time",
    "design database schema for feature launch with impact",
  ],
};
