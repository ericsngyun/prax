'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export function AcademyPhilosophySection() {
  const philosophyRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (philosophyRef.current) {
        gsap.from(philosophyRef.current, {
          scrollTrigger: { trigger: philosophyRef.current, start: 'top 75%' },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
      if (approachRef.current) {
        const cols = approachRef.current.children;
        gsap.from(Array.from(cols), {
          scrollTrigger: { trigger: approachRef.current, start: 'top 80%' },
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
    <>
      {/* Philosophy */}
      <section className="section-padding-lg bg-prax-charcoal">
        <div className="container-prax max-w-4xl mx-auto text-center">
          <div ref={philosophyRef}>
            <blockquote className="text-h2 md:text-h1 font-light text-prax-white leading-tight mb-10">
              &ldquo;We teach because it sharpens our own standard. Education is
              not separate from the work — it is the work.&rdquo;
            </blockquote>
            <div className="text-label text-prax-bone uppercase tracking-widest">
              Jack Louii — Founder
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding bg-prax-ink">
        <div className="container-prax max-w-5xl mx-auto">
          <div ref={approachRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <span className="text-label text-prax-silver mb-4 block">
                Approach
              </span>
              <h2 className="text-h2 text-prax-white mb-8">
                Structure Over Style
              </h2>
              <p className="text-body-lg text-prax-stone leading-relaxed">
                PRAX Academy doesn&apos;t teach trends. We teach the structural
                principles that make every technique work — head shape analysis,
                sectioning discipline, and the patience to build precision into
                every cut.
              </p>
            </div>
            <div>
              <span className="text-label text-prax-silver mb-4 block">
                For Who
              </span>
              <h2 className="text-h2 text-prax-white mb-8">
                Barbers Who Want More
              </h2>
              <p className="text-body-lg text-prax-stone leading-relaxed">
                Whether you&apos;re starting out or have years behind the chair,
                PRAX Academy is for barbers who believe the standard can be
                higher. If you&apos;re willing to put in the work, we&apos;ll
                give you the framework.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
