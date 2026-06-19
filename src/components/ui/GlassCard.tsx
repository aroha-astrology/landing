'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * Glassmorphic container — semi-transparent fill, backdrop blur and a thin
 * golden border. Built on the shared theme tokens (--primary) so the whole
 * landing page stays on one palette. Forwards all motion.div props, so callers
 * can attach `whileInView`, `variants`, etc. directly.
 */
type GlassCardProps = HTMLMotionProps<'div'> & { className?: string };

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ className = '', children, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        className={`rounded-2xl border border-primary/25 bg-white/[0.04] backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
