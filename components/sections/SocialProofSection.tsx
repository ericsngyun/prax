'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface Testimonial {
  quote: string;
  author?: string;
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
      // Heading — fade up
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Testimonials — staggered fade up
      const items = testimonialRefs.current.filter(Boolean);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
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
          className="text-h2 text-prax-white text-center mb-12 md:mb-24 max-w-3xl mx-auto font-light"
        >
          {heading}
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) testimonialRefs.current[index] = el;
              }}
              className="relative group"
            >
              {/* Quote mark — decorative */}
              <div className="text-display text-prax-bone/8 mb-6 leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>

              {/* Quote text */}
              <blockquote className="mb-8">
                <p className="text-body-lg text-prax-white leading-relaxed italic">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Author */}
              {testimonial.author && (
                <cite className="text-caption text-prax-silver not-italic block">
                  &mdash; {testimonial.author}
                </cite>
              )}

              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 w-8 h-px bg-prax-bone opacity-20 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* Subtle divider */}
        <div className="w-16 h-px bg-prax-bone/20 mx-auto mt-12 md:mt-24" />
      </div>
    </section>
  );
}
