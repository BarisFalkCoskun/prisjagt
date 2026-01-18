import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Animation variants that respect reduced motion
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    // Disable animations if user prefers reduced motion
    initial: prefersReducedMotion ? false : undefined,
    animate: prefersReducedMotion ? false : undefined,

    // Spring config
    spring: prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring', stiffness: 400, damping: 25 },

    // Fade in animation
    fadeIn: prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        },

    // Slide up animation
    slideUp: prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        },

    // Scale animation
    scaleIn: prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3 },
        },

    // Hover effects
    hover: prefersReducedMotion
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        },

    // Stagger children
    stagger: prefersReducedMotion
      ? {}
      : {
          transition: { staggerChildren: 0.05 },
        },
  };
}
