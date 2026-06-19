'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * Primary interactive element. `solid` is the metallic-gold fill CTA
 * ("Generate Free Kundli"); `outline` is the lighter glass variant
 * ("Connect Now"). Set `pulse` for the breathing golden glow used on the hero.
 */
type Variant = 'solid' | 'outline';

type GoldButtonProps = HTMLMotionProps<'button'> & {
  variant?: Variant;
  pulse?: boolean;
  className?: string;
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide cursor-pointer transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-ink focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0616]';

const VARIANTS: Record<Variant, string> = {
  solid:
    'bg-gradient-to-b from-[#F2CA50] to-[#D4AF37] text-[#1a1205] shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_45px_rgba(212,175,55,0.65)]',
  outline:
    'border border-primary/50 text-primary-ink bg-white/[0.03] hover:bg-primary/10 hover:shadow-[0_0_28px_rgba(212,175,55,0.45)]',
};

export function GoldButton({
  variant = 'solid',
  pulse = false,
  className = '',
  children,
  ...props
}: GoldButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`${BASE} ${VARIANTS[variant]} ${
        pulse ? 'animate-[goldPulse_2.4s_ease-in-out_infinite]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
