'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Sunrise, Sunset, MoonStar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Daily Cosmic Weather. The five limbs of the Panchang in a glass card, with
 * Sun/Moon accents and a sunrise/sunset/moonrise strip. Elements stagger in as
 * the card scrolls into view.
 *
 * Element labels (Tithi, Vara, …) translate via the dictionary; the sample
 * values are mostly Sanskrit proper nouns that gracefully stay as-is.
 */

const ELEMENTS = [
  { label: 'Tithi', value: 'Shukla Dvitiya' },
  { label: 'Vara', value: 'Sunday' },
  { label: 'Nakshatra', value: 'Rohini' },
  { label: 'Yoga', value: 'Siddha' },
  { label: 'Karana', value: 'Bava' },
];

const TIMINGS = [
  { label: 'Sunrise', value: '5:48 AM', Icon: Sunrise },
  { label: 'Sunset', value: '6:52 PM', Icon: Sunset },
  { label: 'Moonrise', value: '7:31 PM', Icon: MoonStar },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function PanchangSection() {
  return (
    <section className="relative px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Daily Cosmic Weather" title="Today's Panchang" className="mb-12" />

        <GlassCard
          className="p-7 sm:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Sun + Moon header accents. */}
          <div className="mb-8 flex items-center justify-center gap-10">
            <Sun
              className="text-primary-ink drop-shadow-[0_0_16px_rgba(242,202,80,0.7)]"
              size={40}
              strokeWidth={1.5}
            />
            <Moon
              className="text-text-2 drop-shadow-[0_0_14px_rgba(225,226,235,0.5)]"
              size={34}
              strokeWidth={1.5}
            />
          </div>

          {/* Five limbs. */}
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {ELEMENTS.map((el) => (
              <motion.div
                key={el.label}
                variants={item}
                className="rounded-xl border border-primary/15 bg-white/[0.03] px-4 py-5 text-center"
              >
                <p className="font-cormorant text-sm uppercase tracking-[0.2em] text-primary/80">
                  {el.label}
                </p>
                <p className="mt-2 font-cinzel text-lg text-text">{el.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Sun/Moon timings. */}
          <motion.div
            className="mt-8 grid grid-cols-1 gap-4 border-t border-primary/15 pt-8 sm:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {TIMINGS.map(({ label, value, Icon }) => (
              <motion.div key={label} variants={item} className="flex items-center justify-center gap-3">
                <Icon className="text-primary-ink" size={22} strokeWidth={1.5} aria-hidden />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
                  <p className="text-base font-medium text-text" data-no-translate>
                    {value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </GlassCard>
      </div>
    </section>
  );
}
