// lib/bob-handoff.ts — turns a stored mock into a copy-paste BobShell prompt
import type { MockEntry } from './store';
import type { SupportedLanguage } from './types';

const LANGUAGE_INSTRUCTIONS: Record<SupportedLanguage, string> = {
  java: 'Wire up: data layer (JPA entity + repository), input validation, integration tests, and OpenAPI spec entry.',
  python: 'Wire up: Pydantic models, database layer (SQLAlchemy), input validation, unit tests, and OpenAPI documentation.',
  javascript: 'Wire up: data models, database layer (Mongoose/Prisma), input validation, unit tests, and API documentation.',
  typescript: 'Wire up: DTOs, database layer (TypeORM/Prisma), validation pipes, unit tests, and Swagger documentation.',
  go: 'Wire up: structs, database layer (GORM), input validation, unit tests, and Swagger documentation.',
  rust: 'Wire up: structs with serde, database layer (sqlx/diesel), validation, unit tests, and OpenAPI documentation.',
  csharp: 'Wire up: models, Entity Framework, data annotations, unit tests, and Swagger documentation.',
  php: 'Wire up: models, Eloquent ORM, form requests, unit tests, and API documentation.',
  ruby: 'Wire up: models, ActiveRecord, strong parameters, RSpec tests, and API documentation.',
};

export function buildBobPrompt(entry: MockEntry): string {
  const instructions = LANGUAGE_INSTRUCTIONS[entry.language] || LANGUAGE_INSTRUCTIONS.java;
  
  return `@bob implement ${entry.language} endpoint matching this contract:

PATH: /api/${entry.path}
METHOD: ${entry.method}
RESPONSE SHAPE:
${JSON.stringify(entry.payload, null, 2)}

STARTING SCAFFOLD:
${entry.code}

${instructions}`;
}

// Made with Bob
