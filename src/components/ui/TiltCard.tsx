'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { GlassCard } from './GlassCard';

/**
 * Pointer-driven 3D tilt wrapper around GlassCard. The card rotates toward the
 * cursor with spring physics and lifts a touch, plus a soft gold sheen that
 * tracks the pointer. Disabled (flat) under prefers-reduced-motion.
 */
type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. */
  max?: number;
};

export function TiltCard({ children, className = '', max = 10 }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const sheenX = useTransform(mx, [0, 1], ['0%', '100%']);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  if (reduce) {
    return <GlassCard className={className}>{children}</GlassCard>;
  }

  return (
    <div ref={ref} className="tilt-scene" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        className="tilt-3d relative"
        style={{ rotateX: rx, rotateY: ry }}
        whileHover={{ z: 20 }}
      >
        <GlassCard className={`relative overflow-hidden ${className}`}>
          {children}
          {/* Pointer-tracking sheen. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            style={{ left: sheenX }}
          />
        </GlassCard>
      </motion.div>
    </div>
  );
}
