'use client';

import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Homepage teaser for the Moon-sign tool — deliberately asks for nothing.
 * Shows real Chandra Rashi content for all 12 signs up front (each
 * description is specific to the Moon's temperament in that sign, not
 * generic sun-sign copy), then hands off to the real calculator on
 * /moon-sign for anyone who wants their own result. Keeps id="moon-sign"
 * so the nav/footer in-page anchors still resolve to this section.
 */
const RASHIS = [
  { sanskrit: 'Mesha', english: 'Aries', trait: 'Quick emotional reactions and bold instincts — needs action to feel settled.' },
  { sanskrit: 'Vrishabha', english: 'Taurus', trait: 'Emotionally steady and comfort-seeking, values security and routine.' },
  { sanskrit: 'Mithuna', english: 'Gemini', trait: 'Curious and quick-shifting moods — needs mental stimulation and conversation.' },
  { sanskrit: 'Karka', english: 'Cancer', trait: 'Deeply intuitive and nurturing — this is the Moon’s own sign, so feelings run especially strong.' },
  { sanskrit: 'Simha', english: 'Leo', trait: 'Warm and expressive, needs recognition — emotions are worn openly and proudly.' },
  { sanskrit: 'Kanya', english: 'Virgo', trait: 'Analytical and detail-oriented emotionally — finds comfort in order and being useful.' },
  { sanskrit: 'Tula', english: 'Libra', trait: 'Seeks harmony and balance in relationships — sensitive to conflict.' },
  { sanskrit: 'Vrischika', english: 'Scorpio', trait: 'Intense, private emotional depth — feels things powerfully beneath a controlled surface.' },
  { sanskrit: 'Dhanu', english: 'Sagittarius', trait: 'Optimistic and restless for freedom and meaning — emotionally expansive.' },
  { sanskrit: 'Makara', english: 'Capricorn', trait: 'Reserved and disciplined emotionally — finds security through achievement and structure.' },
  { sanskrit: 'Kumbha', english: 'Aquarius', trait: 'Detached, idea-driven emotional style — values independence over closeness.' },
  { sanskrit: 'Meena', english: 'Pisces', trait: 'Highly empathetic and imaginative — easily absorbs others’ moods, deeply compassionate.' },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function MoonSignsOverviewSection() {
  return (
    <Section tone="paper" id="moon-sign">
      <SectionHeading
        eyebrow="Chandra Rashi"
        title="What your Moon sign says about you"
        subtitle="Vedic astrology reads the Moon for mind and emotion, not the Sun. Here's what each of the 12 signs means for the Moon specifically."
      />

      <motion.div
        className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={listVariants}
      >
        {RASHIS.map((r) => (
          <motion.div
            key={r.sanskrit}
            variants={itemVariants}
            className="rounded-2xl border border-rule bg-paper-raised p-6"
          >
            <h3 className="font-display text-lg font-medium text-ink">
              {r.sanskrit} <span className="text-base font-normal text-ink-muted">({r.english})</span>
            </h3>
            <p className="mt-2 text-sm text-ink-2">{r.trait}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/moon-sign"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-accent-hover"
        >
          <Link2 size={16} strokeWidth={2} aria-hidden />
          Calculate your real Moon sign
        </Link>
      </div>
    </Section>
  );
}
