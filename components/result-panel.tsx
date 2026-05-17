'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from './code-block';
import type { GenerateResponse } from '@/lib/types';

interface Props {
  result: GenerateResponse;
}

export function ResultPanel({ result }: Props) {
  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{result.method}</Badge>
          <code className="text-sm font-mono break-all">{result.mockUrl}</code>
          <Button size="sm" variant="ghost" onClick={() => copy(result.mockUrl, 'URL')}>
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json">
          <TabsList>
            <TabsTrigger value="json">JSON preview</TabsTrigger>
            <TabsTrigger value="java">Java boilerplate</TabsTrigger>
            <TabsTrigger value="bob">Hand off to Bob</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <CodeBlock code={JSON.stringify(result.mockResponse, null, 2)} lang="json" />
          </TabsContent>
          <TabsContent value="java">
            <CodeBlock code={result.javaBoilerplate} lang="java" />
            <Button size="sm" className="mt-2" onClick={() => copy(result.javaBoilerplate, 'Java')}>
              <Copy className="h-4 w-4 mr-2" />Copy Java
            </Button>
          </TabsContent>
          <TabsContent value="bob">
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap">{result.bobHandoff}</pre>
            <Button size="sm" className="mt-2" onClick={() => copy(result.bobHandoff, 'Bob prompt')}>
              <Copy className="h-4 w-4 mr-2" />Copy Bob prompt
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Made with Bob
