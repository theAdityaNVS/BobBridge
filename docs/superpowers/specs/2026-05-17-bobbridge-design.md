# BobBridge — Design Spec

**Date:** 2026-05-17
**Hackathon:** lablab.ai IBM Bob Hackathon (May 15–17, 2026)
**Status:** Implemented with comprehensive UI redesign
**Last Updated:** 2026-05-17
**Time box:** 6–24 hours from spec approval

---

## 1. Problem & Thesis

Frontend teams are routinely blocked waiting for backend endpoints. BobBridge eliminates that wait: a plain-English description of an endpoint becomes (a) a live mock URL serving realistic JSON within seconds and (b) a Spring Boot scaffold a backend developer — or **IBM Bob** — can pick up and implement.

**Hybrid Bob framing (judging criterion alignment):**
BobBridge does not call Bob directly. Instead, it produces a contract + scaffold + a ready-to-paste IBM Bob prompt. The narrative: **BobBridge generates the contract; IBM Bob (a VS Code fork with AI capabilities, similar to Antigravity) implements the system.** This satisfies "clear application of IBM Bob" without requiring Bob API access during the demo.

**UI Enhancement (2026-05-17):**
Comprehensive redesign with IBM branding, IBM watsonx.ai logo integration, dedicated Bob handoff section with 2-column layout, rotating AI tips banner, geographic region display, input validation guardrails, and professional terminology throughout. The interface now prominently features IBM watsonx.ai logo and IBM Bob branding with "Launch IBM Bob" and "Download IBM Bob" action buttons. Added security features to prevent generation of sensitive content.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Runtime | Node 22+ on Vercel Fluid Compute |
| Styling | Tailwind CSS + shadcn/ui |
| AI | `@ibm-cloud/watsonx-ai` Node SDK |
| Model | `ibm/granite-3-3-8b-instruct` (current Granite; `granite-13b-chat-v2` is deprecated) |
| Auth | IBM Cloud IAM API key |
| Storage | In-memory `Map<string, MockEntry>` (per function instance, ephemeral) |
| Code highlighting | `shiki` (server-rendered, no client bundle bloat) |
| ID generation | `nanoid` (8-char slugs) |
| JSON robustness | `jsonrepair` (fallback parser) |
| Deployment | Vercel |

---

## 3. User Flow

1. User lands on `/` and sees rotating AI tips banner with educational content and IBM watsonx.ai logo.
2. Enters a plain-English endpoint description (validated for sensitive content), optionally selects HTTP method, path slug, and AI model.
3. Clicks **Generate Mock & Contract** (IBM gradient button). Loading state shows selected model name.
4. ~3–8s later, page auto-scrolls to results showing **2-column layout** (on larger screens):
   - **Left Column**: Mock endpoint with region badge (e.g., "us-south") and model information, JSON preview tab, Java boilerplate tab
   - **Right Column**: Dedicated Bob Handoff Section (appears with smooth animation after auto-scroll)
5. **Bob Handoff Section** features:
   - Ready-to-paste IBM Bob prompt
   - "Launch IBM Bob" button (opens IBM Bob application)
   - "Download IBM Bob" button (links to IBM Bob repository)
   - Clear explanation that IBM Bob is a VS Code fork
   - Sticky positioning on scroll
   - Next steps guide
6. Live endpoint URL prominently displayed with copy and open buttons.
7. Manual scroll adjustment: Bob section visibility adjusts based on scroll position.
8. "Recent endpoints (this session)" list shows previous generations with region badges.

---

## 4. Architecture

### 4.1 File layout

```
BobBridge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # main UI with IBM branding
│   ├── globals.css                   # IBM Blue color palette
│   └── api/
│       ├── generate/route.ts         # POST: prompt → result (with region)
│       └── mock/[id]/route.ts        # GET/POST/PUT/DELETE/OPTIONS
├── components/
│   ├── ai-tips-banner.tsx            # Rotating tips banner
│   ├── bob-handoff-section.tsx       # Dedicated Bob integration with 2-column layout
│   ├── ibm-logo.tsx                  # NEW: IBM watsonx.ai logo component
│   ├── prompt-form.tsx               # Model selector with validation
│   ├── result-panel.tsx              # Enhanced with region display
│   ├── code-block.tsx                # Syntax highlighting
│   ├── theme-toggle.tsx              # Dark/light mode
│   └── ui/                           # shadcn primitives
├── lib/
│   ├── watsonx.ts                    # IAM token + textChat wrapper
│   ├── prompt.ts                     # system prompt template
│   ├── parse.ts                      # robust JSON extraction
│   ├── store.ts                      # in-memory Map
│   ├── bob-handoff.ts                # IBM Bob prompt generator
│   ├── validation.ts                 # NEW: Input validation and guardrails
│   ├── types.ts                      # shared types (with region/model)
│   ├── env.ts                        # environment validation
│   └── utils.ts                      # cn helper
├── scripts/
│   ├── smoke.ps1
│   └── smoke.sh
├── docs/
│   └── superpowers/
│       ├── plans/
│       └── specs/
├── .env.example
├── README.md
├── UI_IMPROVEMENTS.md                # Comprehensive UI documentation
└── package.json
```

### 4.2 Module responsibilities

- **`lib/watsonx.ts`** — Exchanges `WATSONX_API_KEY` for an IAM access token (cached in-memory until expiry); exposes `generateContract(userPrompt: string): Promise<RawResponse>` that calls `textChat` with the system prompt.
- **`lib/prompt.ts`** — Single exported constant `SYSTEM_PROMPT` plus a `buildUserMessage(userPrompt, options)` helper.
- **`lib/parse.ts`** — `parseContract(raw: string): ContractResult` — tries `JSON.parse`, then strips markdown fences, then `jsonrepair`, then throws a typed error.
- **`lib/store.ts`** — Module-level `Map` with `put(id, entry)`, `get(id)`, `list()`. No eviction logic (hackathon scope).
- **`lib/bob-handoff.ts`** — `buildBobPrompt(entry): string` — produces the copy-paste BobShell prompt.

### 4.3 Data flow

```
User submits prompt
  → POST /api/generate { prompt, method?, pathSlug? }
     → watsonx.generateContract(prompt)
     → parse.parseContract(raw)
     → const id = nanoid(8)
     → store.put(id, { payload, method, javaCode, prompt, createdAt })
     → respond { id, mockUrl, mockResponse, javaBoilerplate, bobHandoff }

External consumer hits /api/mock/[id]
  → store.get(id)
  → 200 application/json with payload  OR  404 if missing/evicted
  → CORS: Access-Control-Allow-Origin: *
```

---

## 5. Prompt Design

Granite must return **strict JSON only** — no markdown fences, no prose.

### 5.1 System prompt

```
You are an API contract generator. Given a plain-English description of an
endpoint, output ONLY a single JSON object — no markdown, no commentary,
no code fences. The object must match exactly:

{
  "mock_response": <any valid JSON: realistic example data>,
  "java_boilerplate": "<Spring Boot 3 controller method as a single string,
                       imports included, using @RestController and @GetMapping
                       or appropriate verb>",
  "suggested_path": "<kebab-case URL segment, no leading slash>",
  "http_method": "<GET|POST|PUT|DELETE>"
}

Rules:
- mock_response must include 2-5 realistic example records when the endpoint
  returns a list.
- java_boilerplate must compile against Spring Boot 3, Java 17.
- Never include explanations. Output starts with { and ends with }.
```

### 5.2 Parsing pipeline

1. `JSON.parse(raw.trim())`
2. On failure: strip ` ```json … ``` ` fences → retry
3. On failure: `jsonrepair(raw)` → retry
4. On failure: throw `MalformedContractError` with raw output attached

### 5.3 Schema validation

Use a tiny inline check (not Zod — saves a dep): assert `mock_response` exists, `java_boilerplate` is non-empty string, `http_method` is one of the four verbs. Reject otherwise.

---

## 6. API Contracts

### POST `/api/generate`

**Request body:**
```ts
{ prompt: string; method?: "GET"|"POST"|"PUT"|"DELETE"; pathSlug?: string }
```

**Response 200:**
```ts
{
  id: string;            // e.g., "x7y9aB2k"
  mockUrl: string;       // absolute URL
  mockResponse: unknown; // the JSON payload
  javaBoilerplate: string;
  bobHandoff: string;    // BobShell prompt
  method: "GET"|"POST"|"PUT"|"DELETE";
  path: string;          // suggested or user-provided slug
}
```

**Error responses:** 400 (empty prompt), 502 (watsonx failure or malformed), 504 (timeout).

### `/api/mock/[id]` — GET, POST, PUT, DELETE

- All verbs return the stored `payload` with status 200.
- `OPTIONS` returns CORS headers (`*` origin, all verbs, common headers).
- 404 if `id` is unknown: `{ "error": "Mock not found or expired" }`.

---

## 7. Error Handling

| Failure | Behavior |
|---|---|
| Missing/invalid `WATSONX_API_KEY` | API route returns 500 with actionable error; UI shows "Check WATSONX_API_KEY in env" + setup link |
| IAM token exchange fails | 502 + retry once; surface root cause to UI |
| Granite returns malformed JSON | Auto-retry once with stricter prompt suffix ("Your previous response was not valid JSON. Output ONLY the JSON object."); on second failure return 502 with raw output for debugging |
| Granite times out (>30s) | Abort with 504; UI suggests shortening prompt |
| Mock ID not found | 404 JSON; README documents cold-start eviction |
| Cold-start lost the Map | Same as 404; pre-warm by generating demo mocks immediately before live demo |

---

## 8. Bob Handoff Generator

`lib/bob-handoff.ts` produces:

```
@bob implement Spring Boot endpoint matching this contract:

PATH: /api/{path}
METHOD: {method}
RESPONSE SHAPE:
{JSON-stringified mock_response}

STARTING SCAFFOLD:
{java_boilerplate}

Wire up: data layer (JPA entity + repository), input validation,
integration tests, and OpenAPI spec entry.
```

**UI Implementation (Enhanced):**
The prompt is now displayed in a dedicated `BobHandoffSection` component with:
- Prominent card with IBM gradient border
- "Ready for IBM Bob 🤖" heading with AI Assistant badge
- Copy button for the prompt
- "Open IBM Bob" button (VS Code protocol handler ready)
- "Install IBM Bob" button (links to VS Code marketplace)
- Next steps guide with bullet points
- Mock URL reference for frontend testing

---

## 9. Environment Variables

```
WATSONX_API_KEY=          # IBM Cloud IAM API key
WATSONX_PROJECT_ID=       # watsonx.ai project ID
WATSONX_URL=              # e.g., https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-3-8b-instruct  # overridable
```

Provided via `.env.local` for dev and Vercel project env for production.

---

## 10. Testing Strategy (time-boxed)

- **No unit tests.** Hackathon scope; manual smoke only.
- **`scripts/smoke.sh`** — POSTs a canonical demo prompt, asserts a `mockUrl` comes back, curls it, asserts `200 + application/json`. Run before recording the demo.
- **Canonical demo prompt:** `"Create an endpoint to fetch user order history with item name, price, and status."`

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| watsonx project setup takes longer than expected | Do this in Step 1 of implementation; if blocked >30 min, fall back to Replicate's Granite endpoint |
| Granite returns non-JSON | jsonrepair + retry-with-stricter-prompt |
| Demo hits cold-started instance, mocks gone | Pre-warm mocks immediately before walkthrough; document in README |
| Vercel deploy fails before demo | Local-only is the safety net (`npm run dev` on demo machine) |
| Granite output quality varies | Hardcode 2–3 known-good demo prompts as fallback if live generation flakes |

---

## 12. Implementation Order

To be detailed by the `writing-plans` skill after this spec is approved. High-level sequence:

1. Scaffold Next.js + Tailwind + shadcn
2. Wire up watsonx.ai SDK with IAM auth
3. Build `/api/generate` end-to-end (prompt → parse → store → respond)
4. Build `/api/mock/[id]` dynamic route
5. Build single-page UI with prompt form + result panel
6. Add Bob handoff tab + copy buttons + Shiki highlighting
7. Smoke test, README, deploy to Vercel
8. Pre-warm demo mocks, record demo

---

## 13. Out of Scope (explicit)

- User auth / accounts
- Persistent mock storage across deployments
- Mock editing or regeneration history
- Multi-region / multi-instance state sharing
- Streaming Granite responses
- OpenAPI export (only mentioned in Bob handoff text)
- Rate limiting
- Analytics

---

## 14. UI Redesign Implementation (2026-05-17)

### IBM Branding
- **Color Palette**: Official IBM Blue (#0f62fe) with full scale (10-100)
- **Gradients**: Custom `.ibm-gradient` and `.ibm-text-gradient` utilities
- **Typography**: IBM design language with proper hierarchy
- **Logo Integration**: IBM watsonx.ai logo component in header and footer
- **Components**: All UI elements updated with IBM styling

### New Components
1. **AITipsBanner** (`components/ai-tips-banner.tsx`)
   - 10 rotating educational tips
   - Auto-rotates every 6 seconds
   - Pauses on hover
   - Dismissible with close button
   - Progress indicators

2. **BobHandoffSection** (`components/bob-handoff-section.tsx`)
   - Dedicated section for IBM Bob integration
   - 2-column layout with sticky positioning
   - Action buttons: "Launch IBM Bob" and "Download IBM Bob"
   - Clear IBM Bob description (VS Code fork)
   - Next steps guide
   - Mock URL reference
   - IBM gradient styling
   - Smooth animation on appearance

3. **IBMWatsonxLogo** (`components/ibm-logo.tsx`)
   - SVG-based IBM watsonx.ai logo
   - Scalable and theme-aware
   - Used in header and footer

4. **Input Validation** (`lib/validation.ts`)
   - Comprehensive guardrails for sensitive content
   - Blocks passwords, credentials, SQL queries
   - Real-time validation feedback
   - Clear error messages

### Enhanced Features
- **Region Display**: Shows watsonx.ai region (extracted from WATSONX_URL)
- **Model Information**: Displays which AI model was used
- **2-Column Layout**: Mock result and Bob handoff side-by-side on larger screens
- **Smart Auto-scroll**: Automatically scrolls to results with delayed Bob section appearance
- **Manual Scroll Adjustment**: Bob section visibility adjusts based on scroll position
- **Professional Terminology**: "Generate Mock & Contract" instead of "Unblock Team"
- **Enhanced Header**: IBM watsonx.ai logo and IBM Bob branding
- **Improved Footer**: IBM Bob attribution with logo
- **Input Security**: Validation guardrails prevent sensitive content generation
- **Fixed Emoji Display**: Robot emoji properly displayed without color issues

### Technical Implementation
- Updated `lib/types.ts` with `region` and `modelUsed` fields
- Modified `app/api/generate/route.ts` to extract and return region
- Enhanced `components/result-panel.tsx` with region/model display
- Updated `components/prompt-form.tsx` with IBM gradient button
- Redesigned `app/page.tsx` with new layout and auto-scroll
- Added IBM Blue color palette to `app/globals.css`

### Documentation Updates
- Comprehensive `UI_IMPROVEMENTS.md` with all changes documented
- Updated `README.md` with new features and UI redesign section
- This design spec updated with implementation details
