'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface Program {
  number: string;
  title: string;
  format: string;
  duration: string;
  description: string;
}

interface AcademyProgramsSectionProps {
  programs: Program[];
  /** Optional link rendered after the program list. External hrefs open in a new tab. */
  cta?: { text: string; href: string };
}

export function AcademyProgramsSection({ programs, cta }: AcademyProgramsSectionProps) {
  const programRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = programRefs.current.filter(Boolean);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: { trigger: items[0], start: 'top 85%' },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="programs" className="section-padding bg-prax-ink">
      <div className="container-prax max-w-5xl mx-auto">
        <div className="mb-16 md:mb-20">
          <span className="text-label text-prax-silver mb-4 block">
            Programs
          </span>
          <h2 className="text-h2 md:text-h1 font-light text-prax-white">
            What We Teach
          </h2>
        </div>

        <div className="space-y-0">
          {programs.map((program, i) => (
            <div
              key={program.number}
              ref={(el) => {
                if (el) programRefs.current[i] = el;
              }}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12 py-10 md:py-14 border-t border-prax-graphite last:border-b"
            >
              <div className="text-label text-prax-silver">
                {program.number}
              </div>
              <div>
                <h3 className="text-h3 text-prax-white mb-3">
                  {program.title}
                </h3>
                <div className="flex gap-4">
                  <span className="text-caption text-prax-bone uppercase tracking-wider">
                    {program.format}
                  </span>
                  <span className="text-caption text-prax-silver">
                    {program.duration}
                  </span>
                </div>
              </div>
              <p className="text-body text-prax-stone leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        {cta && (
          <div className="mt-12 md:mt-16">
            <a
              href={cta.href}
              target={cta.href.startsWith('http') ? '_blank' : undefined}
              rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center gap-2 text-body-sm text-prax-bone/90 hover:text-prax-white transition-colors duration-300 cursor-pointer"
            >
              {cta.text}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
