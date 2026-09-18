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
    title: 'Divisional charts (D1–D60)',
    description: 'Navamsa, Dasamsa and more, for deeper analysis beyond the main chart.',
  },
  {
    title: 'Ashtakavarga & planet strength',
    description: 'Bindu strength, Shadbala, and retrograde/combust flags for every planet.',
  },
  {
    title: 'Vimshottari Dasha',
    description: 'Mahadasha, Antardasha and Pratyantardasha — the timeline shaping your life.',
  },
  {
    title: '54 yogas & 7 doshas',
    description: 'Raja Yoga, Gajakesari, Dhana Yoga; Mangal, Kaal Sarp, Sade Sati and more, detected automatically.',
  },
  {
    title: 'Guna Milan compatibility',
    description: 'The full 36-point Ashtakoota match, plus Manglik status for both charts.',
  },
  {
    title: 'Daily Panchang',
    description: 'Tithi, Nakshatra, Yoga, Karana, Rahu Kaal and Choghadiya for your location.',
  },
  {
    title: 'Daily, weekly, monthly & yearly horoscope',
    description: 'Ongoing readings that track how transits affect your chart over time.',
  },
  {
    title: 'Gemstone recommendations',
    description: 'Personalized suggestions based on your own planetary placements.',
  },
  {
    title: 'Lal Kitab remedies',
    description: 'Karmic debts, Pakka Ghar strengths, and a remedy for every planet in your chart.',
  },
  {
    title: 'Numerology',
    description: 'Vedic Mulank & Bhagyank, Lo Shu Grid, and your Pythagorean life-path numbers.',
  },
  {
    title: 'Palm reading',
    description: 'Nine lines, nine mounts — read from your photos and cross-checked against your chart.',
  },
  {
    title: 'Vastu planner',
    description: 'A 2D floor-plan tool for laying out your home or office.',
  },
  {
    title: 'Birth-time rectification',
    description: 'Not sure of your exact time? We narrow it down from your life’s major events.',
  },
  {
    title: 'Shlokas & Bhagavad Gita',
    description: 'A chanting library of 50 shlokas with audio, plus all 701 verses of the Gita.',
  },
  {
    title: 'Vedic Astrologer chat',
    description: 'Ask follow-up questions, grounded in your actual chart, in your language.',
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
            className="flex min-h-[188px] flex-col justify-between bg-paper-sunk px-6 py-7"
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
