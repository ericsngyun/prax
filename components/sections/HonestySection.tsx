'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

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

      // Two columns — staggered fade up
      gsap.from([forYouRef.current, notForYouRef.current], {
        scrollTrigger: {
          trigger: forYouRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-prax-black">
      <div className="container-prax">
        <div className="max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="text-h1 font-light text-prax-white text-center mb-20 md:mb-24"
          >
            {heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
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
