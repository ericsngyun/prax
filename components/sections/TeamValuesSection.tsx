'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

      // Values — staggered fade up
      const items = valueRefs.current.filter(Boolean);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black">
      <div className="container-prax">
        <div className="max-w-4xl mx-auto">
          <h2
            ref={headingRef}
            className="text-h1 font-light text-prax-white text-center mb-20 md:mb-24"
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
                className="relative pl-8 md:pl-12"
              >
                {/* Left border */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-prax-bone/40"
                />
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
