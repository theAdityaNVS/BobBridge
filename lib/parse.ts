// lib/parse.ts — extracts strict JSON contract from Granite output
import { jsonrepair } from 'jsonrepair';

export interface Contract {
  mock_response: unknown;
  code_boilerplate: string;
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
  // Support both old java_boilerplate and new code_boilerplate for backward compatibility
  const codeBoilerplate = obj.code_boilerplate || obj.java_boilerplate;
  if (typeof codeBoilerplate !== 'string' || codeBoilerplate.length === 0) {
    throw new MalformedContractError('Missing or empty code_boilerplate', raw);
  }
  if (typeof obj.suggested_path !== 'string') {
    throw new MalformedContractError('Missing suggested_path', raw);
  }
  if (obj.mock_response === undefined) {
    throw new MalformedContractError('Missing mock_response', raw);
  }

  return {
    mock_response: obj.mock_response,
    code_boilerplate: codeBoilerplate as string,
    suggested_path: obj.suggested_path,
    http_method: method as Contract['http_method'],
  };
}

// Made with Bob
