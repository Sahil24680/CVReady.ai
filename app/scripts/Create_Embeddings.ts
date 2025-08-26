// scripts/backfillEmbeddings.ts
// -------------------------------------------------------------------
// PURPOSE:
//   This is a one-time (or occasional) utility script for backfilling
//   missing embeddings in a vector table.
//   It finds rows without embeddings, generates vector embeddings
//   using OpenAI, and writes them back into the database.
//
//   ⚠️ WARNING: This script requires sensitive keys (OpenAI + Supabase Service Role).
//   Run it ONLY on your own machine or a secure server. NEVER expose or
//   ship this to the client.
//
// HOW TO RUN:
//   Make sure your .env.local contains:
//     - OPENAI_API_KEY
//     - NEXT_PUBLIC_SUPABASE_URL
//     - SUPABASE_SERVICE_ROLE
//
//   Then run from project root:
//     npx tsx app/scripts/Create_Embeddings.ts
// -------------------------------------------------------------------

import { config } from "dotenv";
config({ path: ".env.local" }); // load env vars from .env.local

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Initialize OpenAI client (for generating embeddings)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Initialize Supabase client (with service role for write access)
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

async function backfillRagEmbeddings(limit = 200) {
  // Step 1: Fetch rows that don’t yet have embeddings
  const { data: rows, error } = await sb
    .from("rag_chunks")
    .select("id, content")
    .is("embedding", null)
    .limit(limit);

  if (error) throw error;
  if (!rows || rows.length === 0) {
    console.log("✅ No rows need embedding.");
    return 0;
  }

  // Step 2: Ask OpenAI to generate embeddings for all missing rows
  //   - The "text-embedding-3-small" model outputs 1536-dimensional vectors
  //   - You can batch multiple inputs in a single request
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: rows.map((r) => r.content),
  });

  // Step 3: Write each generated embedding back into Supabase
  for (let i = 0; i < rows.length; i++) {
    const id = rows[i].id;
    const vec = emb.data[i].embedding as unknown as number[];

    const { error: upErr } = await sb
      .from("rag_chunks")
      .update({ embedding: vec })
      .eq("id", id);

    if (upErr) throw upErr;
  }

  console.log(`✅ Successfully embedded ${rows.length} rows.`);
  return rows.length;
}

// Entry point: run backfill with a batch size of 500
async function main() {
  const count = await backfillRagEmbeddings(500);
  console.log("🎉 Backfill complete. Total updated:", count);
}

// Handle any errors gracefully
main().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
