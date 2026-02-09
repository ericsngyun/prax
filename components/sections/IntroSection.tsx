'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTRO SECTION — "What is PRAX"
   Direct, minimal explanation of what PRAX is
   Museum-quality spacing, editorial typography
   ═══════════════════════════════════════════════════════════════════════════ */

interface IntroSectionProps {
  statement: string;
  paragraphs: string[];
  emphasized?: string; // Optional phrase to emphasize
}

export function IntroSection({
  statement = 'PRAX is not a traditional barbershop.',
  paragraphs = [
    'We are a precision-driven grooming studio focused on craftsmanship, structure, and long-term hair design.',
    'Every service is intentional. Every haircut is built, not rushed.',
    'Our clients come to PRAX because details matter.',
  ],
  emphasized,
}: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Statement reveal - subtle fade up
      gsap.from(statementRef.current, {
        scrollTrigger: {
          trigger: statementRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });

      // Paragraph stagger - refined timing
      paragraphRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
          },
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });

      // Divider scale from center
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 85%',
          },
          scaleX: 0,
          duration: 1.4,
          ease: 'power3.inOut',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-prax-ink relative"
    >
      <div className="container-prax">
        {/* Maximum width constraint for reading comfort */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Statement - Serif, light weight, architectural */}
          <h2
            ref={statementRef}
            className="text-serif-h1 text-prax-white mb-16 md:mb-20"
          >
            {statement}
          </h2>

          {/* Body paragraphs - Sans serif, generous spacing */}
          <div className="space-y-8 md:space-y-10">
            {paragraphs.map((text, i) => (
              <p
                key={i}
                ref={(el) => {
                  if (el) paragraphRefs.current[i] = el;
                }}
                className="text-body-lg md:text-h4 text-prax-stone leading-relaxed max-w-3xl mx-auto"
              >
                {text}
              </p>
            ))}
          </div>

          {/* Subtle divider */}
          <div
            ref={dividerRef}
            className="w-16 h-px bg-prax-bone mx-auto mt-16 md:mt-24"
          />
        </div>
      </div>
    </section>
  );
}
