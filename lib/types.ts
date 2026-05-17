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

// Made with Bob
