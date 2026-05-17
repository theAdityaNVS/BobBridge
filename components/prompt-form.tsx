'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import type { GenerateResponse } from '@/lib/types';

interface Props {
  onResult: (r: GenerateResponse) => void;
  onError: (msg: string) => void;
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

export function PromptForm({ onResult, onError }: Props) {
  const [prompt, setPrompt] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [pathSlug, setPathSlug] = useState('');
  const [modelId, setModelId] = useState<string>(MODELS[0].id);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, method, pathSlug: pathSlug || undefined, modelId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        onError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      onResult(await res.json());
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  const selectedModel = MODELS.find(m => m.id === modelId);

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-base font-semibold">Describe your endpoint</Label>
        <Textarea
          id="prompt"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Fetch user order history with item name, price, and status"
          className="mt-2 resize-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <Label htmlFor="model" className="text-sm font-medium flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Model
          </Label>
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

      {selectedModel && (
        <p className="text-xs text-muted-foreground">
          Using <span className="font-medium">{selectedModel.label}</span> — {selectedModel.description}
        </p>
      )}

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
    </form>
  );
}

// Made with Bob
