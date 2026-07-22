'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from './Eyebrow';

/**
 * Shared section header: an eyebrow over a Fraunces display headline.
 * Reveals once on scroll-into-view so every section opens the same way.
 * Pass `dark` inside a night-tone Section; `as="h1"` only for the hero.
 */
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  align = 'center',
  as = 'h2',
  className = '',
}: SectionHeadingProps) {
  const Heading = as;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Heading className="font-display text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl">
        {title}
      </Heading>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-night-ink-2' : 'text-ink-2'} ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
