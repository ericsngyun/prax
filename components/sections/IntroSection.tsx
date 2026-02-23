'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface IntroSectionProps {
  statement: string;
  paragraphs: string[];
  emphasized?: string;
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

    const config = getMobileAnimationConfig();

    const ctx = gsap.context(() => {
      // Statement — simple fade up (mobile-optimized)
      gsap.from(statementRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 2,
        ease: config.ease,
      });

      // Paragraphs — staggered fade up (mobile-optimized)
      const paragraphs = paragraphRefs.current.filter(Boolean);
      if (paragraphs.length > 0) {
        gsap.from(paragraphs, {
          scrollTrigger: {
            trigger: paragraphs[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: config.yOffset,
          stagger: config.stagger,
          duration: config.duration * 2,
          ease: config.ease,
        });
      }

      // Divider scaleX from center (intentional accent — keep but faster on mobile)
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 85%',
          },
          scaleX: 0,
          duration: config.duration * 3.5, // Faster on mobile, still deliberate
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Statement */}
          <h2
            ref={statementRef}
            className="text-h1 font-light text-prax-white mb-16 md:mb-20"
          >
            {statement}
          </h2>

          {/* Body paragraphs */}
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
