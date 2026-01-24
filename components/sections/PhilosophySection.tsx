'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { fadeUp, textReveal } from '@/lib/animations';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhilosophySectionProps {
  label?: string;
  heading?: string;
  paragraphs?: string[];
  imageSrc?: string;
  imageAlt?: string;
}

export function PhilosophySection({
  label = 'Our Philosophy',
  heading = 'We craft transformations that transcend technique',
  paragraphs = [
    'Every cut tells a story. Every detail matters. At PRAX, we believe in the power of precision—where artistry meets intention.',
    'Founded in Los Angeles by Jack Louii, we\'ve built a community that values craft above all else. Our work isn\'t about following trends; it\'s about setting them.',
  ],
  imageSrc = '/images/philosophy-portrait.jpg',
  imageAlt = 'PRAX Philosophy',
}: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Label animation
      gsap.from(labelRef.current, {
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Heading line-by-line reveal
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      });

      // Paragraphs stagger
      paragraphRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span
              ref={labelRef}
              className="text-label text-prax-bone uppercase tracking-widest block mb-6"
            >
              {label}
            </span>

            <h2
              ref={headingRef}
              className="text-display-sm font-bold text-prax-white leading-tight mb-8"
            >
              {heading}
            </h2>

            <div className="space-y-6">
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    if (el) paragraphRefs.current[i] = el;
                  }}
                  className="text-body-lg text-prax-stone leading-relaxed"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <ImageReveal
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={1200}
              direction="left"
              showFrame
              frameOffset={{ x: 16, y: 16 }}
              containerClassName="aspect-[2/3]"
              className="rounded-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
