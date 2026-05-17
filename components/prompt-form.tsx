'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, Sparkles, ShieldAlert, Code2 } from 'lucide-react';
import { validatePrompt } from '@/lib/validation';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import type { GenerateResponse, SupportedLanguage } from '@/lib/types';

interface Props {
  onResult: (r: GenerateResponse & { fromCache?: boolean }) => void;
  onError: (msg: string) => void;
  initialPrompt?: string;
  initialMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

// Chat-capable models from models.md
const MODELS = [
  { id: 'ibm/granite-4-h-small', label: 'Granite 4H Small', description: 'Fast & efficient' },
  { id: 'meta-llama/llama-3-2-11b-vision-instruct', label: 'Llama 3.2 11B', description: 'Vision-capable' },
  { id: 'meta-llama/llama-3-3-70b-instruct', label: 'Llama 3.3 70B', description: 'Most powerful' },
  { id: 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8', label: 'Llama 4 Maverick', description: 'Latest model' },
  { id: 'mistralai/mistral-medium-2505', label: 'Mistral Medium', description: 'Balanced performance' },
  { id: 'mistralai/mistral-small-3-1-24b-instruct-2503', label: 'Mistral Small', description: 'Quick responses' },
] as const;

export function PromptForm({ onResult, onError, initialPrompt = '', initialMethod = 'GET' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(initialMethod);
  const [pathSlug, setPathSlug] = useState('');
  const [modelId, setModelId] = useState<string>(MODELS[0].id);
  const [language, setLanguage] = useState<SupportedLanguage>('java');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update prompt and method when props change
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialMethod) setMethod(initialMethod);
  }, [initialPrompt, initialMethod]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Validate input for sensitive content
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }
    
    setValidationError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, method, pathSlug: pathSlug || undefined, modelId, language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        onError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      const result = await res.json();
      const cacheStatus = res.headers.get('X-Cache');
      onResult({ ...result, fromCache: cacheStatus === 'HIT' });
      setIsCollapsed(true); // Collapse after successful generation
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  const selectedModel = MODELS.find(m => m.id === modelId);
  const selectedLanguage = SUPPORTED_LANGUAGES.find(l => l.id === language);

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-left"
        >
          <Label htmlFor="prompt" className="text-lg font-bold text-gradient-animate cursor-pointer">
            Describe Your Endpoint
          </Label>
          {isCollapsed && (
            <Badge variant="secondary" className="text-xs">
              Click to expand
            </Badge>
          )}
        </button>
        {!isCollapsed && (
          <>
            <Textarea
              id="prompt"
              rows={5}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setValidationError(null);
              }}
              placeholder="e.g., Fetch user order history with item name, price, and status"
              className="mt-2 resize-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            {validationError && (
              <Alert variant="destructive" className="mt-2">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            Language
          </Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as SupportedLanguage)}>
            <SelectTrigger id="language" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="method" className="text-sm font-medium">HTTP Method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
            <SelectTrigger id="method" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">Path Slug</Label>
          <Input
            id="slug"
            value={pathSlug}
            onChange={(e) => setPathSlug(e.target.value)}
            placeholder="orders"
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium flex items-center gap-2 flex-wrap">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Model
          </Label>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] w-fit">
            Powered by IBM Watson
          </Badge>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger id="model" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
      )}

      {!isCollapsed && selectedModel && selectedLanguage && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{selectedLanguage.label}</span> ({selectedLanguage.framework})
          </span>
          <span>•</span>
          <span>
            <span className="font-medium text-foreground">{selectedModel.label}</span> — {selectedModel.description}
          </span>
          <Badge variant="outline" className="text-xs">
            watsonx.ai
          </Badge>
        </div>
      )}

      {!isCollapsed && (
        <Button
        type="submit"
        disabled={loading || !prompt.trim()}
        size="lg"
        className="w-full ibm-gradient text-white hover:opacity-90 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {selectedModel?.label} is generating your contract…
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            Generate Mock & Contract
          </>
        )}
        </Button>
      )}
    </form>
  );
}

// Made with Bob
