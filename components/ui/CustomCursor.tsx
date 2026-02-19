'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useCursorStore, CursorVariant } from '@/lib/store';
import { cn, lerp } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isTouch = useRef(false);

  const { variant, text, isVisible } = useCursorStore();

  useEffect(() => {
    isTouch.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Mouse move — track position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };

    // Dot follows immediately
    if (cursorRef.current && !prefersReducedMotion()) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }
  }, []);

  // Ring follows with lerp for organic trailing
  useEffect(() => {
    if (isTouch.current || prefersReducedMotion()) return;

    const animate = () => {
      ringPosRef.current.x = lerp(ringPosRef.current.x, mouseRef.current.x, 0.08);
      ringPosRef.current.y = lerp(ringPosRef.current.y, mouseRef.current.y, 0.08);

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
    }
    if (cursorRingRef.current) {
      gsap.to(cursorRingRef.current, { opacity: 1, duration: 0.3 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
    }
    if (cursorRingRef.current) {
      gsap.to(cursorRingRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  useEffect(() => {
    if (isTouch.current || prefersReducedMotion()) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Animate cursor variant changes
  useEffect(() => {
    if (!cursorDotRef.current || !cursorRingRef.current || prefersReducedMotion()) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current.querySelector('div')!;
    const textEl = cursorTextRef.current;

    if (textEl) {
      gsap.to(textEl, { opacity: 0, scale: 0.8, duration: 0.2 });
    }

    switch (variant) {
      case 'default':
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring, { width: 40, height: 40, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
        break;

      case 'hover':
        gsap.to(dot, { scale: 0.5, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(ring, { width: 60, height: 60, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
        break;

      case 'text':
      case 'view':
      case 'drag':
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
        gsap.to(ring, { width: 80, height: 80, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
        if (textEl) {
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1 });
        }
        break;

      case 'link':
        gsap.to(dot, { scale: 0.3, opacity: 1, duration: 0.3 });
        gsap.to(ring, { width: 60, height: 60, opacity: 0.8, duration: 0.3, ease: 'back.out(2)' });
        break;

      case 'arrow-left':
      case 'arrow-right':
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
        gsap.to(ring, { width: 70, height: 70, opacity: 1, duration: 0.3 });
        if (textEl) {
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1 });
        }
        break;

      case 'hidden':
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
        gsap.to(ring, { width: 0, height: 0, opacity: 0, duration: 0.2 });
        break;
    }
  }, [variant]);

  if (typeof window !== 'undefined' && (isTouch.current || prefersReducedMotion())) {
    return null;
  }

  const getCursorText = () => {
    if (text) return text;
    switch (variant) {
      case 'view':
        return 'View';
      case 'drag':
        return 'Drag';
      case 'arrow-left':
        return '\u2190';
      case 'arrow-right':
        return '\u2192';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Main cursor container (dot) */}
      <div
        ref={cursorRef}
        className={cn(
          'fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-difference',
          !isVisible && 'opacity-0'
        )}
        style={{ willChange: 'transform' }}
      >
        {/* Center dot — refined 6px */}
        <div
          ref={cursorDotRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-prax-white rounded-full"
        />

        {/* Cursor text */}
        <div
          ref={cursorTextRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-prax-white text-[11px] font-medium tracking-wider uppercase whitespace-nowrap opacity-0"
        >
          {getCursorText()}
        </div>
      </div>

      {/* Trailing ring — lerp-based following */}
      <div
        ref={cursorRingRef}
        className={cn(
          'fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference',
          !isVisible && 'opacity-0'
        )}
        style={{ willChange: 'transform' }}
      >
        <div className="w-10 h-10 border border-prax-white/50 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR INTERACTION HOOK
   ═══════════════════════════════════════════════════════════════════════════ */

export function useCursor() {
  const { setVariant, setText, reset } = useCursorStore();

  const onEnter = useCallback(
    (variant: CursorVariant = 'hover', customText?: string) => {
      setVariant(variant);
      if (customText) setText(customText);
    },
    [setVariant, setText]
  );

  const onLeave = useCallback(() => {
    reset();
  }, [reset]);

  return { onEnter, onLeave, setVariant, setText };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR HOVER WRAPPER
   ═══════════════════════════════════════════════════════════════════════════ */

interface CursorHoverProps {
  children: React.ReactNode;
  variant?: CursorVariant;
  text?: string;
  className?: string;
  as?: React.ElementType;
}

export function CursorHover({
  children,
  variant = 'hover',
  text,
  className,
  as: Component = 'div',
}: CursorHoverProps) {
  const { onEnter, onLeave } = useCursor();

  return (
    <Component
      className={className}
      onMouseEnter={() => onEnter(variant, text)}
      onMouseLeave={onLeave}
    >
      {children}
    </Component>
  );
}
