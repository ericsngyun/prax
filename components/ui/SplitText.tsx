'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { textReveal } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  children: string;
  type?: 'chars' | 'words' | 'lines';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  scrollTrigger?: boolean;
  delay?: number;
  stagger?: number;
}

export function SplitText({
  children,
  type = 'chars',
  className,
  as: Component = 'div',
  scrollTrigger = false,
  delay,
  stagger,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = textReveal(ref.current, type, {
      scrollTrigger,
      delay,
      stagger,
    });

    return () => {
      if (animation && 'kill' in animation) {
        animation.kill();
      }
    };
  }, [type, scrollTrigger, delay, stagger]);

  return (
    <Component
      ref={ref as any}
      className={cn('split-text', className)}
    >
      {children}
    </Component>
  );
}

// Pre-split version for more control
interface PreSplitTextProps {
  children: string;
  type?: 'chars' | 'words';
  className?: string;
  charClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function PreSplitText({
  children,
  type = 'chars',
  className,
  charClassName,
  as: Component = 'div',
}: PreSplitTextProps) {
  const elements = type === 'chars'
    ? children.split('').map((char, i) => (
        <span key={i} className={cn('char inline-block', charClassName)}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))
    : children.split(' ').map((word, i) => (
        <span key={i} className={cn('word inline-block', charClassName)}>
          {word}
          {i < children.split(' ').length - 1 && '\u00A0'}
        </span>
      ));

  return (
    <Component className={className}>
      {elements}
    </Component>
  );
}
