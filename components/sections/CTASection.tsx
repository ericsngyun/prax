'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { prefersReducedMotion } from '@/lib/utils';

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
  showPrimaryButton?: boolean;
}

export function CTASection({
  headline = 'Book With Confidence',
  description = 'If you\'re looking for a high-end haircut executed with precision and care, PRAX is for you.',
  primaryButtonText = 'Book an Appointment',
  primaryButtonHref = 'https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null',
  secondaryButtonText,
  secondaryButtonHref,
  showPrimaryButton = true,
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const decorativeLineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Decorative line grow (intentional accent — keep)
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

      // Headline — fade up
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Description — fade up
      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Buttons — fade up
      gsap.from(buttonsRef.current, {
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: 'top 90%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Bottom divider (intentional accent — keep)
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

  return (
    <section
      ref={sectionRef}
      className="section-padding-lg bg-prax-ink relative"
    >
      <div className="container-prax text-center">
        {/* Decorative Line */}
        <div
          ref={decorativeLineRef}
          className="w-px h-12 md:h-20 bg-prax-bone mx-auto mb-10 md:mb-16"
        />

        {/* Headline */}
        <h2
          ref={headingRef}
          className="text-display text-prax-white mb-4 md:mb-6 max-w-4xl mx-auto"
        >
          {headline}
        </h2>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-body-lg text-prax-stone max-w-2xl mx-auto mb-8 md:mb-12"
        >
          {description}
        </p>

        {/* Buttons */}
        {(showPrimaryButton || secondaryButtonText) && (
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {showPrimaryButton && (
              <MagneticButton
                as="a"
                href={primaryButtonHref}
                target={primaryButtonHref.startsWith('http') ? '_blank' : undefined}
                rel={primaryButtonHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn-primary btn-wipe"
              >
                {primaryButtonText}
              </MagneticButton>
            )}

            {secondaryButtonText && secondaryButtonHref && (
              <MagneticButton
                as="a"
                href={secondaryButtonHref}
                className="btn-ghost text-prax-stone hover:text-prax-bone"
              >
                {secondaryButtonText}
              </MagneticButton>
            )}
          </div>
        )}

        {/* Bottom Divider */}
        <div
          ref={dividerRef}
          className="w-full h-px bg-prax-bone/20 mt-20"
        />
      </div>
    </section>
  );
}
