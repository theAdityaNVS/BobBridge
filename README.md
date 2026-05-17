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

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Runtime**: Node 22+ on Vercel
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: `@ibm-cloud/watsonx-ai` Node SDK
- **Model**: `ibm/granite-3-3-8b-instruct`
- **Auth**: IBM Cloud IAM API key
- **Storage**: In-memory `Map<string, MockEntry>`
- **Code highlighting**: `prism-react-renderer`
- **ID generation**: `nanoid`
- **JSON robustness**: `jsonrepair`

## Project Structure

```
BobBridge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # main UI
│   ├── globals.css
│   └── api/
│       ├── generate/route.ts     # POST: prompt → result
│       └── mock/[id]/route.ts    # GET/POST/PUT/DELETE/OPTIONS
├── components/
│   ├── prompt-form.tsx
│   ├── result-panel.tsx
│   ├── code-block.tsx
│   └── ui/                       # shadcn primitives
├── lib/
│   ├── watsonx.ts                # IAM token + textChat wrapper
│   ├── prompt.ts                 # system prompt template
│   ├── parse.ts                  # robust JSON extraction
│   ├── store.ts                  # in-memory Map
│   ├── bob-handoff.ts            # BobShell prompt generator
│   ├── types.ts                  # shared types
│   └── utils.ts                  # cn helper
├── scripts/
│   ├── smoke.ps1                 # PowerShell smoke test
│   └── smoke.sh                  # Bash smoke test
├── .env.example
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Testing

Run the smoke test script to verify the API layer:

```powershell
# PowerShell
./scripts/smoke.ps1
```

```bash
# Bash
./scripts/smoke.sh
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard or CLI:
- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `WATSONX_URL`
- `WATSONX_MODEL_ID` (optional, defaults to `ibm/granite-3-3-8b-instruct`)

## License

MIT