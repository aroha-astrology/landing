'use client';

import { motion } from 'framer-motion';
import {
  Grid3x3,
  History,
  MessageCircle,
  LayoutGrid,
  Gem,
  Home,
  CalendarDays,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AppCTA } from '@/components/ui/AppCTA';

type Feature = { icon: LucideIcon; title: string; description: string };

const FEATURES: Feature[] = [
  {
    icon: Grid3x3,
    title: 'Janma Kundli',
    description: 'Your full Vedic birth chart, computed from your exact birth details.',
  },
  {
    icon: History,
    title: 'Vimshottari Dasha',
    description: 'The timeline of planetary periods shaping different phases of your life.',
  },
  {
    icon: MessageCircle,
    title: 'AI chat astrologer',
    description: 'Ask follow-up questions, grounded in your actual chart, in your language.',
  },
  {
    icon: LayoutGrid,
    title: 'Divisional charts (D1–D60)',
    description: 'Navamsa, Dasamsa and more, for deeper analysis beyond the main chart.',
  },
  {
    icon: Gem,
    title: 'Gemstone recommendations',
    description: 'Personalized suggestions based on your own planetary placements.',
  },
  {
    icon: Home,
    title: 'Vastu planner',
    description: 'A 2D floor-plan tool for laying out your home or office.',
  },
  {
    icon: CalendarDays,
    title: 'Daily, weekly, monthly & yearly horoscope',
    description: 'Ongoing readings that track how transits affect your chart over time.',
  },
  {
    icon: Heart,
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
    <Section tone="paper" id="features">
      <SectionHeading eyebrow="What you get" title="Everything in one chart" />

      <motion.div
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={listVariants}
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="rounded-2xl border border-rule bg-paper-raised p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <feature.icon size={22} strokeWidth={1.75} aria-hidden />
            </div>
            <h3 className="mt-4 font-display text-lg font-medium text-ink">{feature.title}</h3>
            <p className="mt-2 text-sm text-ink-2">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center">
        <AppCTA variant="outline">Explore the app</AppCTA>
      </div>
    </Section>
  );
}
