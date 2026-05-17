# Ask Mode Rules (Non-Obvious Only)

## Project Documentation Context

### Architecture Documentation
- Main design spec at `docs/superpowers/specs/2026-05-17-bobbridge-design.md`
- Contains setup instructions referenced in error messages (§9)
- Project plan at `docs/superpowers/plans/2026-05-17-bobbridge.md`

### Mock Storage Behavior
- `lib/store.ts` uses ephemeral in-memory Map — not persistent
- Cold starts wipe all mocks (intentional for hackathon scope)
- This is a known limitation documented in README.md

### Environment Setup
- Must use `.env.local` (not `.env`) for Next.js
- Error messages in `lib/env.ts` reference design doc for setup help
- Validates at module import time, not runtime

### Testing Approach
- Smoke tests in `scripts/` directory (PowerShell + Bash)
- No unit test framework — intentional for hackathon scope
- Tests require dev server running on localhost:3000

### AI Integration
- Uses IBM watsonx.ai with Granite model (`ibm/granite-3-3-8b-instruct`)
- Temperature locked to 0 for deterministic output
- Auto-retry logic handles malformed JSON responses

### Project Structure
- `lib/` contains core utilities (watsonx client, parsing, storage)
- `app/api/generate/` handles contract generation
- `app/api/mock/[id]/` serves mock endpoints
- `components/` contains UI components (shadcn/ui based)

### File Signature Convention
- All files end with `// Made with Bob` comment
- This is a project-wide convention, not a framework requirement