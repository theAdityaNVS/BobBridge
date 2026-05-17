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

// Made with Bob
