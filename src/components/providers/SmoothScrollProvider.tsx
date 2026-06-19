'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useScroll } from '@/store/useScroll';

/**
 * Buttery smooth scrolling (Lenis) + a single source of truth for page scroll
 * progress, written into the useScroll store on every frame. The WebGL scene
 * reads that store to dolly the camera and shift parallax layers.
 *
 * Under prefers-reduced-motion we skip Lenis entirely and fall back to a plain
 * passive scroll listener so progress still updates without inertial motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const setProgress = useScroll((s) => s.setProgress);
  const setPointer = useScroll((s) => s.setPointer);

  // Pointer parallax feed for the WebGL camera (canvas is pointer-events:none).
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [setPointer]);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      const max = lenis.limit || 0;
      setProgress(max > 0 ? lenis.scroll / max : 0);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [setProgress]);

  return <>{children}</>;
}
