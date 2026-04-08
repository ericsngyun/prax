'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

const pillars = [
  { word: 'Precision', description: 'Intention in every cut' },
  { word: 'Consistency', description: 'Reliable results, every time' },
  { word: 'Education', description: 'Elevating the industry' },
];

export function PraxStandardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Everything fades up together
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black overflow-hidden">
      <div ref={contentRef} className="container-prax max-w-6xl mx-auto">
        <h2
          className="text-h1 font-light text-prax-white mb-6 text-center"
        >
          The PRAX Standard
        </h2>
        <p
          className="text-body-lg text-prax-stone leading-relaxed text-center mb-20 md:mb-24"
        >
          Every service. Every class. Every interaction.
        </p>

        {/* Large horizontal word treatment */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={pillar.word} className="flex items-center gap-6 md:gap-8">
              <div className="text-center">
                <span
                  className="block text-display-sm md:text-display font-light text-prax-bone"
                >
                  {pillar.word}
                </span>
                <div
                  className="text-body-sm text-prax-silver mt-2"
                >
                  {pillar.description}
                </div>
              </div>
              {i < pillars.length - 1 && (
                <span
                  className="hidden md:block text-display text-prax-charcoal font-light"
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
