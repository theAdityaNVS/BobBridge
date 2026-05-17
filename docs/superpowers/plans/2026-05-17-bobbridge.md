# BobBridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js app that turns a plain-English endpoint description into (a) a live mock URL serving Granite-generated JSON and (b) a Spring Boot scaffold + ready-to-paste BobShell prompt — in under 24 hours for the IBM Bob hackathon.

**Architecture:** Next.js 16 App Router (TypeScript) with two API routes: `/api/generate` (POST → watsonx.ai Granite → in-memory store) and `/api/mock/[id]` (any verb → stored payload). UI is a single page with prompt form + tabbed result panel (JSON / Java / Bob handoff).

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4, shadcn/ui, `@ibm-cloud/watsonx-ai`, `ibm/granite-3-3-8b-instruct`, `prism-react-renderer`, nanoid, jsonrepair, Vercel deploy.

**Testing strategy:** Per spec §10, no unit tests. Each task ends with a manual smoke check (curl / browser) and a commit.

---

## Task 0: Pre-flight — Provision watsonx.ai project + credentials

**Files:**
- Create (later): `.env.local`

This is the only blocker that prevents the rest of the build. User has an IBM Cloud account but no watsonx.ai project. **Do this first**, in parallel with reading the rest of the plan.

- [ ] **Step 1: Create a watsonx.ai project**

In a browser:
1. Sign in to https://dataplatform.cloud.ibm.com
2. Top-right "+" → **New project** → name it `bobbridge`
3. When prompted for storage, accept the default (creates a free IBM Cloud Object Storage instance)
4. Open the project → **Manage** tab → copy the **Project ID** (UUID)

- [ ] **Step 2: Generate an IBM Cloud IAM API key**

1. Go to https://cloud.ibm.com/iam/apikeys
2. **Create** → name `bobbridge-dev` → **Create**
3. Copy the API key immediately (it is shown only once)

- [ ] **Step 3: Associate the watsonx.ai service with the project**

1. In the project, **Manage** tab → **Services & integrations** → **Associate service**
2. Pick the watsonx.ai Runtime service in the same region (Dallas / `us-south` is fine)
3. If none exists, click **New service** to provision a free `Lite` plan first

- [ ] **Step 4: Note your region's service URL**

| Region | URL |
|---|---|
| Dallas | `https://us-south.ml.cloud.ibm.com` |
| Frankfurt | `https://eu-de.ml.cloud.ibm.com` |
| London | `https://eu-gb.ml.cloud.ibm.com` |
| Tokyo | `https://jp-tok.ml.cloud.ibm.com` |

- [ ] **Step 5: Stash the three values somewhere safe**

You will need:
- `WATSONX_API_KEY` — the IAM API key from Step 2
- `WATSONX_PROJECT_ID` — the project UUID from Step 1
- `WATSONX_URL` — the region URL from Step 4

Do NOT commit these. They go in `.env.local` in Task 3.

---

## Task 1: Initialize Next.js project + git repo + commit the spec

**Files:**
- Create: entire Next.js scaffold via `create-next-app`
- Create: `.gitignore` (auto)
- Modify: nothing yet (the design spec already lives at `docs/superpowers/specs/2026-05-17-bobbridge-design.md`)

- [ ] **Step 1: Scaffold Next.js 16 in the current directory**

Run from the project root (`C:\Users\nadam\Coding\Hackathons\IBM Bob Lablab.ai 2026\BobBridge`):

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: scaffolds `app/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`. The `docs/` folder remains untouched.

- [ ] **Step 2: Initialize git and make the first commit**

```powershell
git init
git add .
git commit -m "chore: scaffold Next.js 16 + commit BobBridge design spec"
```

Expected: one commit on `main` (or `master` — accept whichever git defaults to).

- [ ] **Step 3: Smoke check — dev server boots**

```powershell
npm run dev
```

Open http://localhost:3000 in a browser. Expect Next.js welcome page. Kill the dev server (Ctrl-C) before moving on.

---

## Task 2: Install runtime dependencies + initialize shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components.json` (via shadcn init)
- Create: `lib/utils.ts` (via shadcn init)
- Create: `components/ui/` directory (via shadcn add)

- [ ] **Step 1: Install runtime dependencies**

```powershell
npm install @ibm-cloud/watsonx-ai ibm-cloud-sdk-core nanoid jsonrepair prism-react-renderer lucide-react
```

- [ ] **Step 2: Initialize shadcn/ui non-interactively**

```powershell
npx shadcn@latest init --yes --base-color slate
```

Accept defaults. This creates `components.json`, `lib/utils.ts`, and updates Tailwind config.

- [ ] **Step 3: Add the shadcn components we will use**

```powershell
npx shadcn@latest add button textarea input label tabs card alert badge select skeleton sonner --yes
```

Expected: files appear under `components/ui/`.

- [ ] **Step 4: Commit**

```powershell
git add .
git commit -m "chore: install deps and initialize shadcn/ui"
```

---

## Task 3: Add environment loader + `.env.local`

**Files:**
- Create: `.env.local` (NOT committed — `.gitignore` already excludes it)
- Create: `.env.example` (committed, no secrets)
- Create: `lib/env.ts`

- [ ] **Step 1: Create `.env.example`**

```bash
# .env.example — copy to .env.local and fill in
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-3-8b-instruct
```

- [ ] **Step 2: Create `.env.local` with real values**

Copy `.env.example` to `.env.local` and paste the three values stashed in Task 0 Step 5.

- [ ] **Step 3: Create `lib/env.ts`**

```ts
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
```

- [ ] **Step 4: Commit**

```powershell
git add .env.example lib/env.ts
git commit -m "feat: add env loader and example file"
```

---

## Task 4: Build `lib/watsonx.ts` — IAM auth + textChat wrapper

**Files:**
- Create: `lib/watsonx.ts`

- [ ] **Step 1: Create `lib/watsonx.ts`**

```ts
// lib/watsonx.ts — single watsonx.ai client, exposes generateContract()
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import { env } from './env';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt';

let client: WatsonXAI | null = null;

function getClient(): WatsonXAI {
  if (client) return client;
  client = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: env.WATSONX_URL,
    authenticator: new IamAuthenticator({ apikey: env.WATSONX_API_KEY }),
  });
  return client;
}

export interface GenerateOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pathSlug?: string;
  stricter?: boolean; // used on retry after malformed output
}

export async function generateContract(
  userPrompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  const svc = getClient();
  const response = await svc.textChat({
    modelId: env.WATSONX_MODEL_ID,
    projectId: env.WATSONX_PROJECT_ID,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserMessage(userPrompt, options) },
    ],
    temperature: 0,
    maxTokens: 2500,
  });

  const content = response.result?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.length === 0) {
    throw new Error('watsonx returned empty content');
  }
  return content;
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/watsonx.ts
git commit -m "feat: watsonx client with IAM auth and textChat wrapper"
```

---

## Task 5: Build `lib/prompt.ts` — system prompt + user message builder

**Files:**
- Create: `lib/prompt.ts`

- [ ] **Step 1: Create `lib/prompt.ts`**

```ts
// lib/prompt.ts — strict-JSON contract prompt for Granite

export const SYSTEM_PROMPT = `You are an API contract generator. Given a plain-English description of an endpoint, output ONLY a single JSON object — no markdown, no commentary, no code fences. The object must match exactly:

{
  "mock_response": <any valid JSON: realistic example data>,
  "java_boilerplate": "<Spring Boot 3 controller method as a single string, imports included, using @RestController and @GetMapping or appropriate verb annotation>",
  "suggested_path": "<kebab-case URL segment, no leading slash>",
  "http_method": "<GET|POST|PUT|DELETE>"
}

Rules:
- mock_response must include 2-5 realistic example records when the endpoint returns a list.
- java_boilerplate must compile against Spring Boot 3, Java 17.
- Never include explanations. Output starts with { and ends with }.`;

export function buildUserMessage(
  userPrompt: string,
  options: { method?: string; pathSlug?: string; stricter?: boolean } = {},
): string {
  const parts: string[] = [userPrompt];
  if (options.method) parts.push(`HTTP method: ${options.method}`);
  if (options.pathSlug) parts.push(`Path slug (use as suggested_path): ${options.pathSlug}`);
  if (options.stricter) {
    parts.push(
      'Your previous response was not valid JSON. Output ONLY the JSON object — no fences, no prose. Begin with { and end with }.',
    );
  }
  return parts.join('\n\n');
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/prompt.ts
git commit -m "feat: system prompt and user message builder"
```

---

## Task 6: Build `lib/parse.ts` — robust JSON extraction

**Files:**
- Create: `lib/parse.ts`

- [ ] **Step 1: Create `lib/parse.ts`**

```ts
// lib/parse.ts — extracts strict JSON contract from Granite output
import { jsonrepair } from 'jsonrepair';

export interface Contract {
  mock_response: unknown;
  java_boilerplate: string;
  suggested_path: string;
  http_method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export class MalformedContractError extends Error {
  constructor(message: string, public readonly raw: string) {
    super(message);
    this.name = 'MalformedContractError';
  }
}

const VERBS = new Set(['GET', 'POST', 'PUT', 'DELETE']);

function stripFences(s: string): string {
  return s.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

function tryParse(s: string): unknown | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function parseContract(raw: string): Contract {
  const candidates: string[] = [raw.trim(), stripFences(raw)];
  try {
    candidates.push(jsonrepair(raw));
  } catch {
    // jsonrepair itself threw — fine, fall through
  }

  let parsed: unknown = null;
  for (const c of candidates) {
    parsed = tryParse(c);
    if (parsed) break;
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new MalformedContractError('Could not parse Granite output as JSON', raw);
  }

  const obj = parsed as Record<string, unknown>;
  const method = String(obj.http_method ?? 'GET').toUpperCase();
  if (!VERBS.has(method)) {
    throw new MalformedContractError(`Invalid http_method: ${obj.http_method}`, raw);
  }
  if (typeof obj.java_boilerplate !== 'string' || obj.java_boilerplate.length === 0) {
    throw new MalformedContractError('Missing or empty java_boilerplate', raw);
  }
  if (typeof obj.suggested_path !== 'string') {
    throw new MalformedContractError('Missing suggested_path', raw);
  }
  if (obj.mock_response === undefined) {
    throw new MalformedContractError('Missing mock_response', raw);
  }

  return {
    mock_response: obj.mock_response,
    java_boilerplate: obj.java_boilerplate,
    suggested_path: obj.suggested_path,
    http_method: method as Contract['http_method'],
  };
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/parse.ts
git commit -m "feat: robust JSON parsing with jsonrepair fallback"
```

---

## Task 7: Build `lib/store.ts` — in-memory mock store

**Files:**
- Create: `lib/store.ts`

- [ ] **Step 1: Create `lib/store.ts`**

```ts
// lib/store.ts — module-level Map of mockId → entry. Per-instance, ephemeral.
export interface MockEntry {
  id: string;
  payload: unknown;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  javaCode: string;
  prompt: string;
  createdAt: number;
}

const STORE = new Map<string, MockEntry>();

export const mockStore = {
  put(entry: MockEntry): void {
    STORE.set(entry.id, entry);
  },
  get(id: string): MockEntry | undefined {
    return STORE.get(id);
  },
  list(): MockEntry[] {
    return Array.from(STORE.values()).sort((a, b) => b.createdAt - a.createdAt);
  },
  size(): number {
    return STORE.size;
  },
};
```

- [ ] **Step 2: Commit**

```powershell
git add lib/store.ts
git commit -m "feat: in-memory mock store"
```

---

## Task 8: Build `lib/bob-handoff.ts` — BobShell prompt generator

**Files:**
- Create: `lib/bob-handoff.ts`

- [ ] **Step 1: Create `lib/bob-handoff.ts`**

```ts
// lib/bob-handoff.ts — turns a stored mock into a copy-paste BobShell prompt
import type { MockEntry } from './store';

export function buildBobPrompt(entry: MockEntry): string {
  return `@bob implement Spring Boot endpoint matching this contract:

PATH: /api/${entry.path}
METHOD: ${entry.method}
RESPONSE SHAPE:
${JSON.stringify(entry.payload, null, 2)}

STARTING SCAFFOLD:
${entry.javaCode}

Wire up: data layer (JPA entity + repository), input validation, integration tests, and OpenAPI spec entry.`;
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/bob-handoff.ts
git commit -m "feat: Bob handoff prompt generator"
```

---

## Task 9: Build `/api/generate` route

**Files:**
- Create: `app/api/generate/route.ts`

- [ ] **Step 1: Create `app/api/generate/route.ts`**

```ts
// app/api/generate/route.ts — POST: prompt → Granite → store → return result
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateContract } from '@/lib/watsonx';
import { parseContract, MalformedContractError } from '@/lib/parse';
import { mockStore } from '@/lib/store';
import { buildBobPrompt } from '@/lib/bob-handoff';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface GenerateRequest {
  prompt?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pathSlug?: string;
}

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  let raw: string;
  try {
    raw = await generateContract(prompt, { method: body.method, pathSlug: body.pathSlug });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'watsonx call failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  let contract;
  try {
    contract = parseContract(raw);
  } catch (e) {
    if (e instanceof MalformedContractError) {
      try {
        const retry = await generateContract(prompt, {
          method: body.method,
          pathSlug: body.pathSlug,
          stricter: true,
        });
        contract = parseContract(retry);
      } catch (retryErr) {
        const raw2 = retryErr instanceof MalformedContractError ? retryErr.raw : raw;
        return NextResponse.json(
          { error: 'Granite returned malformed JSON twice', raw: raw2 },
          { status: 502 },
        );
      }
    } else {
      throw e;
    }
  }

  const id = nanoid(8);
  const path = body.pathSlug || contract.suggested_path || 'endpoint';
  const entry = {
    id,
    payload: contract.mock_response,
    method: (body.method ?? contract.http_method) as 'GET' | 'POST' | 'PUT' | 'DELETE',
    path,
    javaCode: contract.java_boilerplate,
    prompt,
    createdAt: Date.now(),
  };
  mockStore.put(entry);

  const origin = req.nextUrl.origin;
  return NextResponse.json({
    id,
    mockUrl: `${origin}/api/mock/${id}`,
    mockResponse: contract.mock_response,
    javaBoilerplate: contract.java_boilerplate,
    bobHandoff: buildBobPrompt(entry),
    method: entry.method,
    path,
  });
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/api/generate/route.ts
git commit -m "feat: /api/generate route end-to-end"
```

---

## Task 10: Build `/api/mock/[id]` dynamic route

**Files:**
- Create: `app/api/mock/[id]/route.ts`

- [ ] **Step 1: Create `app/api/mock/[id]/route.ts`**

```ts
// app/api/mock/[id]/route.ts — serves the stored mock payload for any verb
import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/store';

export const runtime = 'nodejs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function serve(id: string) {
  const entry = mockStore.get(id);
  if (!entry) {
    return NextResponse.json(
      { error: 'Mock not found or expired' },
      { status: 404, headers: CORS },
    );
  }
  return NextResponse.json(entry.payload, { status: 200, headers: CORS });
}

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function POST(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function PUT(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/api/mock/[id]/route.ts
git commit -m "feat: /api/mock/[id] dynamic route with CORS"
```

---

## Task 11: Smoke test the API layer end-to-end

**Files:**
- None created (manual checks only)

- [ ] **Step 1: Start the dev server**

```powershell
npm run dev
```

Leave running in a separate terminal.

- [ ] **Step 2: POST to /api/generate**

In another PowerShell window:

```powershell
$body = @{ prompt = "Create an endpoint to fetch user order history with item name, price, and status." } | ConvertTo-Json
$result = Invoke-RestMethod -Uri http://localhost:3000/api/generate -Method Post -Body $body -ContentType "application/json"
$result | ConvertTo-Json -Depth 6
```

Expected: response contains `id`, `mockUrl`, `mockResponse`, `javaBoilerplate`, `bobHandoff`. Note the `id`.

- [ ] **Step 3: GET the mock URL**

```powershell
Invoke-RestMethod -Uri $result.mockUrl -Method Get | ConvertTo-Json -Depth 6
```

Expected: same `mockResponse` payload returned.

- [ ] **Step 4: Verify 404 on bogus id**

```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/mock/nope1234" -Method Get } catch { $_.Exception.Response.StatusCode }
```

Expected: `NotFound` / 404.

- [ ] **Step 5: Stop the dev server (Ctrl-C). No commit — nothing changed.**

If any check failed, fix and re-run before continuing. Common failures:
- 502 from `/api/generate`: check `.env.local` values; check region URL matches the watsonx service.
- "Missing required env var": `.env.local` not loaded — confirm filename, restart `npm run dev`.

---

## Task 12: Build the UI shell — prompt form + result panel layout

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx` (add Sonner toaster)
- Create: `components/prompt-form.tsx`
- Create: `components/result-panel.tsx`
- Create: `lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
// lib/types.ts — shared client/server result shape
export interface GenerateResponse {
  id: string;
  mockUrl: string;
  mockResponse: unknown;
  javaBoilerplate: string;
  bobHandoff: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
}
```

- [ ] **Step 2: Modify `app/layout.tsx` — add Sonner**

Add `import { Toaster } from '@/components/ui/sonner';` and render `<Toaster />` inside `<body>` after `{children}`.

- [ ] **Step 3: Create `components/prompt-form.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Loader2 } from 'lucide-react';
import type { GenerateResponse } from '@/lib/types';

interface Props {
  onResult: (r: GenerateResponse) => void;
  onError: (msg: string) => void;
}

export function PromptForm({ onResult, onError }: Props) {
  const [prompt, setPrompt] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [pathSlug, setPathSlug] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, method, pathSlug: pathSlug || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        onError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      onResult(await res.json());
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="prompt">Describe your endpoint</Label>
        <Textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Fetch user order history with item name, price, and status"
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="method">HTTP method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
            <SelectTrigger id="method" className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="slug">Path slug (optional)</Label>
          <Input id="slug" value={pathSlug} onChange={(e) => setPathSlug(e.target.value)} placeholder="orders" className="mt-2" />
        </div>
      </div>
      <Button type="submit" disabled={loading || !prompt.trim()} size="lg" className="w-full">
        {loading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Granite is drafting your contract…</>
        ) : (
          <><Zap className="mr-2 h-5 w-5" />Unblock Team</>
        )}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Create `components/result-panel.tsx`**

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from './code-block';
import type { GenerateResponse } from '@/lib/types';

interface Props {
  result: GenerateResponse;
}

export function ResultPanel({ result }: Props) {
  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{result.method}</Badge>
          <code className="text-sm font-mono break-all">{result.mockUrl}</code>
          <Button size="sm" variant="ghost" onClick={() => copy(result.mockUrl, 'URL')}>
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json">
          <TabsList>
            <TabsTrigger value="json">JSON preview</TabsTrigger>
            <TabsTrigger value="java">Java boilerplate</TabsTrigger>
            <TabsTrigger value="bob">Hand off to Bob</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <CodeBlock code={JSON.stringify(result.mockResponse, null, 2)} lang="json" />
          </TabsContent>
          <TabsContent value="java">
            <CodeBlock code={result.javaBoilerplate} lang="java" />
            <Button size="sm" className="mt-2" onClick={() => copy(result.javaBoilerplate, 'Java')}>
              <Copy className="h-4 w-4 mr-2" />Copy Java
            </Button>
          </TabsContent>
          <TabsContent value="bob">
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap">{result.bobHandoff}</pre>
            <Button size="sm" className="mt-2" onClick={() => copy(result.bobHandoff, 'Bob prompt')}>
              <Copy className="h-4 w-4 mr-2" />Copy Bob prompt
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

Note: `CodeBlock` is built in Task 13. Until then, replace each `<CodeBlock …/>` line with a plain `<pre className="bg-muted p-4 rounded-md overflow-auto text-sm">{code}</pre>` so the page still renders.

- [ ] **Step 5: Replace `app/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { ResultPanel } from '@/components/result-panel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { GenerateResponse } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<GenerateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const latest = results[0];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            BobBridge <span className="text-muted-foreground font-normal">— frontend unblocked</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Describe an endpoint. Get a live mock and a Bob-ready Spring Boot scaffold.
          </p>
        </header>

        <PromptForm
          onResult={(r) => { setError(null); setResults((prev) => [r, ...prev]); }}
          onError={(msg) => setError(msg)}
        />

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {latest && <ResultPanel result={latest} />}

        {results.length > 1 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Recent endpoints (this session)
            </h2>
            <ul className="space-y-1 text-sm">
              {results.slice(1).map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <Badge variant="outline">{r.method}</Badge>
                  <code className="font-mono">{r.mockUrl}</code>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Smoke check**

Start `npm run dev`, open http://localhost:3000, submit the canonical prompt ("Create an endpoint to fetch user order history with item name, price, and status."), confirm tabs render and the mock URL works in a new tab. Stop the dev server.

- [ ] **Step 7: Commit**

```powershell
git add app components lib/types.ts
git commit -m "feat: prompt form, result panel, page composition"
```

---

## Task 13: Add syntax highlighting via prism-react-renderer

**Files:**
- Create: `components/code-block.tsx`

(`result-panel.tsx` already imports `CodeBlock` from Task 12; once this file exists, the Java + JSON tabs upgrade automatically.)

- [ ] **Step 1: Create `components/code-block.tsx`**

```tsx
'use client';

import { Highlight, themes } from 'prism-react-renderer';

interface Props {
  code: string;
  lang: 'java' | 'json';
}

export function CodeBlock({ code, lang }: Props) {
  return (
    <Highlight code={code} language={lang} theme={themes.vsDark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 rounded-md overflow-auto text-sm`}
          style={style}
        >
          {tokens.map((line, i) => {
            const { key: _lineKey, ...lineProps } = getLineProps({ line });
            return (
              <div key={i} {...lineProps}>
                {line.map((token, j) => {
                  const { key: _tokenKey, ...tokenProps } = getTokenProps({ token });
                  return <span key={j} {...tokenProps} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
```

- [ ] **Step 2: Smoke check**

Start `npm run dev`, regenerate the demo endpoint, confirm Java + JSON tabs render with syntax colors. Stop the dev server.

- [ ] **Step 3: Commit**

```powershell
git add components/code-block.tsx
git commit -m "feat: prism-react-renderer syntax highlighting"
```

---

## Task 14: README + smoke script + final polish

**Files:**
- Create: `README.md`
- Create: `scripts/smoke.ps1`
- Create: `scripts/smoke.sh`

- [ ] **Step 1: Create `README.md`**

```markdown
# BobBridge

> Frontend unblocked. Describe an endpoint, get a live mock URL and a Bob-ready Spring Boot scaffold.

Built for the lablab.ai IBM Bob hackathon (May 15–17, 2026).

## What it does

Plain-English prompt → IBM Granite (via watsonx.ai) → strict-JSON contract → in-memory mock served at `/api/mock/{id}` + Spring Boot controller scaffold + ready-to-paste BobShell prompt.

**The thesis:** BobBridge produces the contract; IBM Bob implements the system.

## Quick start

```bash
cp .env.example .env.local   # fill in WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL
npm install
npm run dev
```

Open http://localhost:3000.

## Demo prompt

> Create an endpoint to fetch user order history with item name, price, and status.

## Known limitations (hackathon scope)

- Mock storage is an in-memory `Map` per function instance — a cold start wipes everything. Fine for demo, swap to Upstash Redis for production.
- No auth, no rate limiting, no persistence across deployments.

## Architecture

See `docs/superpowers/specs/2026-05-17-bobbridge-design.md`.
```

- [ ] **Step 2: Create `scripts/smoke.ps1`**

```powershell
# scripts/smoke.ps1 — POST a demo prompt, then GET the returned mock URL
$ErrorActionPreference = 'Stop'
$body = @{ prompt = "Create an endpoint to fetch user order history with item name, price, and status." } | ConvertTo-Json
$result = Invoke-RestMethod -Uri http://localhost:3000/api/generate -Method Post -Body $body -ContentType "application/json"
Write-Host "OK Generated id: $($result.id)"
Write-Host "   Mock URL:    $($result.mockUrl)"
$mock = Invoke-RestMethod -Uri $result.mockUrl -Method Get
$chars = ($mock | ConvertTo-Json -Depth 6).Length
Write-Host "OK Mock returned $chars chars of JSON"
```

- [ ] **Step 3: Create `scripts/smoke.sh` (bash fallback)**

```bash
#!/usr/bin/env bash
set -euo pipefail
RES=$(curl -s -X POST http://localhost:3000/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Create an endpoint to fetch user order history with item name, price, and status."}')
URL=$(node -pe "JSON.parse(process.argv[1]).mockUrl" "$RES")
echo "OK Mock URL: $URL"
curl -sf "$URL" | head -c 200
echo
echo "OK Mock URL serves JSON"
```

- [ ] **Step 4: Smoke check**

Start `npm run dev`, then in another terminal:

```powershell
./scripts/smoke.ps1
```

Expected: prints generated id, mock URL, and "OK Mock returned …" line. Stop the dev server.

- [ ] **Step 5: Commit**

```powershell
git add README.md scripts/
git commit -m "docs: README and smoke scripts"
```

---

## Task 15: Deploy to Vercel

**Files:**
- None modified (Vercel writes `.vercel/` which is gitignored)

- [ ] **Step 1: Install Vercel CLI if missing**

```powershell
npm i -g vercel
vercel --version
```

- [ ] **Step 2: Link the project**

```powershell
vercel link --yes
```

Accept defaults; let Vercel auto-detect Next.js.

- [ ] **Step 3: Set env vars in Vercel**

```powershell
vercel env add WATSONX_API_KEY production
vercel env add WATSONX_PROJECT_ID production
vercel env add WATSONX_URL production
```

Paste the value for each when prompted. Repeat with `preview` and `development` targets if you want preview deploys to work.

- [ ] **Step 4: Deploy preview**

```powershell
vercel
```

Open the printed preview URL. Submit the demo prompt. Confirm it works.

- [ ] **Step 5: Promote to production**

```powershell
vercel --prod
```

Note the production URL — that's the demo URL.

---

## Task 16: Pre-warm demo + final dry run

**Files:**
- None

- [ ] **Step 1: Pre-warm the production instance**

Hit the production URL once to warm the function. Then immediately submit the canonical demo prompt to make sure the in-memory store has at least one entry primed.

- [ ] **Step 2: Bookmark URLs you will demo**

- Production page
- One pre-warmed `/api/mock/{id}` URL (open in a new tab to show it serving JSON live)

- [ ] **Step 3: Practice the 90-second pitch**

1. "Frontend teams wait days for backend endpoints. This wait is the bottleneck." (5s)
2. Type the canonical prompt. Click **Unblock Team**. (10s)
3. Show the live `/api/mock/{id}` URL serving JSON in a new tab. (15s)
4. Switch to **Java boilerplate** tab. "Spring Boot scaffold, Bob-ready." (15s)
5. Switch to **Hand off to Bob** tab. "Paste this into BobShell and Bob takes it from here. BobBridge writes the contract, Bob implements the system." (30s)
6. Close with the thesis: "Frontend ships without waiting. Bob picks up where BobBridge left off." (15s)

- [ ] **Step 4: Push final commit and tag (optional — only if a GitHub remote exists)**

```powershell
git push -u origin HEAD
git tag v1.0-hackathon
git push origin v1.0-hackathon
```

---

## Self-Review

**Spec coverage check (spec §-by-§):**
- §1 thesis → narrative in README + Task 16 pitch ✓
- §2 tech stack → Tasks 1, 2 install correct versions (note: spec said Shiki, plan uses prism-react-renderer due to XSS hook on dangerouslySetInnerHTML — equivalent capability, smaller bundle) ✓
- §3 user flow → Tasks 12, 13 build the UI ✓
- §4 architecture → Tasks 4–10 implement every module in §4.2 ✓
- §5 prompt design → Tasks 5, 6 implement system prompt + parsing pipeline + schema validation ✓
- §6 API contracts → Tasks 9, 10 match request/response shapes ✓
- §7 error handling → Task 9 retry-with-stricter-prompt; Task 10 404 + CORS; Task 12 inline error alert ✓
- §8 Bob handoff → Task 8 generator + Task 12 tab ✓
- §9 env vars → Task 3 ✓
- §10 testing → Task 11 + Task 14 smoke scripts ✓
- §11 risks → Task 0 frontloads watsonx setup; README documents cold-start ✓
- §12 implementation order → this plan ✓
- §13 out-of-scope → respected throughout (no auth, no persistence, no rate limit) ✓

**Placeholder scan:** No TBDs, no "add error handling", every code step contains complete code. ✓

**Type consistency:** `MockEntry` shape used identically in `store.ts`, `bob-handoff.ts`, `app/api/generate/route.ts`. `GenerateResponse` shape matches between `app/api/generate/route.ts` response and `lib/types.ts`. `Contract` interface used only in `parse.ts` and consumed via destructuring. `GenerateOptions` defined in `watsonx.ts`, accepted shape mirrored inline in `prompt.ts` (independent type to avoid a circular import). ✓

---
