'use client';

import { motion } from 'framer-motion';
import { CalendarClock, Orbit, MessageCircle } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEPS = [
  {
    icon: CalendarClock,
    title: 'Enter your birth details',
    description: 'Your birth date, time and place — that’s all the chart needs to get started.',
  },
  {
    icon: Orbit,
    title: 'We compute your exact chart',
    description:
      'Swiss Ephemeris precision and the Lahiri ayanamsa — the same standard India’s government almanac uses.',
  },
  {
    icon: MessageCircle,
    title: 'Ask anything',
    description: 'An AI grounded in your real chart data answers follow-up questions, in your language.',
  },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function HowItWorksSection() {
  return (
    <Section tone="paper" id="how-it-works">
      <SectionHeading eyebrow="How it works" title="From birth details to a chart you understand" />

      <motion.div
        className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={listVariants}
      >
        {STEPS.map((step, i) => (
          <motion.div key={step.title} variants={itemVariants} className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <step.icon size={26} strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-4 font-data text-sm" data-no-translate>
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 font-display text-xl font-medium text-ink">{step.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-2">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
