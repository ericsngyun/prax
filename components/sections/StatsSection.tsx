'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<HTMLSpanElement[]>([]);
  const suffixRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Reduced motion: skip the count-up but still show the final values
    // (otherwise the numbers stay frozen at "0" and suffixes stay hidden).
    if (prefersReducedMotion()) {
      valueRefs.current.forEach((el, i) => {
        if (el) el.textContent = `${stats[i].prefix ?? ''}${stats[i].value}`;
      });
      suffixRefs.current.forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      valueRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const obj = { value: 0 };

        // Counter animation
        gsap.to(obj, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          value: stat.value,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${stat.prefix ?? ''}${Math.round(obj.value)}`;
          },
          onComplete: () => {
            // Show suffix after counter completes
            const suffixEl = suffixRefs.current[i];
            if (suffixEl && stat.suffix) {
              gsap.to(suffixEl, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 md:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-display-sm md:text-display text-prax-bone font-light mb-2">
                <span
                  ref={(el) => {
                    if (el) valueRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                {stat.suffix && (
                  <span
                    ref={(el) => {
                      if (el) suffixRefs.current[i] = el;
                    }}
                    className="opacity-0"
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-caption md:text-body-sm text-prax-silver">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
