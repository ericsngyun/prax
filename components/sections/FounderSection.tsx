'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FounderSectionProps {
  heading: string;
  philosophy: string[];
  founderName?: string;
  founderTitle?: string;
  founderBio?: string;
  imageSrc: string;
  imageAlt?: string;
}

export function FounderSection({
  heading = 'Built on craft, and curated design',
  philosophy = [
    'PRAX was founded to raise the standard of men\'s haircutting—emphasizing discipline, precision, and education over speed or volume.',
    'The studio operates with the same principles we teach: clarity, structure, and mastery of fundamentals.',
  ],
  founderName = 'Jack Louii',
  founderTitle = 'Founder & Lead Artist',
  founderBio = 'Raised the standard for precision haircutting through discipline, education, and an uncompromising commitment to craft.',
  imageSrc,
  imageAlt = 'PRAX Founder',
}: FounderSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const philosophyRefs = useRef<HTMLParagraphElement[]>([]);
  const founderCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Heading — fade up
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Philosophy paragraphs — staggered fade up
      const paragraphs = philosophyRefs.current.filter(Boolean);
      if (paragraphs.length > 0) {
        gsap.from(paragraphs, {
          scrollTrigger: {
            trigger: paragraphs[0],
            start: 'top 80%',
          },
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // Founder card — fade up
      if (founderCardRef.current) {
        gsap.from(founderCardRef.current, {
          scrollTrigger: {
            trigger: founderCardRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 24,
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
      className="section-padding-lg bg-prax-charcoal relative"
    >
      <div className="container-prax">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 lg:gap-24 items-start">
          {/* Left: Philosophy */}
          <div>
            <h2
              ref={headingRef}
              className="text-h1 font-light text-prax-white mb-12 md:mb-16"
            >
              {heading}
            </h2>

            <div className="space-y-6 md:space-y-8">
              {philosophy.map((text, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    if (el) philosophyRefs.current[i] = el;
                  }}
                  className="text-body-lg text-prax-stone leading-relaxed"
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-prax-bone my-12 md:my-16" />

            {/* Founder Info Card */}
            <div
              ref={founderCardRef}
              className="space-y-4"
            >
              <h3 className="text-h3 text-prax-white font-medium tracking-tight">
                Meet {founderName}
              </h3>
              <p className="text-label text-prax-bone uppercase tracking-widest">
                {founderTitle}
              </p>
              <p className="text-body text-prax-stone leading-relaxed max-w-md">
                {founderBio}
              </p>
            </div>
          </div>

          {/* Right: Portrait — asymmetric offset for editorial feel */}
          <div className="lg:order-last order-first lg:mt-24">
            <ImageReveal
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={1000}
              quality={80}
              direction="right"
              showFrame={false}
              containerClassName="aspect-[4/5]"
              className="img-team"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
