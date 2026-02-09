'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORIGIN STORY SECTION
   Why PRAX exists - Jack's vision
   MEDIA NEEDED: 2-3 founder photos (Jack portrait, working, teaching)
   ═══════════════════════════════════════════════════════════════════════════ */

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

      storyRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
          },
          opacity: 0,
          y: 30,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });
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
              className="text-serif-h1 text-prax-white"
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
                quality={80}
                direction="right"
                showFrame={false}
                containerClassName="aspect-[4/5]"
                className="img-team"
              />
            ) : (
              <div className="aspect-[4/5] bg-prax-charcoal border-2 border-dashed border-prax-graphite flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-prax-silver text-sm mb-2">
                    FOUNDER PORTRAIT
                  </div>
                  <div className="text-prax-stone text-xs">
                    Jack Louii - Portrait or working shot
                  </div>
                  <div className="text-prax-stone/60 text-xs mt-2">
                    Editorial quality, grayscale or desaturated
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
