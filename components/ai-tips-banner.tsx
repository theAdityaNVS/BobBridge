'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AI_TIPS = [
  "💡 Tip: Be specific about data types in your endpoint description for better mock generation",
  "🚀 Pro Tip: Use the path slug field to customize your mock endpoint URL",
  "✨ Did you know? You can select different AI models for varied response styles",
  "🎯 Best Practice: Include example values in your description for more realistic mocks",
  "⚡ Quick Tip: Copy the Bob handoff prompt to seamlessly continue development",
  "🔧 Feature: All HTTP methods (GET, POST, PUT, DELETE) are supported",
  "📊 Tip: Describe list endpoints with 'fetch multiple' for array responses",
  "🎨 Pro Tip: The Java boilerplate is Spring Boot 3 ready - just add your business logic",
  "🌐 Region: This service uses IBM watsonx.ai US-South region for AI processing",
  "💼 Enterprise Ready: Generated contracts follow REST API best practices",
];

export function AITipsBanner() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % AI_TIPS.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [isVisible, isPaused]);

  if (!isVisible) return null;

  return (
    <div 
      className="bg-primary/10 border-b border-primary/20 animate-in fade-in slide-in-from-top-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Lightbulb className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground/90 truncate">
              {AI_TIPS[currentTip]}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
              aria-label="Close tips banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob