'use client';

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { ResultPanel } from '@/components/result-panel';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Code2 } from 'lucide-react';
import type { GenerateResponse } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<GenerateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const latest = results[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                BobBridge
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Describe an endpoint. Get a live mock and a Bob-ready Spring Boot scaffold.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 className="h-4 w-4" />
              <span>Instant Mocks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Frontend Unblocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-card border rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <PromptForm
            onResult={(r) => { setError(null); setResults((prev) => [r, ...prev]); }}
            onError={(msg) => setError(msg)}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {latest && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultPanel result={latest} />
          </div>
        )}

        {results.length > 1 && (
          <section className="mt-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-border"></span>
              Recent endpoints (this session)
              <span className="h-px flex-1 bg-border"></span>
            </h2>
            <div className="grid gap-2">
              {results.slice(1).map((r, idx) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Badge variant="outline" className="shrink-0">{r.method}</Badge>
                  <code className="font-mono text-sm truncate flex-1">{r.mockUrl}</code>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 text-center text-sm text-muted-foreground">
        <p>Made with Bob • Powered by IBM watsonx.ai</p>
      </footer>
    </main>
  );
}

// Made with Bob
