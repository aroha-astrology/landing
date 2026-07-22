'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AppStoreBadges } from '@/components/ui/AppStoreBadges';
import { Stat } from '@/components/ui/Stat';

/**
 * The front door. Calm, fast, editorial — no scroll-jacking or heavy
 * scroll-linked transforms here, since this section's Lighthouse score
 * matters most. One entrance animation, then it's done.
 */
export function HeroSection() {
  return (
    <section className="relative bg-paper px-[clamp(20px,4vw,56px)] pb-[clamp(56px,7vw,88px)] pt-[clamp(64px,10vw,120px)] text-center text-ink">
      <motion.div
        className="mx-auto max-w-5xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Eyebrow>Vedic astrology, done properly</Eyebrow>

        <h1 className="mx-auto mb-[26px] max-w-[920px] font-display text-[clamp(42px,6.5vw,80px)] font-medium leading-[1.04]">
          Your birth chart, read properly.
        </h1>

        <p className="mx-auto mb-10 max-w-[560px] text-[19px] leading-[1.55] text-ink-2">
          Swiss Ephemeris precision, an AI astrologer that can answer anything, in 13 languages.
        </p>

        <div className="mb-11 flex flex-wrap items-center justify-center gap-4">
          <AppStoreBadges />
          {/* Plain prose link (not the pill Button) to match the design's
              quieter secondary CTA here — the two store badges already carry
              the visual weight of "get started". */}
          <a href="#moon-sign" className="j-link border-b border-current pb-0.5 text-[15px] font-semibold">
            Try the free Moon sign tool →
          </a>
        </div>
      </motion.div>

      <motion.div
        className="mx-auto grid max-w-md grid-cols-3 gap-[clamp(28px,5vw,64px)] border-t border-rule pt-9"
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
