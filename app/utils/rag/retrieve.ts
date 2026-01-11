import OpenAI from "openai";
import { createClient as createSbServer } from "@/app/utils/supabase/server";
import { type Role } from "@/lib/schemas";

export type { Role };
export type Level = "beginner";

// Fixed list of logical buckets in the vector table
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

// Embed a single query string using OpenAI embeddings
async function embedOne(text: string) {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: [text], // single string input
  });
  return data[0].embedding as unknown as number[]; // -> Float array for pgvector RPC
}

// Generic RAG search that hits your Postgres function `rag_search`
export async function ragSearch({
  collection,
  role,
  level = "beginner",
  queryText,
  topK = 5,
}: {
  collection: Collection;          // which bucket to search
  role: Role;                      // role filter passed to RPC
  level?: Level;                   // level filter (Currenlty set up for "beginner")
  queryText: string;               // text to embed + search by
  topK?: number;                   // Number of results to return
}) {
  const supabase = await createSbServer();
  const vec = await embedOne(queryText);

  const { data, error } = await supabase.rpc("rag_search", {
    p_collection: collection,
    p_role: role,
    p_level: level,
    p_company: null,   // reserved for later; currently unused
    p_query_vec: vec,  // the embedding vector
    p_limit: topK,
  });
  if (error) throw error;

  // Expected shape from RPC
  return data as { id: number; content: string; metadata: any; score: number }[];
}

// Thin helpers with pre-baked collection + default query strings
export async function searchExamples(role: Role, queryText: string, topK = 5) {
  return ragSearch({ collection: "examples", role, queryText, topK });
}
export async function searchRubrics(role: Role, topK = 2) {
  return ragSearch({ collection: "rubrics", role, queryText: `${role} beginner rubric`, topK });
}
export async function searchKeywords(role: Role, topK = 1) {
  return ragSearch({ collection: "keywords", role, queryText: `${role} beginner keywords ATS`, topK });
}
export async function searchJD(role: Role, topK = 2) {
  return ragSearch({ collection: "jd", role, queryText: `${role} beginner JD`, topK });
}
export async function searchRewritePatterns(role: Role, topK = 3) {
  return ragSearch({ collection: "rewrite_patterns", role, queryText: `${role} beginner bullet rewrite`, topK });
}
export async function searchAntiPatterns(role: Role, topK = 2) {
  return ragSearch({ collection: "anti_patterns", role, queryText: `${role} beginner resume anti-patterns`, topK });
}
