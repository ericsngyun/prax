'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM VALUES SECTION
   What the team believes in collectively
   ═══════════════════════════════════════════════════════════════════════════ */

interface Value {
  title: string;
  description: string;
}

interface TeamValuesSectionProps {
  heading?: string;
  values: Value[];
}

export function TeamValuesSection({
  heading = 'What We Believe',
  values,
}: TeamValuesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const valueRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });

      valueRefs.current.forEach((value, i) => {
        if (!value) return;
        gsap.from(value, {
          scrollTrigger: {
            trigger: value,
            start: 'top 85%',
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black">
      <div className="container-prax">
        <div className="max-w-4xl mx-auto">
          <h2
            ref={headingRef}
            className="text-serif-h1 text-prax-white text-center mb-20 md:mb-24"
          >
            {heading}
          </h2>

          <div className="space-y-12 md:space-y-16">
            {values.map((value, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) valueRefs.current[index] = el;
                }}
                className="border-l-2 border-prax-bone/40 pl-8 md:pl-12"
              >
                <h3 className="text-h3 text-prax-white font-medium mb-4">
                  {value.title}
                </h3>
                <p className="text-body-lg text-prax-stone leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
