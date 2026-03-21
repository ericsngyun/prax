'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OriginStorySectionProps {
  heading: string;
  story: string[];
  founderImageSrc: string;
  founderImageAlt?: string;
}

export function OriginStorySection({
  heading,
  story,
  founderImageSrc,
  founderImageAlt = 'PRAX Founder',
}: OriginStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storyRefs = useRef<HTMLParagraphElement[]>([]);

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

      // Story paragraphs — staggered fade up
      const paragraphs = storyRefs.current.filter(Boolean);
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Story */}
          <div className="space-y-8">
            <h2
              ref={headingRef}
              className="text-h1 font-light text-prax-white"
            >
              {heading}
            </h2>

            <div className="space-y-6">
              {story.map((paragraph, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    if (el) storyRefs.current[i] = el;
                  }}
                  className="text-body-lg text-prax-stone leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Founder Image */}
          <div>
            {founderImageSrc ? (
              <ImageReveal
                src={founderImageSrc}
                alt={founderImageAlt}
                width={800}
                height={1000}
                quality={75}
                direction="right"
                showFrame={false}
                containerClassName="aspect-[4/5]"
                className=""
              />
            ) : (
              <div className="aspect-[4/5] bg-prax-charcoal flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-prax-silver text-sm mb-2">
                    FOUNDER PORTRAIT
                  </div>
                  <div className="text-prax-stone text-xs">
                    Jack Louii - Portrait or working shot
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
