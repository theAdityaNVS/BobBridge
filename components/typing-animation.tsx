'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/types';

export function TypingAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const frameworks = SUPPORTED_LANGUAGES.map(lang => lang.framework);

  useEffect(() => {
    const currentFramework = frameworks[currentIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseDuration = 2000;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting && displayText === currentFramework) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % frameworks.length);
      return;
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentFramework.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentFramework.substring(0, displayText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isPaused, currentIndex, frameworks]);

  return (
    <span className="inline-block min-w-[180px] text-left">
      <span className="ibm-text-gradient font-semibold">{displayText}</span>
      <span className="ibm-text-gradient animate-pulse">|</span>
    </span>
  );
}

// Made with Bob