'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useNavigationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';
import { assets } from '@/lib/assets';

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER COMPONENT
   Sticky navigation with hide-on-scroll-down behavior
   ═══════════════════════════════════════════════════════════════════════════ */

const navLinks = [
  { href: '/', label: 'Index' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
  { href: '/academy', label: 'Academy' },
];

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const { isMenuOpen, toggleMenu } = useNavigationStore();
  const scrollStopTimeout = useRef<number | null>(null);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;

      // Reveal when scrolling stops
      if (scrollStopTimeout.current) {
        window.clearTimeout(scrollStopTimeout.current);
      }
      scrollStopTimeout.current = window.setTimeout(() => {
        setIsHidden(false);
      }, 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopTimeout.current) {
        window.clearTimeout(scrollStopTimeout.current);
      }
    };
  }, []);

  // Animate header visibility
  useEffect(() => {
    if (!headerRef.current || prefersReducedMotion()) return;

    gsap.to(headerRef.current, {
      y: isHidden && !isMenuOpen ? '-200%' : '0%',
      autoAlpha: isHidden && !isMenuOpen ? 0 : 1,
      pointerEvents: isHidden && !isMenuOpen ? 'none' : 'auto',
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [isHidden, isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Subtle navigation entrance animation (desktop only, on mount)
  useEffect(() => {
    if (!navRef.current || prefersReducedMotion()) return;
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    const links = navRef.current.querySelectorAll('a');

    // Ensure links are visible first, then animate
    gsap.set(links, { opacity: 1, y: 0 });

    // Only animate if on desktop and animations are enabled
    gsap.from(links, {
      opacity: 0,
      y: -8,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      delay: 0.3,
      clearProps: 'all', // Clear props after animation completes
    });
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-6 left-0 right-0 z-[1000]'
        )}
      >
        <div className="container-prax">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Wordmark */}
            <Link
              href="/"
              className="relative block hover:opacity-80 transition-opacity duration-300 cursor-pointer"
            >
              <Image
                src={assets.textLogo}
                alt="PRAX"
                width={186}
                height={24}
                priority
                quality={90}
                className="h-5 md:h-6 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 rounded-full border border-prax-graphite/70 bg-prax-ink/60 backdrop-blur-xl px-5 py-2">
              <nav ref={navRef} className="flex items-center gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="link-underline text-body-sm text-prax-white hover:text-prax-bone transition-colors duration-300 opacity-100 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center px-4 py-2 rounded-full border border-prax-graphite/70 bg-prax-ink/60 backdrop-blur-xl text-caption tracking-widest uppercase text-prax-white hover:text-prax-bone transition-colors duration-300 cursor-pointer"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => toggleMenu()} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MENU
   Full-screen overlay menu for mobile devices
   ═══════════════════════════════════════════════════════════════════════════ */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current || !linksRef.current || prefersReducedMotion()) return;

    const links = linksRef.current.querySelectorAll('a');

    if (isOpen) {
      // Open animation
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power3.inOut',
      });

      // Stagger links
      gsap.fromTo(
        links,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    } else {
      // Close animation
      gsap.to(links, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });

      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.2,
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[999] bg-prax-black flex flex-col justify-center"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      aria-hidden={!isOpen}
    >
      <div className="container-prax h-full flex flex-col justify-between py-24 md:py-28">
        <nav ref={linksRef} className="flex flex-col gap-6 md:gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-baseline gap-4 group cursor-pointer"
            >
              <span className="text-label text-prax-bone opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-h2 md:text-display-sm text-prax-white group-hover:text-prax-bone transition-colors leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Social links */}
        <div className="flex gap-8 text-prax-stone text-body-sm pt-8 border-t border-prax-graphite/40">
          <a
            href="https://www.instagram.com/praxhair/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-prax-white transition-colors py-2 cursor-pointer"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@praxhair"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-prax-white transition-colors py-2 cursor-pointer"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
