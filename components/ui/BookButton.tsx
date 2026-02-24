'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function BookButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 150px (when header button is likely out of view)
      setIsVisible(window.scrollY > 150);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="https://getsquire.com/booking/brands/6764fc64-ed09-49da-8fb0-1cc6b59b9eb7?platform=widget&gclid=null"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'btn btn-primary fixed z-[500] transition-all duration-500 cursor-pointer',
        // Touch-friendly sizing
        'min-h-[48px] px-6 text-caption md:min-h-[56px] md:px-8 md:text-body-sm',
        // Mobile: centered bottom (thumb-friendly)
        'bottom-5 left-1/2',
        // Desktop: bottom-right
        'md:bottom-8 md:left-auto md:right-8',
        // Visibility state with transforms
        isVisible
          ? 'opacity-100 pointer-events-auto -translate-x-1/2 md:translate-x-0'
          : 'opacity-0 pointer-events-none -translate-x-1/2 translate-y-4 md:translate-x-0'
      )}
    >
      Book Now
    </a>
  );
}
