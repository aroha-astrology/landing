'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';

/**
 * The Awakening. The 3D Rashi Chakra glows in the upper viewport (rendered by
 * the fixed Scene3D behind everything); the hero content sits in the lower
 * third over a soft scrim for legibility. On load, Sanskrit mantras dissolve to
 * reveal the headline; on scroll the whole block parallax-drifts up and fades
 * as the camera dives into the cosmos.
 */

const MANTRAS = [
  { text: 'ॐ', x: '12%', y: '20%', size: 'text-6xl', delay: 0.1 },
  { text: 'ॐ नमः शिवाय', x: '74%', y: '16%', size: 'text-3xl', delay: 0.5 },
  { text: 'तत् त्वम् असि', x: '18%', y: '62%', size: 'text-2xl', delay: 0.9 },
  { text: 'सत्यं शिवं सुन्दरम्', x: '70%', y: '64%', size: 'text-2xl', delay: 0.7 },
];

const REVEAL_DELAY = 1.8;

export function HeroSection() {
  const reduce = useReducedMotion();
  const headlineDelay = reduce ? 0 : REVEAL_DELAY;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden px-5 pb-24 text-center"
    >
      {/* Dissolving mantras. */}
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

      {/* Legibility scrim under the text. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-t from-[#0a0616] via-[#0a0616]/80 to-transparent" />

      {/* Headline + CTA (parallax on scroll). */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: headlineDelay, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-cormorant mb-5 text-lg uppercase tracking-[0.4em] text-primary/80 sm:text-xl">
            Ancient wisdom, modern clarity
          </p>

          <h1 className="font-cinzel text-4xl font-bold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-b from-[#FBEFC4] via-[#E7C75A] to-[#C9991F] bg-clip-text text-transparent">
              Decode the <span className="font-playfair italic">cosmic blueprint</span>
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
      </motion.div>

      {/* Scroll prompt. */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-primary/70"
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
