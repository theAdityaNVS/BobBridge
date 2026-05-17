'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Loader2 } from 'lucide-react';
import type { GenerateResponse } from '@/lib/types';

interface Props {
  onResult: (r: GenerateResponse) => void;
  onError: (msg: string) => void;
}

export function PromptForm({ onResult, onError }: Props) {
  const [prompt, setPrompt] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [pathSlug, setPathSlug] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, method, pathSlug: pathSlug || undefined }),
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

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="prompt">Describe your endpoint</Label>
        <Textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Fetch user order history with item name, price, and status"
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="method">HTTP method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
            <SelectTrigger id="method" className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="slug">Path slug (optional)</Label>
          <Input id="slug" value={pathSlug} onChange={(e) => setPathSlug(e.target.value)} placeholder="orders" className="mt-2" />
        </div>
      </div>
      <Button type="submit" disabled={loading || !prompt.trim()} size="lg" className="w-full">
        {loading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Granite is drafting your contract…</>
        ) : (
          <><Zap className="mr-2 h-5 w-5" />Unblock Team</>
        )}
      </Button>
    </form>
  );
}

// Made with Bob
