'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HONESTY SECTION - "Is PRAX Right for You?"
   Direct, transparent about who we serve
   ═══════════════════════════════════════════════════════════════════════════ */

interface HonestySectionProps {
  heading?: string;
  forYouItems: string[];
  notForYouItems: string[];
}

export function HonestySection({
  heading = 'Is PRAX Right for You?',
  forYouItems,
  notForYouItems,
}: HonestySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const forYouRef = useRef<HTMLDivElement>(null);
  const notForYouRef = useRef<HTMLDivElement>(null);

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

      gsap.from(forYouRef.current, {
        scrollTrigger: {
          trigger: forYouRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        x: -30,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from(notForYouRef.current, {
        scrollTrigger: {
          trigger: notForYouRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        x: 30,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black">
      <div className="container-prax">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <h2
            ref={headingRef}
            className="text-serif-h1 text-prax-white text-center mb-20 md:mb-24"
          >
            {heading}
          </h2>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* PRAX is for you */}
            <div ref={forYouRef} className="space-y-6">
              <div>
                <h3 className="text-h3 text-prax-bone font-medium mb-2">
                  PRAX is for you if:
                </h3>
                <div className="w-12 h-px bg-prax-bone/40 mt-4" />
              </div>

              <ul className="space-y-4">
                {forYouItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-prax-bone text-lg mt-1">+</span>
                    <span className="text-body text-prax-stone leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRAX is NOT for you */}
            <div ref={notForYouRef} className="space-y-6">
              <div>
                <h3 className="text-h3 text-prax-silver font-medium mb-2">
                  PRAX is not for you if:
                </h3>
                <div className="w-12 h-px bg-prax-silver/40 mt-4" />
              </div>

              <ul className="space-y-4">
                {notForYouItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-prax-silver text-lg mt-1">-</span>
                    <span className="text-body text-prax-silver/80 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
