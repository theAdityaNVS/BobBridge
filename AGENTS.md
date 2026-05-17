# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Project Patterns

### Environment Variables
- `lib/env.ts` validates env vars at module load time (not runtime) — missing vars crash the app immediately on import
- Must use `.env.local` (not `.env`) for Next.js to pick up watsonx credentials
- Error messages reference `docs/superpowers/specs/2026-05-17-bobbridge-design.md §9` for setup instructions

### Mock Storage Architecture
- `lib/store.ts` uses module-level `Map` — storage is per-function-instance, ephemeral
- Cold starts wipe all mocks (intentional for hackathon scope)
- No persistence layer — production would need Upstash Redis or similar

### AI Response Handling
- `lib/parse.ts` has 3-tier fallback: raw JSON → strip fences → jsonrepair
- `app/api/generate/route.ts` auto-retries with stricter prompt if first parse fails
- Granite sometimes wraps JSON in markdown fences despite system prompt forbidding it

### API Route Patterns
- `app/api/mock/[id]/route.ts` serves same payload for ALL HTTP verbs (GET/POST/PUT/DELETE)
- CORS headers hardcoded to `*` for demo purposes
- Next.js 16 requires `await ctx.params` (async params API)

### Code Comments
- All files end with `// Made with Bob` comment (project signature)

### Testing
- Smoke tests in `scripts/` directory (PowerShell + Bash versions)
- Tests require dev server running on localhost:3000
- No unit test framework configured (hackathon scope)

### Import Aliases
- `@/*` maps to project root (configured in tsconfig.json paths)
- shadcn/ui components use `@/components/ui` convention

### WatsonX Client
- `lib/watsonx.ts` uses singleton pattern — client cached in module scope
- IAM token refresh handled automatically by SDK
- Temperature locked to 0 for deterministic contract generation