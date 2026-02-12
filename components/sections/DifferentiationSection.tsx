'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIFFERENTIATION SECTION — "Why PRAX"
   Three pillars: Precision / Education / Design
   Minimal iconography, architectural spacing, refined grid
   ═══════════════════════════════════════════════════════════════════════════ */

interface Pillar {
  number: string;
  title: string;
  description: string;
}

interface DifferentiationSectionProps {
  label?: string;
  heading: string;
  pillars: Pillar[];
}

export function DifferentiationSection({
  label = 'Why PRAX',
  heading = 'Built on Three Principles',
  pillars = [
    {
      number: '01',
      title: 'Precision First',
      description:
        'Every haircut is approached with structure, balance, and control—not trends or shortcuts.',
    },
    {
      number: '02',
      title: 'Education-Driven Studio',
      description:
        'PRAX is also an academy. Our standards are higher because we teach them.',
    },
    {
      number: '03',
      title: 'Designed Experience',
      description:
        'From consultation to finish, every detail is intentional—calm, focused, and professional.',
    },
  ],
}: DifferentiationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pillarRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Label
      gsap.from(labelRef.current, {
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Heading
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      });

      // Pillars stagger - architectural reveal
      pillarRefs.current.forEach((pillar, i) => {
        if (!pillar) return;
        gsap.from(pillar, {
          scrollTrigger: {
            trigger: pillar,
            start: 'top 80%',
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
        });

        // Number separate animation
        const number = pillar.querySelector('.pillar-number');
        if (number) {
          gsap.from(number, {
            scrollTrigger: {
              trigger: pillar,
              start: 'top 80%',
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: i * 0.15 + 0.2,
            ease: 'back.out(1.2)',
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding-lg bg-prax-black relative overflow-hidden"
    >
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-prax-ink via-prax-black to-prax-ink opacity-50" />

      <div className="container-prax relative z-10">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <span
            ref={labelRef}
            className="text-label text-prax-bone uppercase tracking-widest block mb-6"
          >
            {label}
          </span>
          <h2
            ref={headingRef}
            className="text-display text-prax-white"
          >
            {heading}
          </h2>
        </div>

        {/* Three Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 max-w-7xl mx-auto">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) pillarRefs.current[index] = el;
              }}
              className="relative group"
            >
              {/* Pillar Card */}
              <div className="relative h-full">
                {/* Subtle border on hover */}
                <div className="absolute inset-0 border border-prax-graphite opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-8 md:p-10">
                  {/* Number - Monospace, large */}
                  <div className="pillar-number text-6xl md:text-7xl font-light text-prax-bone/20 mb-8 font-mono">
                    {pillar.number}
                  </div>

                  {/* Title - Sans bold */}
                  <h3 className="text-h3 text-prax-white font-medium mb-6 tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-body text-prax-stone leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Decorative accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-prax-bone group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
