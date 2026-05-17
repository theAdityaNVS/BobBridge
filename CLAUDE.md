# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL

# Run dev server
npm run dev
```

## Common Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` — runs on http://localhost:3000 |
| Production build | `npm run build` |
| Start production server | `npm start` |
| Lint | `npm run lint` |
| Smoke tests | `./scripts/smoke.ps1` (PowerShell) or `./scripts/smoke.sh` (Bash) |

**Note on smoke tests:** Require dev server running on localhost:3000. Tests hit `/api/generate` and `/api/mock` endpoints to verify API layer.

## Architecture Overview

**BobBridge** is a hackathon project that converts plain-English endpoint descriptions into live mock URLs and framework-specific code scaffolds. The user selects one of 9 programming languages (Java/Python/JS/TS/Go/Rust/C#/PHP/Ruby) and the system generates a contract and ready-to-paste IBM Bob prompt for implementation.

### Core Layers

1. **Frontend (Next.js App Router)**
   - `app/page.tsx` — main UI with form, IBM branding, rotating tips banner
   - `components/` — React components: PromptForm (language/model selector), ResultPanel (2-column layout), BobHandoffSection (handoff instructions), TypingAnimation (framework animation)

2. **API Routes**
   - `app/api/generate/route.ts` — POST endpoint: validates input, calls watsonx.ai, parses JSON response, auto-retries on parse failure
   - `app/api/mock/[id]/route.ts` — GET/POST/PUT/DELETE/OPTIONS: serves same mock payload for all verbs, hardcoded CORS `*`

3. **Utilities (lib/)**
   - `watsonx.ts` — singleton AI client with IAM token refresh, temperature locked to 0
   - `prompt.ts` — language-aware system prompts (generates different prompts for each of the 9 languages)
   - `parse.ts` — 3-tier JSON fallback: raw JSON → strip markdown fences → jsonrepair
   - `store.ts` — module-level `Map` for ephemeral in-memory mock storage (per-function-instance, no persistence)
   - `bob-handoff.ts` — generates language-specific IBM Bob prompts with framework instructions
   - `validation.ts` — input guardrails (blocks passwords, SQL, credentials, system commands)
   - `types.ts` — shared types with language/region/model fields
   - `env.ts` — environment validation at module load time (crashes if vars missing)

### Design & Styling
- **IBM Blue palette** — #0f62fe and variants in `app/globals.css`
- **shadcn/ui** — component primitives
- **2-column layout** — mock result (left), Bob handoff (right) on larger screens
- **IBM watsonx.ai logo** — displayed in header/footer
- **Syntax highlighting** — `prism-react-renderer` for code blocks (supports all 9 languages)

## Non-Obvious Patterns

### Environment Variables
- **`lib/env.ts` validates at module load time** — missing vars crash immediately on import, not at runtime
- **Must use `.env.local`** (not `.env`) — Next.js reads this for dev server
- Error messages reference design spec for setup

### Mock Storage
- **Ephemeral, per-instance** — `lib/store.ts` uses module-level Map
- **Cold starts wipe mocks** — intentional for hackathon scope
- **No persistence** — production would need Upstash Redis or similar

### AI Response Handling
- **3-tier JSON parse fallback** in `lib/parse.ts`:
  1. Raw JSON
  2. Strip markdown fences (Granite sometimes wraps despite system prompt forbidding it)
  3. jsonrepair as last resort
- **Auto-retry logic** in `app/api/generate/route.ts` — if first parse fails, retries with stricter prompt

### API Route Patterns
- **`app/api/mock/[id]/route.ts` serves same payload for ALL HTTP verbs** (GET/POST/PUT/DELETE)
- **Next.js 16 async params** — must `await ctx.params` (not direct property access)

### Input Validation
- **`lib/validation.ts` provides guardrails** — prevents generation of sensitive content
- **Blocks:** passwords, credentials, SQL queries, system commands
- **Validates:** prompt length and content before calling watsonx.ai
- **Real-time feedback** in UI

### IBM Branding
- **Watsonx logo component** in `components/ibm-logo.tsx`
- **Logo display** in header and footer
- **IBM Blue color palette** throughout
- **Robot emoji separator** prevents color blending

### Language Support
- **9 languages supported:** Java (Spring Boot), Python (FastAPI), JS (Express), TS (NestJS), Go (Gin), Rust (Axum), C# (ASP.NET), PHP (Laravel), Ruby (Rails)
- **Language-aware prompts** in `lib/prompt.ts` — different system prompt per language
- **Language-aware Bob handoff** in `lib/bob-handoff.ts` — framework-specific instructions
- **Syntax highlighting** adapts to selected language
- **Code boilerplate** field in types is language-agnostic (previously Java-specific)

### Code Patterns
- **All source files end with `// Made with Bob`** — project signature
- **Singleton watsonx client** in `lib/watsonx.ts` — cached in module scope
- **Import aliases** — `@/*` maps to project root (tsconfig.json paths)
- **shadcn/ui convention** — use `@/components/ui` for primitives

## Git Conventions

- **Branch:** `main`
- **Commits:** descriptive, reference features/fixes
  - Prefix with `feat:`, `docs:`, `fix:`, etc.
  - e.g., `feat: add typing animation for multiple language frameworks`
- **Recent work focuses on multi-language support** — design spec updated 2026-05-17

## Testing

**Smoke tests** (`scripts/smoke.ps1` / `scripts/smoke.sh`):
- Verify `/api/generate` returns valid contract JSON
- Verify `/api/mock/{id}` serves mock endpoint
- Require dev server running

**No unit test framework configured** — hackathon scope.

## Key Files at a Glance

| File | Purpose |
|------|---------|
| `lib/env.ts` | Environment validation (crashes on missing vars) |
| `lib/watsonx.ts` | Singleton AI client, IAM token refresh |
| `lib/prompt.ts` | Language-specific system prompts |
| `lib/parse.ts` | 3-tier JSON parsing fallback |
| `lib/store.ts` | Ephemeral in-memory mock storage |
| `lib/validation.ts` | Input guardrails (sensitive content blocks) |
| `lib/bob-handoff.ts` | Language-aware IBM Bob prompt generation |
| `app/api/generate/route.ts` | Prompt → contract (with auto-retry) |
| `app/api/mock/[id]/route.ts` | Mock endpoint (all HTTP verbs) |
| `app/page.tsx` | Main UI with IBM branding |
| `components/prompt-form.tsx` | Language & model selector |
| `components/bob-handoff-section.tsx` | Bob integration handoff panel |
| `components/typing-animation.tsx` | Animated framework cycling |

## External Dependencies

- **`@ibm-cloud/watsonx-ai`** — AI SDK for Granite/Llama/Mistral
- **`@radix-ui/*`** — form/select/tabs primitives
- **`prism-react-renderer`** — syntax highlighting (all 9 languages)
- **`next-themes`** — dark/light mode toggle
- **`nanoid`** — short ID generation (8 chars)
- **`jsonrepair`** — fallback JSON parser
- **`sonner`** — toast notifications
- **`tailwindcss`** — styling + IBM Blue customization

## Vercel Deployment

```bash
vercel
```

Set environment variables via Vercel dashboard or CLI:
- `WATSONX_API_KEY` — IBM Cloud IAM key
- `WATSONX_PROJECT_ID` — watsonx.ai project ID
- `WATSONX_URL` — watsonx.ai API endpoint (typically `https://us-south.ml.cloud.ibm.com`)
- `WATSONX_MODEL_ID` (optional) — defaults to `ibm/granite-3-3-8b-instruct`

**Note:** Uses Vercel's Fluid Compute (Node 22+) by default. No Edge Functions required.
