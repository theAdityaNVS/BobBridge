// lib/validation.ts — Input validation and guardrails

const SENSITIVE_PATTERNS = [
  // Password-related
  /password/i,
  /passwd/i,
  /pwd/i,
  /secret/i,
  /credential/i,
  /auth.*token/i,
  /api.*key/i,
  
  // SQL injection patterns
  /drop\s+table/i,
  /delete\s+from/i,
  /insert\s+into/i,
  /update\s+.*\s+set/i,
  /select\s+.*\s+from/i,
  /union\s+select/i,
  /exec\s*\(/i,
  /execute\s*\(/i,
  
  // System commands
  /rm\s+-rf/i,
  /sudo/i,
  /chmod/i,
  /eval\s*\(/i,
  
  // Sensitive data types
  /credit.*card/i,
  /ssn/i,
  /social.*security/i,
  /bank.*account/i,
  /routing.*number/i,
  /cvv/i,
  /pin.*code/i,
];

const SENSITIVE_KEYWORDS = [
  'password',
  'secret',
  'credential',
  'token',
  'api key',
  'private key',
  'sql',
  'drop table',
  'delete from',
  'credit card',
  'ssn',
  'social security',
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export function validatePrompt(prompt: string): ValidationResult {
  const trimmed = prompt.trim();
  
  // Check for empty input
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please provide a description of your endpoint',
    };
  }
  
  // Check for minimum length
  if (trimmed.length < 10) {
    return {
      isValid: false,
      error: 'Please provide a more detailed description (at least 10 characters)',
    };
  }
  
  // Check for sensitive patterns
  const lowerPrompt = trimmed.toLowerCase();
  const detectedPatterns: string[] = [];
  
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(trimmed)) {
      detectedPatterns.push(pattern.source);
    }
  }
  
  if (detectedPatterns.length > 0) {
    // Check if it's a legitimate use case (e.g., "user login endpoint")
    const isLegitimate = 
      /login/i.test(trimmed) || 
      /auth/i.test(trimmed) ||
      /sign.*in/i.test(trimmed);
    
    if (!isLegitimate || /generate.*password/i.test(trimmed) || /create.*password/i.test(trimmed)) {
      return {
        isValid: false,
        error: 'This prompt contains sensitive content that cannot be generated. Please describe a safe, non-sensitive endpoint instead.',
      };
    }
  }
  
  // Check for SQL-specific requests
  if (/generate.*sql/i.test(trimmed) || /create.*query/i.test(trimmed) || /sql.*query/i.test(trimmed)) {
    return {
      isValid: false,
      error: 'SQL query generation is not supported. Please describe a REST API endpoint instead.',
    };
  }
  
  // Check for excessive length
  if (trimmed.length > 1000) {
    return {
      isValid: false,
      error: 'Description is too long. Please keep it under 1000 characters.',
    };
  }
  
  return { isValid: true };
}

// Made with Bob