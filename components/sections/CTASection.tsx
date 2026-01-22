'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CTASectionProps {
  headline?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CTASection({
  headline = 'Ready to elevate your craft?',
  description = 'Whether you\'re looking for a premium cut or want to join our academy, we\'re here to help you reach the next level.',
  primaryButtonText = 'Book a Cut',
  primaryButtonHref = '#book',
  secondaryButtonText = 'Join Academy',
  secondaryButtonHref = '#academy',
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const decorativeLineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Decorative line grow
      gsap.from(decorativeLineRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power3.out',
      });

      // Headline word reveal
      const words = headlineRef.current?.querySelectorAll('.word');
      if (words) {
        gsap.from(words, {
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      // Description
      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Buttons
      gsap.from(buttonsRef.current, {
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: 'top 90%',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Bottom divider
      gsap.from(dividerRef.current, {
        scrollTrigger: {
          trigger: dividerRef.current,
          start: 'top 95%',
        },
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split headline into words
  const headlineWords = headline.split(' ').map((word, i) => (
    <span key={i} className="word inline-block">
      {word}
      {i < headline.split(' ').length - 1 && '\u00A0'}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="section-padding-lg bg-prax-ink relative"
    >
      <div className="container-prax text-center">
        {/* Decorative Line */}
        <div
          ref={decorativeLineRef}
          className="w-px h-20 bg-prax-bone mx-auto mb-16"
        />

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-display font-bold text-prax-white tracking-tight mb-6 max-w-4xl mx-auto"
        >
          {headlineWords}
        </h2>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-body-lg text-prax-stone max-w-2xl mx-auto mb-12"
        >
          {description}
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            as="a"
            href={primaryButtonHref}
            className="btn-primary"
          >
            {primaryButtonText}
          </MagneticButton>

          <MagneticButton
            as="a"
            href={secondaryButtonHref}
            className="btn-secondary"
          >
            {secondaryButtonText}
          </MagneticButton>
        </div>

        {/* Bottom Divider */}
        <div
          ref={dividerRef}
          className="w-full h-px bg-prax-bone/20 mt-20"
        />
      </div>
    </section>
  );
}
