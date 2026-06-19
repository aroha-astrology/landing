'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';

/**
 * The Awakening. On load, glowing Sanskrit mantras (Devanagari — left untouched
 * by the translator) float in and dissolve, revealing the golden headline, CTA
 * and a scroll prompt. Reduced-motion users skip straight to the revealed state.
 */

// Scattered across the viewport; each fades in then out on its own delay.
const MANTRAS = [
  { text: 'ॐ', x: '12%', y: '22%', size: 'text-6xl', delay: 0.1 },
  { text: 'ॐ नमः शिवाय', x: '70%', y: '18%', size: 'text-3xl', delay: 0.5 },
  { text: 'तत् त्वम् असि', x: '20%', y: '70%', size: 'text-2xl', delay: 0.9 },
  { text: 'सत्यं शिवं सुन्दरम्', x: '64%', y: '72%', size: 'text-2xl', delay: 0.7 },
  { text: 'ॐ भूर्भुवः स्वः', x: '40%', y: '40%', size: 'text-4xl', delay: 0.3 },
];

// Headline reveals after the mantras have begun to dissolve.
const REVEAL_DELAY = 2.0;

export function HeroSection() {
  const reduce = useReducedMotion();
  const headlineDelay = reduce ? 0 : REVEAL_DELAY;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      {/* Dissolving mantras (decorative, skip when reduced motion). */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {MANTRAS.map((m) => (
            <motion.span
              key={m.text}
              className={`font-cinzel absolute -translate-x-1/2 -translate-y-1/2 text-primary-ink/80 drop-shadow-[0_0_18px_rgba(212,175,55,0.6)] ${m.size}`}
              style={{ left: m.x, top: m.y }}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: [0, 0.9, 0], y: [18, 0, -28], filter: ['blur(6px)', 'blur(0px)', 'blur(8px)'] }}
              transition={{ duration: 2.6, delay: m.delay, ease: 'easeInOut' }}
            >
              {m.text}
            </motion.span>
          ))}
        </div>
      )}

      {/* Headline + CTA. */}
      <motion.div
        className="relative z-10 max-w-4xl"
        initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, delay: headlineDelay, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-cormorant mb-5 text-lg uppercase tracking-[0.4em] text-primary/80 sm:text-xl">
          Ancient wisdom, modern clarity
        </p>

        <h1 className="font-cinzel text-4xl font-bold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-b from-[#FBEFC4] via-[#E7C75A] to-[#C9991F] bg-clip-text text-transparent">
            Decode the{' '}
            <span className="font-playfair italic">cosmic blueprint</span>
          </span>
          <span className="mt-2 block text-2xl font-normal text-text-2 sm:text-3xl md:text-4xl">
            the planets drew at your first breath
          </span>
        </h1>

        <div className="mt-10 flex justify-center">
          <GoldButton pulse className="text-base">
            Generate Free Kundli <span aria-hidden>→</span>
          </GoldButton>
        </div>
      </motion.div>

      {/* Scroll prompt. */}
      <motion.div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-primary/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: headlineDelay + 0.6 }}
      >
        <span className="font-cormorant text-xs uppercase tracking-[0.3em]">Scroll to explore</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown strokeWidth={1.75} />
        </motion.span>
      </motion.div>
    </section>
  );
}
