// lib/types.ts — shared client/server result shape

export type SupportedLanguage =
  | 'java'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'php'
  | 'ruby';

export interface LanguageConfig {
  id: SupportedLanguage;
  label: string;
  framework: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { id: 'java', label: 'Java', framework: 'Spring Boot 3', description: 'Enterprise-grade REST APIs' },
  { id: 'python', label: 'Python', framework: 'FastAPI', description: 'Modern async Python framework' },
  { id: 'javascript', label: 'JavaScript', framework: 'Express.js', description: 'Popular Node.js framework' },
  { id: 'typescript', label: 'TypeScript', framework: 'NestJS', description: 'Progressive Node.js framework' },
  { id: 'go', label: 'Go', framework: 'Gin', description: 'High-performance HTTP framework' },
  { id: 'rust', label: 'Rust', framework: 'Axum', description: 'Ergonomic web framework' },
  { id: 'csharp', label: 'C#', framework: 'ASP.NET Core', description: 'Cross-platform .NET framework' },
  { id: 'php', label: 'PHP', framework: 'Laravel', description: 'Elegant PHP framework' },
  { id: 'ruby', label: 'Ruby', framework: 'Rails', description: 'Convention over configuration' },
];

export interface GenerateResponse {
  id: string;
  mockUrl: string;
  mockResponse: unknown;
  codeBoilerplate: string;
  bobHandoff: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  language: SupportedLanguage;
  region?: string;
  modelUsed?: string;
}

// Made with Bob
