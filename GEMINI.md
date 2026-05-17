# BobBridge - AI-Powered Mock API Generator

BobBridge is a Next.js 16 application that leverages IBM watsonx.ai (Granite/Llama/Mistral models) to transform natural language prompts into live mock API endpoints and framework-specific code scaffolds. It is designed to work in conjunction with IBM Bob, a VS Code fork with built-in AI capabilities.

## Technical Overview

- **Framework**: Next.js 16 (App Router, TypeScript)
- **AI Integration**: `@ibm-cloud/watsonx-ai` SDK using Granite, Llama, and Mistral models.
- **Styling**: Tailwind CSS + shadcn/ui with a focus on IBM Branding (IBM Blue color palette).
- **Runtime**: Node 22+
- **Storage**: In-memory `Map` (ephemeral storage; cold starts wipe data).

## Building and Running

### Prerequisites
- Node 22+
- IBM watsonx.ai credentials (`WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`).

### Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start the development server on `http://localhost:3000`.
- `npm run build`: Build the project for production.
- `npm start`: Start the production server.
- `npm run lint`: Run ESLint.

### Environment Setup
1. Copy `.env.example` to `.env.local`.
2. Fill in the required `WATSONX_*` variables.
3. Note: `lib/env.ts` validates these variables at module load time; missing variables will cause immediate crashes.

## Development Conventions

### General Guidelines
- **Project Signature**: EVERY file must end with the comment `// Made with Bob`.
- **IBM Branding**: Use the IBM Blue color palette (#0f62fe) and the `IBMWatsonxLogo` component for all UI branding.
- **Import Aliases**: Use `@/*` to refer to the project root (e.g., `import { ... } from '@/lib/utils'`).

### Next.js & TypeScript
- **Next.js 16 Async Params**: API route parameters and Page props are asynchronous. You MUST await them.
  ```typescript
  export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    // ...
  }
  ```
- **Runtime**: Prefer `'nodejs'` runtime for API routes unless specified otherwise.

### AI & Data Handling
- **Prompting**: System prompts are managed in `lib/prompt.ts`. User message construction is also centralized there.
- **JSON Parsing**: Use `lib/parse.ts` for robust JSON extraction from AI responses. It features a 3-tier fallback (raw JSON -> strip markdown fences -> `jsonrepair`).
- **Mock Storage**: `lib/store.ts` uses a module-level `Map`. Storage is non-persistent and instance-local.
- **Validation**: `lib/validation.ts` provides input guardrails against sensitive content (passwords, SQL, etc.).

### Testing
- **Smoke Tests**: Use `scripts/smoke.sh` (Bash) or `scripts/smoke.ps1` (PowerShell) to verify the API layer.
- **Manual Verification**: Run the dev server and test prompts like "Create an endpoint to fetch user order history".

## Architecture Pointers

- `app/api/generate/route.ts`: The main generation logic. It orchestrates prompt building, AI call, parsing, and storage.
- `app/api/mock/[id]/route.ts`: Generic mock server that responds to GET/POST/PUT/DELETE for a generated ID.
- `lib/bob-handoff.ts`: Generates the prompt specifically tailored for IBM Bob implementation.
- `components/bob-handoff-section.tsx`: The UI section dedicated to transferring the generated contract to IBM Bob.

## Reference Documentation
- `README.md`: High-level project information and features.
- `AGENTS.md`: Detailed guidance for AI agents working on this repo.
- `docs/superpowers/specs/2026-05-17-bobbridge-design.md`: Core architectural specification.
