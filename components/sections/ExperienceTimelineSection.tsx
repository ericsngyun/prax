'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE TIMELINE SECTION
   What to expect: time, detail, experience
   ═══════════════════════════════════════════════════════════════════════════ */

interface TimelineStep {
  step: string;
  title: string;
  duration: string;
  description: string;
}

interface ExperienceTimelineSectionProps {
  heading?: string;
  description?: string;
  steps: TimelineStep[];
}

export function ExperienceTimelineSection({
  heading = 'The PRAX Experience',
  description = 'Every appointment follows the same disciplined process.',
  steps,
}: ExperienceTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);

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

      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      });

      stepRefs.current.forEach((step, i) => {
        if (!step) return;
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
          opacity: 0,
          x: i % 2 === 0 ? -30 : 30,
          duration: 0.9,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Header */}
        <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
          <h2
            ref={headingRef}
            className="text-serif-h1 text-prax-white mb-6"
          >
            {heading}
          </h2>
          <p
            ref={descriptionRef}
            className="text-body-lg text-prax-stone leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-prax-graphite" />

            {/* Steps */}
            <div className="space-y-16 md:space-y-20">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) stepRefs.current[index] = el;
                  }}
                  className={`relative flex items-start gap-8 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Number indicator */}
                  <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-prax-charcoal border-2 border-prax-bone flex items-center justify-center">
                    <span className="text-prax-bone font-mono font-medium">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pl-24 md:pl-0 ${
                      index % 2 === 0
                        ? 'md:pr-16 md:text-right'
                        : 'md:pl-16 md:text-left'
                    }`}
                  >
                    <div className="inline-block text-label text-prax-bone uppercase tracking-widest mb-3">
                      {step.duration}
                    </div>
                    <h3 className="text-h3 text-prax-white font-medium mb-4">
                      {step.title}
                    </h3>
                    <p className="text-body text-prax-stone leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
