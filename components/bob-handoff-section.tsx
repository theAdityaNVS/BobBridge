'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  bobHandoff: string;
  mockUrl: string;
}

export function BobHandoffSection({ bobHandoff, mockUrl }: Props) {
  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`, {
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  }

  function openBob() {
    // IBM Bob is a VS Code fork (similar to Antigravity)
    toast.info('Opening IBM Bob...', {
      description: 'IBM Bob is a VS Code fork with AI capabilities built-in',
    });
    // In a real implementation, this would launch the IBM Bob application
    // For now, direct to the download page
    window.open('https://github.com/IBM/bob', '_blank');
  }

  function installBob() {
    // IBM Bob is a standalone application, not an extension
    window.open('https://github.com/IBM/bob', '_blank');
  }

  return (
    <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="ibm-text-gradient">Ready for IBM Bob Section</span>
                <span className="text-2xl filter-none" role="img" aria-label="robot" style={{ filter: 'none' }}>🤖</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                AI-Powered IDE
              </Badge>
            </div>
            <CardDescription className="text-base">
              Hand off this contract to IBM Bob (a VS Code fork with AI capabilities) to complete the implementation with data layer, validation, and tests
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bob Handoff Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Bob Implementation Prompt
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(bobHandoff, 'Bob prompt')}
              className="gap-2"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Prompt
            </Button>
          </div>
          <pre className="bg-muted/50 p-4 rounded-lg border overflow-auto text-sm whitespace-pre-wrap leading-relaxed max-h-64">
            {bobHandoff}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={openBob}
            size="lg"
            className="ibm-gradient text-white hover:opacity-90 transition-opacity gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            Launch IBM Bob
          </Button>
          <Button
            onClick={installBob}
            size="lg"
            variant="outline"
            className="border-primary/30 hover:bg-primary/5 gap-2"
          >
            <Download className="h-5 w-5" />
            Download IBM Bob
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            🎯 Next Steps with IBM Bob:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Copy the prompt above</li>
            <li>Launch IBM Bob (a VS Code fork with built-in AI)</li>
            <li>Paste the prompt to generate complete implementation</li>
            <li>Bob will add JPA entities, repositories, validation, and tests</li>
          </ul>
        </div>

        {/* Mock URL Reference */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Mock endpoint for frontend testing:
          </p>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-xs">
            <code className="font-mono flex-1 break-all">{mockUrl}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copy(mockUrl, 'Mock URL')}
              className="h-6 w-6 p-0 shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Made with Bob