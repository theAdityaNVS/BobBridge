'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, ExternalLink, Globe } from 'lucide-react';
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
    toast.success(`${label} copied`, {
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  }

  return (
    <Card className="border-2 shadow-xl" id="mock-result">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl">Your Mock is Ready! 🎉</CardTitle>
            <CardDescription>
              Test your frontend immediately with this live endpoint
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-base px-3 py-1">
              {result.method}
            </Badge>
            {result.region && (
              <Badge variant="outline" className="text-sm px-2 py-1 gap-1">
                <Globe className="h-3 w-3" />
                {result.region.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
          <code className="text-sm font-mono flex-1 break-all">{result.mockUrl}</code>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copy(result.mockUrl, 'Mock URL')}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(result.mockUrl, '_blank')}
            className="shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Region and Model Info */}
        {(result.region || result.modelUsed) && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t">
            {result.region && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>IBM watsonx.ai Region: <span className="font-medium">{result.region}</span></span>
              </div>
            )}
            {result.modelUsed && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Model: <span className="font-medium">{result.modelUsed}</span></span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="text-sm">
              📋 JSON Preview
            </TabsTrigger>
            <TabsTrigger value="java" className="text-sm">
              ☕ Java Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mock response payload
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copy(JSON.stringify(result.mockResponse, null, 2), 'JSON')}
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Copy JSON
              </Button>
            </div>
            <CodeBlock code={JSON.stringify(result.mockResponse, null, 2)} lang="json" />
          </TabsContent>
          
          <TabsContent value="java" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Spring Boot controller boilerplate
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copy(result.javaBoilerplate, 'Java code')}
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Copy Java
              </Button>
            </div>
            <CodeBlock code={result.javaBoilerplate} lang="java" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Made with Bob
