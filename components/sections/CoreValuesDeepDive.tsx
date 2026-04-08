'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

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
  const dividerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Heading — fade up
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Values — fade up per block
      valueRefs.current.forEach((value) => {
        if (!value) return;
        gsap.from(value, {
          scrollTrigger: {
            trigger: value,
            start: 'top 80%',
          },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
        });
      });

      // Dividers — scaleX from center (intentional accent — keep)
      dividerRefs.current.forEach((div) => {
        if (!div) return;
        gsap.from(div, {
          scrollTrigger: {
            trigger: div,
            start: 'top 90%',
          },
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
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
          className="text-h1 font-light text-prax-white text-center mb-20 md:mb-24"
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
              <div
                className="text-[8rem] md:text-[12rem] font-mono font-light text-prax-bone/5 absolute -top-12 md:-top-16 left-0 leading-none pointer-events-none select-none"
                aria-hidden="true"
              >
                {value.number}
              </div>

              <div className="relative space-y-6">
                <div>
                  <h3 className="text-h2 text-prax-white font-medium mb-2">
                    {value.title}
                  </h3>
                  <p className="text-body text-prax-bone">
                    {value.subtitle}
                  </p>
                </div>

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

              {/* Divider — scaleX from center */}
              {index < values.length - 1 && (
                <div
                  ref={(el) => {
                    if (el) dividerRefs.current[index] = el;
                  }}
                  className="w-16 h-px bg-prax-bone/20 mt-12 md:mt-16"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
