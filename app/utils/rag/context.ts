import {
  searchExamples,
  searchRubrics,
  searchKeywords,
  searchJD,
  searchRewritePatterns,
  type Role,
} from "@/app/utils/rag/retrieve";
import type { GradeV2 } from "@/lib/schemas";
import { seedsByRole } from "./roleSeeds";

/**
 * Builds the RAG context string for the deep analysis pass.
 * Retrieves relevant content from the vector database based on:
 * - The target role (e.g., "swe", "pm", "data")
 * - Weak bullets identified by the grader (used as search queries)
 *
 * Returns a formatted string with sections: RUBRICS, EXAMPLES, ATS_KEYWORDS, JD, REWRITE_PATTERNS
 */
export async function buildContext(role: Role, grading: GradeV2): Promise<string> {
  // Build search queries from weak bullet reasons (or use fallback seeds)
  const weakBullets = grading?.weak_bullets ?? [];
  const exampleQueries = weakBullets
    .slice(0, 5) // Limit to 5 weak bullets for query efficiency
    .map(wb => (wb.reason?.trim() || ""))
    .filter(Boolean);

  if (exampleQueries.length === 0) {
    exampleQueries.push(...seedsByRole[role]);
  }

  // Fetch all reference content in parallel for speed
  const [rubricHits, keywordHits, jdHits, rewriteHits] = await Promise.all([
    searchRubrics(role, 2),
    searchKeywords(role, 1),
    searchJD(role, 2),
    searchRewritePatterns(role, 3),
  ]);

  // Search for example bullets matching each weak area (4 results per query)
  const allExampleHits = (
    await Promise.all(exampleQueries.map(query => searchExamples(role, query, 4)))
  ).flat();

  // Deduplicate and filter by minimum similarity score
  const seenIds = new Set<number>();
  const MIN_SIMILARITY_SCORE = 0.55;
  const uniqueHighQualityHits = allExampleHits.filter(hit => {
    if (seenIds.has(hit.id)) return false;
    seenIds.add(hit.id);
    return (hit.score ?? 0) >= MIN_SIMILARITY_SCORE;
  });

  // Ensure diversity by keeping at most 1 example per tag category (max 6 total)
  const hitsByTag: Record<string, (typeof uniqueHighQualityHits)[0]> = {};
  for (const hit of uniqueHighQualityHits) {
    const tags = (hit.metadata?.tags ?? ["misc"]) as string[];
    const primaryTag = String(tags[0]);
    if (!hitsByTag[primaryTag]) {
      hitsByTag[primaryTag] = hit;
    }
  }
  const diverseExamples = Object.values(hitsByTag).slice(0, 6);

  // Assemble context sections in XML-like format for the prompt
  const contextSections: string[] = [];

  if (rubricHits.length) {
    contextSections.push(
      "<RUBRICS>\n" + rubricHits.map(r => "- " + r.content).join("\n") + "\n</RUBRICS>"
    );
  }
  if (diverseExamples.length) {
    contextSections.push(
      "<EXAMPLES>\n" + diverseExamples.map(e => "- " + e.content).join("\n") + "\n</EXAMPLES>"
    );
  }
  if (keywordHits.length) {
    contextSections.push(
      "<ATS_KEYWORDS>\n" + keywordHits.map(k => k.content).join("\n") + "\n</ATS_KEYWORDS>"
    );
  }
  if (jdHits.length) {
    contextSections.push(
      "<JD>\n" + jdHits.map(j => "- " + j.content).join("\n") + "\n</JD>"
    );
  }
  if (rewriteHits.length) {
    contextSections.push(
      "<REWRITE_PATTERNS>\n" + rewriteHits.map(r => "- " + r.content).join("\n") + "\n</REWRITE_PATTERNS>"
    );
  }

  return ["# CONTEXT (retrieved; do not invent beyond this)", ...contextSections].join("\n");
}
