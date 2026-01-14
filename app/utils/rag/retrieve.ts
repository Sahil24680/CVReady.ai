import OpenAI from "openai";
import { createClient as createSbServer } from "@/app/utils/supabase/server";
import { type Role } from "@/lib/schemas";

export type { Role };
export type Level = "beginner";

/**
 * RAG collection types stored in the vector database.
 * Each collection contains different types of reference content:
 * - rubrics: scoring criteria for resume evaluation
 * - examples: sample resume bullets and content
 * - keywords: ATS-friendly keywords by role
 * - jd: job description snippets for context
 * - rewrite_patterns: templates for improving weak bullets
 * - anti_patterns: common mistakes to avoid
 */
export const COLLECTIONS = [
  "rubrics",
  "examples",
  "keywords",
  "jd",
  "rewrite_patterns",
  "anti_patterns",
] as const;

export type Collection = (typeof COLLECTIONS)[number];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Creates a vector embedding for a text string using OpenAI's embedding model.
 * Used for semantic similarity search in the vector database.
 */
async function embedText(text: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: [text],
  });
  return data[0].embedding as unknown as number[];
}

/**
 * Performs semantic search against the vector database.
 * Calls a Postgres RPC function that uses pgvector for similarity matching.
 *
 * @param collection - Which content bucket to search (rubrics, examples, etc.)
 * @param role - Target job role to filter results
 * @param level - Experience level filter (currently only "beginner" supported)
 * @param queryText - Text to convert to embedding and search for
 * @param topK - Maximum number of results to return
 */
export async function ragSearch({
  collection,
  role,
  level = "beginner",
  queryText,
  topK = 5,
}: {
  collection: Collection;
  role: Role;
  level?: Level;
  queryText: string;
  topK?: number;
}) {
  const supabase = await createSbServer();
  const queryEmbedding = await embedText(queryText);

  const { data, error } = await supabase.rpc("rag_search", {
    p_collection: collection,
    p_role: role,
    p_level: level,
    p_company: null, // reserved for company-specific content
    p_query_vec: queryEmbedding,
    p_limit: topK,
  });
  if (error) throw error;

  return data as { id: number; content: string; metadata: Record<string, unknown>; score: number }[];
}

// ----- Convenience wrappers for each collection type -----

/** Search for example resume bullets matching a specific weakness */
export async function searchExamples(role: Role, queryText: string, topK = 5) {
  return ragSearch({ collection: "examples", role, queryText, topK });
}

/** Retrieve scoring rubrics for a role */
export async function searchRubrics(role: Role, topK = 2) {
  return ragSearch({ collection: "rubrics", role, queryText: `${role} beginner rubric`, topK });
}

/** Get ATS-friendly keywords for a role */
export async function searchKeywords(role: Role, topK = 1) {
  return ragSearch({ collection: "keywords", role, queryText: `${role} beginner keywords ATS`, topK });
}

/** Retrieve relevant job description snippets */
export async function searchJD(role: Role, topK = 2) {
  return ragSearch({ collection: "jd", role, queryText: `${role} beginner JD`, topK });
}

/** Get bullet rewrite patterns/templates */
export async function searchRewritePatterns(role: Role, topK = 3) {
  return ragSearch({ collection: "rewrite_patterns", role, queryText: `${role} beginner bullet rewrite`, topK });
}

/** Retrieve common resume anti-patterns to avoid */
export async function searchAntiPatterns(role: Role, topK = 2) {
  return ragSearch({ collection: "anti_patterns", role, queryText: `${role} beginner resume anti-patterns`, topK });
}
