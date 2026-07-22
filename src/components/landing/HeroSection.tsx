'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { LINKS } from '@/lib/links';

/**
 * The front door. Calm, fast, editorial — no scroll-jacking or heavy
 * scroll-linked transforms here, since this section's Lighthouse score
 * matters most. One entrance animation, then it's done.
 */
export function HeroSection() {
  return (
    <section className="relative bg-paper px-5 pb-20 pt-16 text-center text-ink sm:px-8 sm:pb-28 sm:pt-24">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Eyebrow>Vedic astrology, done properly</Eyebrow>

        <h1 className="font-display text-[2.5rem] font-medium leading-[1.1] sm:text-6xl md:text-7xl">
          Your birth chart, read properly.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-ink-2 sm:text-lg">
          Swiss Ephemeris precision maps every planet at your exact moment of birth, and an AI
          explains what it means in plain language — in 13 languages.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="solid" href={LINKS.signup}>
            Get my free chart <span aria-hidden>→</span>
          </Button>
          <Button variant="outline" href="#moon-sign">
            Try the free Moon sign tool
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 grid max-w-md grid-cols-3 gap-6 sm:mt-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Stat value="9" label="Grahas mapped" />
        <Stat value="27" label="Nakshatras" />
        <Stat value="13" label="Languages" />
      </motion.div>
    </section>
  );
}
