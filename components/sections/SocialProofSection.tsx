'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SOCIAL PROOF SECTION
   Editorial testimonials, minimal design
   Think: Kinfolk magazine meets high-end portfolio
   ═══════════════════════════════════════════════════════════════════════════ */

interface Testimonial {
  quote: string;
  author?: string; // Optional, can be anonymous
}

interface SocialProofSectionProps {
  heading: string;
  testimonials: Testimonial[];
}

export function SocialProofSection({
  heading = 'Trusted by Clients Who Expect More',
  testimonials = [
    {
      quote: "I've never had a haircut that grew out this well.",
      author: 'Client, Los Angeles',
    },
    {
      quote: 'PRAX feels more like a design studio than a barbershop.',
      author: 'Client, Beverly Hills',
    },
    {
      quote: 'The attention to detail is unmatched. Every visit is consistent.',
      author: 'Client, West Hollywood',
    },
  ],
}: SocialProofSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const testimonialRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Heading
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

      // Testimonials subtle fade in
      testimonialRefs.current.forEach((testimonial, i) => {
        if (!testimonial) return;
        gsap.from(testimonial, {
          scrollTrigger: {
            trigger: testimonial,
            start: 'top 85%',
          },
          opacity: 0,
          y: 20,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-prax-ink"
    >
      <div className="container-prax">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-h2 text-prax-white text-center mb-20 md:mb-24 max-w-3xl mx-auto font-medium"
        >
          {heading}
        </h2>

        {/* Testimonials Grid - Editorial layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) testimonialRefs.current[index] = el;
              }}
              className="relative group"
            >
              {/* Quote mark - Serif, subtle */}
              <div className="text-serif-display text-prax-bone/10 mb-6 leading-none">
                "
              </div>

              {/* Quote text */}
              <blockquote className="mb-8">
                <p className="text-body-lg text-prax-white leading-relaxed italic">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Author - Optional */}
              {testimonial.author && (
                <cite className="text-caption text-prax-silver not-italic block">
                  - {testimonial.author}
                </cite>
              )}

              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 w-8 h-px bg-prax-bone opacity-20 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* Optional: Credibility statement */}
        <div className="text-center mt-20 md:mt-24">
          <p className="text-body text-prax-stone italic">
            Short. Credible. Minimal.
          </p>
        </div>
      </div>
    </section>
  );
}
