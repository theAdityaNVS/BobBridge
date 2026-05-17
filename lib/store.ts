// lib/store.ts — module-level Map of mockId → entry. Per-instance, ephemeral.
import type { SupportedLanguage } from './types';

export interface MockEntry {
  id: string;
  payload: unknown;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  code: string;
  language: SupportedLanguage;
  prompt: string;
  createdAt: number;
}

const STORE = new Map<string, MockEntry>();

export const mockStore = {
  put(entry: MockEntry): void {
    STORE.set(entry.id, entry);
  },
  get(id: string): MockEntry | undefined {
    return STORE.get(id);
  },
  list(): MockEntry[] {
    return Array.from(STORE.values()).sort((a, b) => b.createdAt - a.createdAt);
  },
  size(): number {
    return STORE.size;
  },
};

// Made with Bob
