'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AI_TIPS = [
  "💡 Be specific about data types in your endpoint description for better mock generation",
  "🚀 Use the path slug field to customize your mock endpoint URL",
  "✨ Select different AI models for varied response styles",
  "🎯 Include example values in your description for more realistic mocks",
  "⚡ Copy the Bob handoff prompt to seamlessly continue development",
  "🔧 All HTTP methods (GET, POST, PUT, DELETE) are supported",
  "📊 Describe list endpoints with 'fetch multiple' for array responses",
  "🎨 The Java boilerplate is Spring Boot 3 ready - just add your business logic",
  "🌐 This service uses IBM watsonx.ai US-South region for AI processing",
  "💼 Generated contracts follow REST API best practices",
];

interface AITipsChatbotProps {
  autoPopup?: boolean;
}

export function AITipsChatbot({ autoPopup = false }: AITipsChatbotProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-popup after idle time
  useEffect(() => {
    if (!autoPopup || hasAutoOpened) return;

    let idleTimer: NodeJS.Timeout;
    let activityTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      clearTimeout(activityTimer);
      
      // Wait 3 seconds of inactivity before showing tips
      activityTimer = setTimeout(() => {
        if (!isOpen && !hasAutoOpened) {
          setIsOpen(true);
          setHasAutoOpened(true);
        }
      }, 3000);
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer);
    });

    // Initial timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(activityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [autoPopup, hasAutoOpened, isOpen]);

  // Rotate tips when open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % AI_TIPS.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="ibm-gradient text-white hover:opacity-90 transition-all shadow-2xl rounded-full h-14 w-14 p-0"
          aria-label="Open AI tips"
        >
          <Lightbulb className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="ibm-gradient text-white hover:opacity-90 transition-all shadow-2xl rounded-full h-14 w-14 p-0 relative"
          aria-label="Expand AI tips"
        >
          <Lightbulb className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
            {AI_TIPS.length}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-80 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full ibm-gradient">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base">AI Tips & Tricks</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-7 w-7 p-0"
                aria-label="Minimize tips"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0"
                aria-label="Close tips"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 min-h-[80px] flex items-center">
            <p className="text-sm leading-relaxed animate-in fade-in duration-300">
              {AI_TIPS[currentTip]}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {AI_TIPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTip(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentTip 
                      ? 'w-6 bg-primary' 
                      : 'w-1.5 bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to tip ${idx + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentTip + 1} / {AI_TIPS.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob