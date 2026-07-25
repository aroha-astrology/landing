'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Markers are three deliberately different shapes — filled circle, rotated
 * square (diamond), outlined circle — rather than three of the same badge,
 * so each step reads as a genuinely different kind of action (input,
 * computation, conversation) instead of just "step N of 3".
 */
const STEPS = [
  {
    title: 'Enter your birth details',
    description: 'Your birth date, time and place — that’s all the chart needs to get started.',
  },
  {
    title: 'We compute your exact chart',
    description:
      'Swiss Ephemeris precision and the Lahiri ayanamsa — the same standard India’s government almanac uses.',
  },
  {
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

// Numeral is counter-rotated on the diamond variant so it stays upright
// while the square housing it sits at 45deg.
function StepMarker({ index }: { index: number }) {
  const numeralClass = 'font-display text-[18px] italic';

  if (index === 0) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-night-ink">
        <span className={numeralClass}>{index + 1}</span>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex h-11 w-11 rotate-45 items-center justify-center bg-ink text-night-ink">
        <span className={`${numeralClass} -rotate-45`}>{index + 1}</span>
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink text-ink">
      <span className={numeralClass}>{index + 1}</span>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    // `!py-` forces the fluid clamp() rhythm over Section's own fixed
    // py-20/sm:py-28 — two same-specificity utilities on one element aren't
    // resolved by attribute order, so importance is what guarantees this.
    <Section tone="paper" id="how-it-works">
      <SectionHeading eyebrow="How it works" title="From birth details to a chart you understand" />

      <motion.div
        className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-9"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={listVariants}
      >
        {STEPS.map((step, i) => (
          <motion.div key={step.title} variants={itemVariants} className="text-center">
            <div className="mx-auto w-fit">
              <StepMarker index={i} />
            </div>
            <h3 className="mt-5 font-display text-xl font-medium text-ink">{step.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-2">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
