'use client';

import { useState, useRef, useEffect } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { ResultPanel } from '@/components/result-panel';
import { BobHandoffSection } from '@/components/bob-handoff-section';
import { AITipsChatbot } from '@/components/ai-tips-chatbot';
import { PopularSearches } from '@/components/popular-searches';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Code2, Rocket, CheckCircle2 } from 'lucide-react';
import type { GenerateResponse } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<GenerateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const mockResultRef = useRef<HTMLDivElement>(null);
  const bobHandoffRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [bobSectionOffset, setBobSectionOffset] = useState(0);
  const latest = results[0];

  // Sync Bob section scroll with left column
  useEffect(() => {
    if (!latest) return;

    const handleScroll = () => {
      if (leftColumnRef.current && bobHandoffRef.current) {
        const leftRect = leftColumnRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the left column has been scrolled
        const scrollProgress = Math.max(0, -leftRect.top);
        
        // Apply the same offset to Bob section for synchronized scrolling
        setBobSectionOffset(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [latest]);

  const handlePopularSearchSelect = (search: { title: string; description: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE' }) => {
    setPrompt(search.description);
    setMethod(search.method);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* AI Tips Chatbot - Bottom Right with auto-popup */}
      <AITipsChatbot autoPopup={true} />

      {/* Hero Section with IBM Branding */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg ibm-gradient animate-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-animate">
                  BobBridge
                </h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <p className="text-xs text-muted-foreground">Powered by</p>
                  <span className="text-sm font-bold ibm-text-gradient animate-in fade-in duration-1000">IBM watsonx.ai</span>
                  <span className="text-xs text-muted-foreground">&</span>
                  <span className="text-xs text-muted-foreground">Built using</span>
                  <span className="text-sm font-bold ibm-text-gradient animate-in fade-in duration-1000" style={{ animationDelay: '200ms' }}>IBM Bob</span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Describe an endpoint. Get a live mock and a Bob-ready Spring Boot scaffold instantly.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Instant Mock APIs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Development Accelerated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Dynamic Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className={`grid gap-6 transition-all duration-500 ${latest ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Left Column: Form, Success Message, and Mock Result */}
          <div ref={leftColumnRef} className={`space-y-6 ${!latest ? 'max-w-2xl mx-auto w-full' : ''}`}>
            <div className="bg-card border rounded-xl shadow-lg p-4 sm:p-6">
              <PromptForm
                onResult={(r) => { setError(null); setResults((prev) => [r, ...prev]); }}
                onError={(msg) => setError(msg)}
                initialPrompt={prompt}
                initialMethod={method}
              />
            </div>

            {/* Success Message after generation */}
            {latest && (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Your mock is ready! 🎉</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Check the details below and hand off to IBM Bob on the right
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mock Result Panel */}
            {latest && (
              <div ref={mockResultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ResultPanel result={latest} />
              </div>
            )}

            {/* Popular Searches */}
            {!latest && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <PopularSearches onSelect={handlePopularSearchSelect} />
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertTitle>Generation failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column: Bob Handoff Section Only - Synced Scroll */}
          {latest && (
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div
                ref={bobHandoffRef}
                id="bob-handoff"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all"
                style={{
                  transform: `translateY(${Math.min(bobSectionOffset, 0)}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <BobHandoffSection
                  bobHandoff={latest.bobHandoff}
                  mockUrl={latest.mockUrl}
                />
              </div>
            </div>
          )}
        </div>

        {/* Recent Endpoints */}
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
                  {r.region && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {r.region}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer with IBM Branding */}
      <footer className="border-t mt-16 py-6 text-center text-sm text-muted-foreground">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <p className="font-medium">Built using</p>
            <span className="font-bold ibm-text-gradient">IBM Bob</span>
            <span className="text-lg" role="img" aria-label="robot" style={{ filter: 'none' }}>🤖</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>Powered by</span>
            <span className="text-sm font-bold ibm-text-gradient">IBM watsonx.ai</span>
          </div>
          <p className="text-xs">
            <span className="ibm-text-gradient font-semibold">IBM Bob</span> is a VS Code fork with AI capabilities • Accelerating Development with AI
          </p>
        </div>
      </footer>
    </main>
  );
}

// Made with Bob
