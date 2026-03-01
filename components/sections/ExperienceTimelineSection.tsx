'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineStep {
  step: string;
  title: string;
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
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header — fade up
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Timeline vertical line — scroll-linked scaleY (functional — keep)
      if (timelineLineRef.current) {
        gsap.set(timelineLineRef.current, { scaleY: 0, transformOrigin: 'top' });
        gsap.to(timelineLineRef.current, {
          scrollTrigger: {
            trigger: timelineLineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
          scaleY: 1,
          ease: 'none',
        });
      }

      // Steps — fade up
      stepRefs.current.forEach((step) => {
        if (!step) return;
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-20 max-w-3xl mx-auto px-4">
          <h2
            className="text-h2 md:text-h1 font-light text-prax-white mb-4 md:mb-6"
          >
            {heading}
          </h2>
          <p
            className="text-base md:text-body-lg text-prax-stone leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line — scroll-linked scaleY */}
            <div
              ref={timelineLineRef}
              className="absolute left-6 translate-x-[23px] md:translate-x-0 md:left-1/2 top-0 bottom-0 w-px bg-prax-graphite"
            />

            {/* Steps */}
            <div className="space-y-12 md:space-y-20">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) stepRefs.current[index] = el;
                  }}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Number indicator */}
                  <div
                    className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-prax-charcoal border-2 border-prax-bone flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-sm md:text-base text-prax-bone font-mono font-medium">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pl-20 md:pl-0 ${
                      index % 2 === 0
                        ? 'md:pr-16 md:text-right'
                        : 'md:pl-16 md:text-left'
                    }`}
                  >
                    <h3 className="text-xl md:text-h3 text-prax-white font-medium mb-3 md:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-base md:text-body text-prax-stone leading-relaxed md:max-w-md">
                      {step.description}
                    </p>
                  </div>

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
