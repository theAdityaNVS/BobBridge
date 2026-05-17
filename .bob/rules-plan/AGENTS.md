# Plan Mode Rules (Non-Obvious Only)

## Project Architecture Constraints

### Storage Architecture
- `lib/store.ts` uses module-level Map — per-instance, ephemeral storage
- No persistence across cold starts (intentional for hackathon scope)
- Production migration would require external store (Upstash Redis recommended)
- This is a known architectural limitation, not a bug

### AI Integration Architecture
- `lib/watsonx.ts` uses singleton pattern — client cached in module scope
- Temperature hardcoded to 0 for deterministic contract generation
- Auto-retry mechanism in `app/api/generate/route.ts` handles malformed responses
- Granite model sometimes wraps JSON in markdown fences despite prompt constraints

### API Design Patterns
- Mock endpoints serve identical response for ALL HTTP verbs (GET/POST/PUT/DELETE)
- This is intentional: mocks don't distinguish between verbs
- CORS headers hardcoded to `*` for demo purposes (not production-ready)

### Next.js 16 Constraints
- Route params are async in Next.js 16 — must `await ctx.params`
- This is a framework requirement, not a project choice

### Error Handling Strategy
- `lib/env.ts` validates at module import time — fail-fast on misconfiguration
- API routes return 502 for AI failures, 400 for client errors, 404 for missing mocks
- MalformedContractError triggers automatic retry with stricter prompt

### Testing Strategy
- Smoke tests only (no unit test framework)
- Tests require dev server running on localhost:3000
- Intentional for hackathon scope — not production-ready

### Code Organization
- `lib/` contains stateless utilities and singleton clients
- `app/api/` contains route handlers with embedded business logic
- No separate service layer (intentional for hackathon simplicity)

### File Signature Convention
- All files end with `// Made with Bob` comment
- Project-wide convention for attribution