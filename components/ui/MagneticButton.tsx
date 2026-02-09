'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { magneticButton } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as = 'button',
  href,
  onClick,
  type = 'button',
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = magneticButton(ref.current, strength);

    return () => {
      cleanup?.();
    };
  }, [strength]);

  const commonProps = {
    ref: ref as any,
    className: cn(
      'magnetic-btn relative inline-flex items-center justify-center cursor-pointer',
      className
    ),
    onClick,
  };

  if (as === 'a' && href) {
    return (
      <a {...commonProps} href={href} target={target} rel={rel}>
        <span className="magnetic-btn-content relative z-10">{children}</span>
      </a>
    );
  }

  if (as === 'div') {
    return (
      <div {...commonProps}>
        <span className="magnetic-btn-content relative z-10">{children}</span>
      </div>
    );
  }

  return (
    <button {...commonProps} type={type}>
      <span className="magnetic-btn-content relative z-10">{children}</span>
    </button>
  );
}
