// lib/env.ts — read + validate watsonx env vars at module load
const required = ['WATSONX_API_KEY', 'WATSONX_PROJECT_ID', 'WATSONX_URL'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required env var ${key}. Copy .env.example to .env.local and fill in. See docs/superpowers/specs/2026-05-17-bobbridge-design.md §9.`,
    );
  }
}

export const env = {
  WATSONX_API_KEY: process.env.WATSONX_API_KEY!,
  WATSONX_PROJECT_ID: process.env.WATSONX_PROJECT_ID!,
  WATSONX_URL: process.env.WATSONX_URL!,
  WATSONX_MODEL_ID: process.env.WATSONX_MODEL_ID ?? 'ibm/granite-3-3-8b-instruct',
};

// Made with Bob
