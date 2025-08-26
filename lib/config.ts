export const MAX_FILE_SIZE_MB = 1;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const required = (val: string | undefined, name: string) => {
  if (!val) throw new Error(`[config] Missing env: ${name}`);
  return val;
};

export const OPENAI_CONF = {
  API_KEY: required(process.env.OPENAI_API_KEY, "OPENAI_API_KEY"),
  MODEL: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
  SMALL_MODEL: process.env.OPENAI_SMALL_MODEL || "gpt-4o-mini",
};

export const SYSTEM_PROMPT =
  `You are an expert Big Tech career advisor (ex-Google, Meta, Amazon) ` +
  `helping junior developers break into top companies. Be direct, supportive, and beginner-friendly.`;
