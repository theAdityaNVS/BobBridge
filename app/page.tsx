'use client';

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { ResultPanel } from '@/components/result-panel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { GenerateResponse } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<GenerateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const latest = results[0];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            BobBridge <span className="text-muted-foreground font-normal">— frontend unblocked</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Describe an endpoint. Get a live mock and a Bob-ready Spring Boot scaffold.
          </p>
        </header>

        <PromptForm
          onResult={(r) => { setError(null); setResults((prev) => [r, ...prev]); }}
          onError={(msg) => setError(msg)}
        />

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {latest && <ResultPanel result={latest} />}

        {results.length > 1 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Recent endpoints (this session)
            </h2>
            <ul className="space-y-1 text-sm">
              {results.slice(1).map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <Badge variant="outline">{r.method}</Badge>
                  <code className="font-mono">{r.mockUrl}</code>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

// Made with Bob
