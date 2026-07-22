'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Feature = { title: string; description: string };

const FEATURES: Feature[] = [
  {
    title: 'Janma Kundli',
    description: 'Your full Vedic birth chart, computed from your exact birth details.',
  },
  {
    title: 'Vimshottari Dasha',
    description: 'The timeline of planetary periods shaping different phases of your life.',
  },
  {
    title: 'AI chat astrologer',
    description: 'Ask follow-up questions, grounded in your actual chart, in your language.',
  },
  {
    title: 'Divisional charts (D1–D60)',
    description: 'Navamsa, Dasamsa and more, for deeper analysis beyond the main chart.',
  },
  {
    title: 'Gemstone recommendations',
    description: 'Personalized suggestions based on your own planetary placements.',
  },
  {
    title: 'Vastu planner',
    description: 'A 2D floor-plan tool for laying out your home or office.',
  },
  {
    title: 'Daily, weekly, monthly & yearly horoscope',
    description: 'Ongoing readings that track how transits affect your chart over time.',
  },
  {
    title: 'Compatibility matching',
    description: 'Compare two charts to see how a couple’s placements align.',
  },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function FeaturesSection() {
  return (
    // Alt (sunk) surface — the paper band that separates the two dark acts
    // (Navagraha above, Precision below) from each other.
    <Section tone="sunk" id="features">
      <SectionHeading eyebrow="What you get" title="Everything in one chart" />

      {/* Hairline grid: a single gap-px row/column filled with the rule
          colour sits *behind* the cells, so every cell only needs a matching
          background (not its own border) to produce crisp 1px dividers. */}
      <motion.div
        className="mt-14 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={listVariants}
      >
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="flex min-h-[170px] flex-col justify-between bg-paper-sunk px-6 py-7"
          >
            <div className="font-display text-sm italic text-accent" data-no-translate>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <h3 className="font-display text-lg text-ink">{feature.title}</h3>
              <p className="mt-2 text-[13.5px] leading-snug text-ink-muted">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
