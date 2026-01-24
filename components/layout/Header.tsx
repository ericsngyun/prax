'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigationStore } from '@/lib/store';
import { useCursor } from '@/components/ui/CustomCursor';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER COMPONENT
   Sticky navigation with hide-on-scroll-down behavior
   ═══════════════════════════════════════════════════════════════════════════ */

const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#academy', label: 'Academy' },
  { href: '/#about', label: 'About' },
];

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const { isMenuOpen, isHeaderSolid, toggleMenu, setHeaderSolid } = useNavigationStore();
  const { onEnter, onLeave } = useCursor();

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

      // Solid background after scrolling past hero
      setHeaderSolid(currentScrollY > 50);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setHeaderSolid]);

  // Animate header visibility
  useEffect(() => {
    if (!headerRef.current || prefersReducedMotion()) return;

    gsap.to(headerRef.current, {
      y: isHidden && !isMenuOpen ? '-100%' : '0%',
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

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-[1000] transition-colors duration-500',
          isHeaderSolid || isMenuOpen
            ? 'bg-prax-ink/95 backdrop-blur-lg'
            : 'bg-transparent'
        )}
      >
        <div className="container-prax">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-10"
              onMouseEnter={() => onEnter('hover')}
              onMouseLeave={onLeave}
            >
              <span className="text-xl md:text-2xl font-bold tracking-tight text-prax-white">
                PRAX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-underline text-body-sm text-prax-stone hover:text-prax-white transition-colors duration-300"
                  onMouseEnter={() => onEnter('link')}
                  onMouseLeave={onLeave}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="hidden md:block">
              <Link
                href="/#contact"
                className="btn btn-primary text-body-sm"
                onMouseEnter={() => onEnter('hover')}
                onMouseLeave={onLeave}
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="relative z-10 md:hidden w-10 h-10 flex items-center justify-center"
              onMouseEnter={() => onEnter('hover')}
              onMouseLeave={onLeave}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-4">
                <span
                  className={cn(
                    'absolute left-0 w-full h-px bg-prax-white transition-all duration-300 ease-out',
                    isMenuOpen ? 'top-1/2 rotate-45' : 'top-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1/2 w-full h-px bg-prax-white transition-all duration-300 ease-out',
                    isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 w-full h-px bg-prax-white transition-all duration-300 ease-out',
                    isMenuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'
                  )}
                />
              </div>
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
  const { onEnter, onLeave } = useCursor();

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
      <div className="container-prax">
        <nav ref={linksRef} className="flex flex-col gap-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-display-sm text-prax-white hover:text-prax-bone transition-colors"
              onMouseEnter={() => onEnter('link')}
              onMouseLeave={onLeave}
            >
              <span className="text-prax-silver text-label mr-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              {link.label}
            </Link>
          ))}

          {/* CTA in mobile menu */}
          <div className="pt-8 mt-8 border-t border-prax-graphite">
            <Link
              href="/#contact"
              onClick={onClose}
              className="btn btn-primary w-full text-center"
              onMouseEnter={() => onEnter('hover')}
              onMouseLeave={onLeave}
            >
              Book Now
            </Link>
          </div>
        </nav>

        {/* Social links */}
        <div className="absolute bottom-12 left-0 right-0 container-prax">
          <div className="flex gap-6 text-prax-silver text-body-sm">
            <a
              href="https://instagram.com/prax.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-prax-white transition-colors"
              onMouseEnter={() => onEnter('link')}
              onMouseLeave={onLeave}
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@prax"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-prax-white transition-colors"
              onMouseEnter={() => onEnter('link')}
              onMouseLeave={onLeave}
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
