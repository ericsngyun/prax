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
        'btn btn-primary fixed bottom-8 right-8 z-[var(--z-toast)] shadow-2xl transition-all duration-500',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      data-cursor="hover"
    >
      Book Now
    </a>
  );
}
