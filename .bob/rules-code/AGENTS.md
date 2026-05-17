# Code Mode Rules (Non-Obvious Only)

## Project-Specific Coding Patterns

### Module-Level Validation
- `lib/env.ts` throws at import time if env vars missing — crashes before any code runs
- This is intentional: fail-fast on misconfiguration rather than runtime errors

### JSON Parsing Strategy
- Always use `lib/parse.ts` parseContract() for AI responses, never raw JSON.parse()
- Has 3-tier fallback: raw → strip markdown fences → jsonrepair library
- Granite model sometimes wraps JSON in ```json fences despite prompt forbidding it

### Mock Storage Constraints
- `lib/store.ts` uses module-level Map — ephemeral, per-instance only
- No persistence across cold starts (intentional for hackathon scope)
- Production would require external store (Upstash Redis recommended)

### API Route Conventions
- `app/api/mock/[id]/route.ts` serves identical response for ALL HTTP verbs
- This is intentional: mock endpoints don't distinguish between GET/POST/PUT/DELETE
- Next.js 16 requires `await ctx.params` — params are async, not sync objects

### WatsonX Client Pattern
- `lib/watsonx.ts` uses singleton — client cached in module scope, not per-request
- Temperature hardcoded to 0 for deterministic output (not configurable)
- IAM token refresh handled by SDK automatically

### File Signature
- All files must end with `// Made with Bob` comment (project convention)

### Import Aliases
- Use `@/` prefix for all imports (maps to project root via tsconfig paths)
- shadcn/ui components always imported from `@/components/ui`

### Error Handling in Routes
- API routes use try-catch with specific error types (MalformedContractError)
- Auto-retry logic in `app/api/generate/route.ts` — retries once with stricter prompt
- Return 502 for AI failures, 400 for client errors, 404 for missing mocks