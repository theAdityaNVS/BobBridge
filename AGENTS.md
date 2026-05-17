# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## IBM Bob Context

IBM Bob is a VS Code fork with AI capabilities built-in, similar to Antigravity. It is NOT a VS Code extension but a standalone application. All references to IBM Bob should clarify this distinction.

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

### Input Validation
- `lib/validation.ts` provides guardrails against sensitive content generation
- Blocks passwords, credentials, SQL queries, system commands
- Validates prompt length and content before AI generation
- Real-time validation feedback in UI

### UI Layout
- 2-column layout on larger screens (mock result + Bob handoff)
- Bob handoff section uses sticky positioning and smooth animations
- Auto-scroll to results with delayed Bob section appearance
- Manual scroll adjustment for Bob section visibility

### IBM Branding
- IBM watsonx.ai logo component in `components/ibm-logo.tsx`
- Logo displayed in header and footer
- IBM Blue color palette throughout
- Robot emoji properly separated to avoid color issues

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