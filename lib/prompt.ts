// lib/prompt.ts — strict-JSON contract prompt for Granite

import type { SupportedLanguage, LanguageConfig, SUPPORTED_LANGUAGES } from './types';

const LANGUAGE_SPECS: Record<SupportedLanguage, { framework: string; version: string; example: string }> = {
  java: {
    framework: 'Spring Boot 3',
    version: 'Java 17+',
    example: '@RestController with @GetMapping/@PostMapping annotations',
  },
  python: {
    framework: 'FastAPI',
    version: 'Python 3.9+',
    example: '@app.get() or @app.post() decorators with async def',
  },
  javascript: {
    framework: 'Express.js',
    version: 'Node.js 18+',
    example: 'app.get() or app.post() with async/await',
  },
  typescript: {
    framework: 'NestJS',
    version: 'TypeScript 5+',
    example: '@Controller() with @Get()/@Post() decorators',
  },
  go: {
    framework: 'Gin',
    version: 'Go 1.21+',
    example: 'router.GET() or router.POST() with handler functions',
  },
  rust: {
    framework: 'Axum',
    version: 'Rust 1.75+',
    example: 'Router with get()/post() and async handler functions',
  },
  csharp: {
    framework: 'ASP.NET Core',
    version: 'C# 12 / .NET 8',
    example: '[HttpGet]/[HttpPost] attributes on controller methods',
  },
  php: {
    framework: 'Laravel',
    version: 'PHP 8.2+',
    example: 'Route::get()/Route::post() with controller methods',
  },
  ruby: {
    framework: 'Rails',
    version: 'Ruby 3.2+',
    example: 'get/post routes with controller actions',
  },
};

export function buildSystemPrompt(language: SupportedLanguage = 'java'): string {
  const spec = LANGUAGE_SPECS[language];
  return `You are an API contract generator. Given a plain-English description of an endpoint, output ONLY a single JSON object — no markdown, no commentary, no code fences. The object must match exactly:

{
  "mock_response": <any valid JSON: realistic example data>,
  "code_boilerplate": "<${spec.framework} endpoint implementation as a single string, imports included, using ${spec.example}>",
  "suggested_path": "<kebab-case URL segment, no leading slash>",
  "http_method": "<GET|POST|PUT|DELETE>"
}

Rules:
- mock_response must include 2-5 realistic example records when the endpoint returns a list.
- code_boilerplate must be valid ${language} code for ${spec.framework} (${spec.version}).
- Include all necessary imports and proper error handling.
- Never include explanations. Output starts with { and ends with }.`;
}

// Backward compatibility - default to Java
export const SYSTEM_PROMPT = buildSystemPrompt('java');

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

// Made with Bob
