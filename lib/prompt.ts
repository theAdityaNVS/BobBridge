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

// Made with Bob
