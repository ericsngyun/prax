'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const programs = [
  {
    number: '01',
    title: 'Fundamentals',
    format: 'In-Person',
    duration: '5 Days',
    description:
      'Master the foundation. Head shape analysis, sectioning, and the structural approach to men\'s haircutting that defines PRAX.',
  },
  {
    number: '02',
    title: 'Precision Cutting',
    format: 'In-Person',
    duration: '3 Days',
    description:
      'Advanced techniques for barbers who want to elevate their craft. Clipper-over-comb, scissor work, and fade architecture.',
  },
  {
    number: '03',
    title: 'Design & Finishing',
    format: 'In-Person',
    duration: '2 Days',
    description:
      'The details that separate good from exceptional. Texture, movement, and designing cuts that grow out with intention.',
  },
  {
    number: '04',
    title: 'Online Masterclass',
    format: 'Digital',
    duration: 'Self-Paced',
    description:
      'The PRAX methodology delivered on your schedule. Video lessons, breakdowns, and frameworks you can apply immediately.',
  },
];

const stats = [
  { value: '500+', label: 'Barbers Trained' },
  { value: '7', label: 'Cities Worldwide' },
  { value: '12+', label: 'Years Teaching' },
];

export function AcademyContent() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const programRefs = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.from(subtextRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6,
      });

      gsap.from(lineRef.current, {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        delay: 0.8,
      });

      programRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      if (philosophyRef.current) {
        gsap.from(philosophyRef.current, {
          scrollTrigger: { trigger: philosophyRef.current, start: 'top 75%' },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section ref={heroRef} className="section-padding-lg bg-prax-black">
        <div className="container-prax max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-label text-prax-silver">Academy</span>
          </div>
          <h1
            ref={headlineRef}
            className="text-h1 md:text-display text-prax-white mb-10 md:mb-14 max-w-4xl"
          >
            Elevate Your Craft
          </h1>
          <p
            ref={subtextRef}
            className="text-body-lg md:text-h4 text-prax-stone max-w-2xl leading-relaxed"
          >
            PRAX Academy teaches the same precision methodology we use in our
            studio. Structure, discipline, and fundamentals — not trends.
          </p>
          <div
            ref={lineRef}
            className="w-16 h-px bg-prax-bone mt-14 md:mt-20"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-prax-ink border-b border-prax-charcoal">
        <div className="container-prax max-w-5xl mx-auto">
          <div ref={statsRef} className="grid grid-cols-3 gap-8 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-display-sm md:text-display text-prax-bone font-light mb-2">
                  {stat.value}
                </div>
                <div className="text-caption md:text-body-sm text-prax-silver">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="section-padding bg-prax-ink">
        <div className="container-prax max-w-5xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span className="text-label text-prax-silver mb-4 block">
              Programs
            </span>
            <h2 className="text-h2 md:text-h1 text-prax-white">
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
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding-lg bg-prax-charcoal">
        <div className="container-prax max-w-4xl mx-auto text-center">
          <div ref={philosophyRef}>
            <blockquote className="text-serif-h2 md:text-serif-h1 text-prax-white leading-tight mb-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
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

      {/* CTA */}
      <CTASection
        headline="Ready to Level Up?"
        description="Applications for upcoming classes are open. Limited seats per session to maintain quality."
      />

      {/* Footer */}
      <Footer showNewsletter columns={footerColumns} />
    </main>
  );
}
