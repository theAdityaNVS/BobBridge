// lib/cache.ts — In-memory cache for popular endpoint responses
import type { GenerateResponse } from '@/lib/types';

interface CacheEntry {
  response: GenerateResponse;
  timestamp: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 1000 * 60 * 60; // 1 hour TTL

  /**
   * Generate a cache key from prompt and method
   */
  private getCacheKey(prompt: string, method: string): string {
    return `${method}:${prompt.toLowerCase().trim()}`;
  }

  /**
   * Get cached response if available and not expired
   */
  get(prompt: string, method: string): GenerateResponse | null {
    const key = this.getCacheKey(prompt, method);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Store response in cache
   */
  set(prompt: string, method: string, response: GenerateResponse): void {
    const key = this.getCacheKey(prompt, method);
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if a response is cached
   */
  has(prompt: string, method: string): boolean {
    const key = this.getCacheKey(prompt, method);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const responseCache = new ResponseCache();

// Made with Bob