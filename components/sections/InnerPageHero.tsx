'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface InnerPageHeroProps {
  label: string;
  headline: string;
  description: string;
  backgroundImage?: string;
}

export function InnerPageHero({ label, headline, description, backgroundImage }: InnerPageHeroProps) {
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
    <section ref={sectionRef} className={`section-padding-lg ${backgroundImage ? 'relative' : 'bg-prax-black'}`}>
      {backgroundImage && (
        <>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              quality={90}
              className="object-cover"
            />
          </div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-prax-black/60 via-prax-black/70 to-prax-black z-[1]" />
        </>
      )}

      <div ref={contentRef} className={`container-prax max-w-5xl mx-auto ${backgroundImage ? 'relative z-10' : ''}`}>
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
