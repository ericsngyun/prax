'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InnerPageHero } from '@/components/sections/InnerPageHero';
import { StatsSection } from '@/components/sections/StatsSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';
import { footerColumns } from '@/lib/footerConfig';
import { cloudinaryAssets } from '@/lib/cloudinary';
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

export function AcademyContent() {
  const programRefs = useRef<HTMLDivElement[]>([]);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Programs — staggered fade up
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

      // Philosophy — fade up
      if (philosophyRef.current) {
        gsap.from(philosophyRef.current, {
          scrollTrigger: { trigger: philosophyRef.current, start: 'top 75%' },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // Approach columns — staggered fade up
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

      // Visuals — staggered fade up
      if (visualsRef.current) {
        const items = visualsRef.current.children;
        gsap.from(Array.from(items), {
          scrollTrigger: { trigger: visualsRef.current, start: 'top 80%' },
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
    <main className="min-h-screen">
      {/* Hero */}
      <InnerPageHero
        label="Academy"
        headline="Elevate Your Craft"
        description="PRAX Academy teaches the same precision methodology we use in our studio. Structure, discipline, and fundamentals — not trends."
        videoSrc={cloudinaryAssets.academyVideo}
      />

      {/* Stats — counter animations (intentional — keep) */}
      <StatsSection
        stats={[
          { value: 1000, suffix: '+', label: 'Students Trained' },
          { value: 12, suffix: '+', label: 'Cities Worldwide' },
          { value: 6, suffix: '+', label: 'Years Teaching' },
        ]}
      />

      {/* Visuals */}
      <section className="section-padding bg-prax-ink">
        <div className="container-prax max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <span className="text-label text-prax-silver mb-4 block">
              Academy Visuals
            </span>
            <h2 className="text-h2 md:text-h1 font-light text-prax-white">
              Inside the Classroom
            </h2>
          </div>
          <div ref={visualsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              cloudinaryAssets.academyClassroom01,
              cloudinaryAssets.academyClassroom02,
              cloudinaryAssets.academyClassroom03,
              cloudinaryAssets.academyClassroom04,
              cloudinaryAssets.academyClassroom05,
              cloudinaryAssets.academyClassroom06,
              cloudinaryAssets.academyClassroom07,
              cloudinaryAssets.academyClassroom08,
            ].map((imageSrc, index) => (
              <div
                key={index}
                className="relative aspect-[4/5] bg-prax-charcoal overflow-hidden rounded-sm group"
              >
                <Image
                  src={imageSrc}
                  alt={`Classroom scene ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={85}
                  loading="lazy"
                  className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
                />
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
        </div>
      </section>

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
