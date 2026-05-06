'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface Principle {
  number: string;
  title: string;
  description: string;
}

interface TeachingPrinciplesSectionProps {
  label?: string;
  heading?: string;
  principles?: Principle[];
}

const DEFAULT_PRINCIPLES: Principle[] = [
  {
    number: '01',
    title: 'Structure',
    description: 'Every cut starts with head-shape analysis. Form before style.',
  },
  {
    number: '02',
    title: 'Precision',
    description: 'Lines exist because we drew them with intention. Nothing is accidental.',
  },
  {
    number: '03',
    title: 'Discipline',
    description: 'Skill is repetition done correctly — not creativity performed loudly.',
  },
  {
    number: '04',
    title: 'Fundamentals',
    description: 'The basics never go out of style. We master them first, every time.',
  },
  {
    number: '05',
    title: 'Education',
    description: 'Teaching forces us to articulate what we know. It refines our craft.',
  },
  {
    number: '06',
    title: 'Design',
    description: 'A cut is sculpture in negative space. Geometry, not guesswork.',
  },
  {
    number: '07',
    title: 'Consistency',
    description: 'Excellence repeated is the only excellence that matters.',
  },
  {
    number: '08',
    title: 'Mastery',
    description: 'There is no shortcut. There is only the work, day after day.',
  },
];

export function TeachingPrinciplesSection({
  label = 'How We Teach',
  heading = 'The Method',
  principles = DEFAULT_PRINCIPLES,
}: TeachingPrinciplesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const items = gridRef.current.children;
        gsap.from(Array.from(items), {
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
          opacity: 0,
          y: 20,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <span className="text-label text-prax-silver mb-4 block">
            {label}
          </span>
          <h2 className="text-h2 md:text-h1 font-light text-prax-white">
            {heading}
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {principles.map((p, i) => (
            <article
              key={i}
              className="relative border border-prax-graphite/60 bg-prax-charcoal/30 hover:bg-prax-charcoal/60 hover:border-prax-bone/30 transition-colors duration-300 p-6 md:p-7 flex flex-col justify-between gap-5 min-h-[12rem] md:min-h-[14rem]"
            >
              <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-prax-bone/55" aria-hidden="true" />
              <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-prax-bone/55" aria-hidden="true" />

              <div>
                <span className="text-label text-prax-bone/55 tracking-[0.25em] tabular-nums">
                  {p.number}
                </span>
                <h3 className="mt-3 text-h3 text-prax-white font-light leading-tight">
                  {p.title}
                </h3>
              </div>

              <p className="text-body-sm text-prax-stone/90 leading-relaxed">
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
