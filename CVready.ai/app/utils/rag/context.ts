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
  
  export async function buildContext(role: Role, grading: GradeV2): Promise<string> {
    // 1) Example queries from weak bullets or fallback seeds
    const weakBullets = grading?.weak_bullets ?? [];
    const exampleQueries = weakBullets
      .slice(0, 3)
      .map(wb => (wb.reason?.trim() || "").slice(0, 200))
      .filter(Boolean);
  
    if (exampleQueries.length === 0) exampleQueries.push(...(seedsByRole[role] || []));
  
    // 2) Retrieve all sources
    const [rubricHits, keywordHits, jdHits] = await Promise.all([
      searchRubrics(role, 2),
      searchKeywords(role, 1),
      searchJD(role, 2),
    ]);
    const rewriteHits = await searchRewritePatterns(role, 3);
  
    // 3) Retrieve + filter examples
    const exampleHitsAll = (await Promise.all(exampleQueries.map(q => searchExamples(role, q, 4)))).flat();
  
    const seen = new Set<number>();
    const filtered = exampleHitsAll.filter(h => {
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return (h.score ?? 0) >= 0.55;
    });
  
    // 4) Diversify by primary tag
    const byTag: Record<string, any> = {};
    for (const h of filtered) {
      const key = String((h.metadata?.tags ?? ["misc"])[0]);
      if (!byTag[key]) byTag[key] = h;
    }
    const exampleHitsDiverse = Object.values(byTag).slice(0, 6);
  
    // 5) Build CONTEXT
    const sections: string[] = [];
    if (rubricHits.length) {
      sections.push("<RUBRICS>\n" + rubricHits.map(r => "- " + r.content).join("\n") + "\n</RUBRICS>");
    }
    if (exampleHitsDiverse.length) {
      sections.push("<EXAMPLES>\n" + exampleHitsDiverse.map(e => "- " + e.content).join("\n") + "\n</EXAMPLES>");
    }
    if (keywordHits.length) {
      sections.push("<ATS_KEYWORDS>\n" + keywordHits.map(k => k.content).join("\n") + "\n</ATS_KEYWORDS>");
    }
    if (jdHits.length) {
      sections.push("<JD>\n" + jdHits.map(j => "- " + j.content).join("\n") + "\n</JD>");
    }
    if (rewriteHits.length) {
      sections.push("<REWRITE_PATTERNS>\n" + rewriteHits.map(r => "- " + r.content).join("\n") + "\n</REWRITE_PATTERNS>");
    }
    
  
    return ["# CONTEXT (retrieved; do not invent beyond this)", ...sections].join("\n");
  }
  