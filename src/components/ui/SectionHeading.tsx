'use client';

import { motion } from 'framer-motion';

/**
 * Shared section header: a Cormorant eyebrow over a Cinzel, gold-gradient
 * title. Reveals on scroll-into-view so every section opens the same way.
 */
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, className = '' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`text-center ${className}`}
    >
      {eyebrow && (
        <p className="font-cormorant mb-3 text-base uppercase tracking-[0.35em] text-primary/80">
          {eyebrow}
        </p>
      )}
      <h2 className="font-cinzel bg-gradient-to-b from-[#F7E7B0] to-[#D4AF37] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}
