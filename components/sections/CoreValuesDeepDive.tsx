'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CORE VALUES DEEP DIVE
   Precision, Education, Design explained in depth
   ═══════════════════════════════════════════════════════════════════════════ */

interface CoreValue {
  number: string;
  title: string;
  subtitle: string;
  description: string[];
}

interface CoreValuesDeepDiveProps {
  heading?: string;
  values: CoreValue[];
}

export function CoreValuesDeepDive({
  heading = 'Our Core Values',
  values,
}: CoreValuesDeepDiveProps) {
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
            start: 'top 80%',
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black">
      <div className="container-prax">
        <h2
          ref={headingRef}
          className="text-serif-h1 text-prax-white text-center mb-20 md:mb-24"
        >
          {heading}
        </h2>

        <div className="space-y-20 md:space-y-24 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) valueRefs.current[index] = el;
              }}
              className="relative"
            >
              {/* Number */}
              <div className="text-[8rem] md:text-[12rem] font-mono font-light text-prax-bone/5 absolute -top-12 md:-top-16 left-0 leading-none pointer-events-none">
                {value.number}
              </div>

              <div className="relative space-y-6">
                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-h2 text-prax-white font-medium mb-2">
                    {value.title}
                  </h3>
                  <p className="text-body text-prax-bone">
                    {value.subtitle}
                  </p>
                </div>

                {/* Description paragraphs */}
                <div className="space-y-4 max-w-3xl">
                  {value.description.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-body-lg text-prax-stone leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Divider */}
              {index < values.length - 1 && (
                <div className="w-16 h-px bg-prax-bone/20 mt-12 md:mt-16" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
