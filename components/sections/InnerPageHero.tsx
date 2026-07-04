'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { prefersReducedMotion } from '@/lib/utils';
import { blurPlaceholders } from '@/lib/blurPlaceholder';

interface InnerPageHeroProps {
  label: string;
  headline: string;
  description: string;
  /** Optional primary CTA rendered below the description. External hrefs open in a new tab. */
  cta?: { text: string; href: string };
  backgroundImage?: string;
  videoSrc?: string;
  videoPoster?: string;
  /**
   * CSS object-position for the background image. Defaults to 'center 25%',
   * which keeps the upper-third subject visible on portrait sources after
   * object-cover scales them into a wide hero. Override per-page when a
   * specific shot needs the subject framed elsewhere.
   */
  backgroundPosition?: string;
}

export function InnerPageHero({ label, headline, description, cta, backgroundImage, videoSrc, videoPoster, backgroundPosition = 'center 25%' }: InnerPageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Simple fade up for all content
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Background parallax — desktop only, non-touch, reduced-motion-safe.
  // The image sits at natural framing (inset-0); GSAP applies a slight scale
  // (the overscan) plus a gentle vertical drift, clipped by the section's
  // overflow-hidden. On touch / reduced-motion it stays perfectly framed.
  useEffect(() => {
    if (!bgRef.current || !sectionRef.current || prefersReducedMotion()) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -5, scale: 1.16 },
        {
          yPercent: 5,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [backgroundImage]);

  const hasBackground = backgroundImage || videoSrc;

  return (
    <section ref={sectionRef} className={`relative min-h-[100svh] flex items-center overflow-hidden ${hasBackground ? '' : 'bg-prax-black'} pb-16 md:pb-20`}>
      {/* Video Background */}
      {videoSrc && (
        <VideoBackground
          src={videoSrc}
          poster={videoPoster}
          scaleOnScroll={false}
          overlayClassName="bg-gradient-to-b from-prax-black/40 via-prax-black/60 to-prax-black"
        />
      )}

      {/* Image Background (fallback if no video) */}
      {!videoSrc && backgroundImage && (
        <>
          {/* Background Image — natural framing; GSAP adds scale+drift on desktop */}
          <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              quality={75}
              placeholder="blur"
              blurDataURL={blurPlaceholders.darkGradient}
              className="object-cover"
              style={{ objectPosition: backgroundPosition }}
            />
          </div>
          {/* Overlay for readability - extends to top of viewport */}
          <div className="absolute inset-0 bg-gradient-to-b from-prax-black/40 via-prax-black/60 to-prax-black z-[1]" />
        </>
      )}

      <div ref={contentRef} className={`container-prax max-w-5xl mx-auto pt-32 md:pt-40 ${hasBackground ? 'relative z-10' : ''}`}>
        <div className="mb-8">
          <span className="text-label text-prax-silver">
            {label}
          </span>
        </div>
        <h1
          className="text-h1 md:text-display text-prax-white mb-10 max-w-4xl"
        >
          {headline}
        </h1>
        <p
          className="text-body-lg md:text-h4 text-prax-stone leading-relaxed max-w-2xl"
        >
          {description}
        </p>
        {cta && (
          <div className="mt-10 md:mt-12">
            <MagneticButton
              as="a"
              href={cta.href}
              target={cta.href.startsWith('http') ? '_blank' : undefined}
              rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="btn-primary btn-wipe text-body-sm"
            >
              {cta.text}
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
}
