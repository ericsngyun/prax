'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface InnerPageHeroProps {
  label: string;
  headline: string;
  description: string;
}

export function InnerPageHero({ label, headline, description }: InnerPageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Simple fade up for all content
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding-lg bg-prax-black">
      <div ref={contentRef} className="container-prax max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="text-label text-prax-silver">
            {label}
          </span>
        </div>
        <h1
          className="text-h1 md:text-display text-prax-white mb-10 max-w-4xl"
        >
          {headline}
        </h1>
        <p
          className="text-body-lg md:text-h4 text-prax-stone leading-relaxed max-w-2xl"
        >
          {description}
        </p>
      </div>
    </section>
  );
}
