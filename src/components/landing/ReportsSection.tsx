'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Report = {
  key: string;
  title: string;
  fromRupees: number;
  cadence?: 'month';
  questions: string[];
};

// Source of truth: backend/src/config/reports.ts (basePricePaise, admin-overridable —
// shown here as "from") and backend/src/config/report-sections.ts (section sequence,
// which is where these questions are drawn from). `match_report` is deliberately
// excluded: its content was folded into Kundli Milan's sections 6-7.
const REPORTS: Report[] = [
  {
    key: 'marriage',
    title: 'Marriage Report',
    fromRupees: 99,
    questions: [
      'When is marriage most likely for me?',
      'What does my chart say about the partner I’ll marry?',
      'Am I Manglik, and how much does it really matter?',
    ],
  },
  {
    key: 'kundli_milan',
    title: 'Kundli Milan Report',
    fromRupees: 99,
    questions: [
      'How compatible are we on the 36-point Guna Milan?',
      'Do our Manglik doshas cancel each other out?',
      'How do we align on health, wealth, career and children?',
    ],
  },
  {
    key: 'true_love',
    title: 'True Love Report',
    fromRupees: 99,
    questions: [
      'Is a soulmate connection written in my chart?',
      'What’s my romantic archetype?',
      'What patterns keep repeating in my love life?',
    ],
  },
  {
    key: 'wealth',
    title: 'Wealth Report',
    fromRupees: 99,
    questions: [
      'What does my chart say about long-term wealth?',
      'Which years ahead are strongest financially?',
      'Is property, business or salary my strongest path?',
    ],
  },
  {
    key: 'progeny',
    title: 'Progeny Report',
    fromRupees: 99,
    questions: [
      'Will we have children, and what does each chart show?',
      'What does my D7 (Saptamsha) chart reveal?',
      'Is our current dasha timing supportive?',
    ],
  },
  {
    key: 'numerology',
    title: 'Numerology Report',
    fromRupees: 99,
    questions: [
      'What’s my Life Path Number, and what does it reveal?',
      'Does my current name support my numbers?',
      'Which days, colors and years are luckiest for me?',
    ],
  },
  {
    key: 'remedies',
    title: 'Remedies Report (Lal Kitab)',
    fromRupees: 99,
    questions: [
      'Do I carry any karmic debts (Rin)?',
      'What’s the specific remedy for each planet in my chart?',
      'Which remedy should I start with first?',
    ],
  },
  {
    key: 'baby_name',
    title: 'Baby Name Report',
    fromRupees: 99,
    questions: [
      'Which Nakshatra is my baby born under?',
      'What starting syllable is most auspicious?',
      'Which names align with my baby’s chart?',
    ],
  },
  {
    key: 'name_change',
    title: 'Name Change Report',
    fromRupees: 49,
    questions: [
      'Is my current name numerologically working for or against me?',
      'What spelling changes would rebalance it?',
      'What’s the best way to phase in a name change?',
    ],
  },
  {
    key: 'past_life',
    title: 'Past Life Report',
    fromRupees: 25,
    questions: [
      'What kind of life did my soul most likely live before this one?',
      'What unfinished business have I carried into this one?',
      'What is this lifetime’s core soul lesson?',
    ],
  },
  {
    key: 'career_monthly',
    title: 'Career Report',
    fromRupees: 25,
    cadence: 'month',
    questions: [
      'Is this a good month to ask for a raise or switch jobs?',
      'Which industries fit my chart best?',
      'What obstacles should I prepare for this month?',
    ],
  },
  {
    key: 'health_monthly',
    title: 'Health Report',
    fromRupees: 25,
    cadence: 'month',
    questions: [
      'How is my energy and health trending this month?',
      'Which weeks call for extra care?',
      'Is it a favorable month to start a new health routine?',
    ],
  },
  {
    key: 'finance_monthly',
    title: 'Finance Report',
    fromRupees: 25,
    cadence: 'month',
    questions: [
      'What’s my financial outlook this month?',
      'Are there windows favorable for investments?',
      'What decisions are better postponed?',
    ],
  },
  {
    key: 'relationship_monthly',
    title: 'Relationship Report',
    fromRupees: 25,
    cadence: 'month',
    questions: [
      'How will my relationship feel this month?',
      'What could cause friction, and when?',
      'Which days are best for important conversations?',
    ],
  },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ReportsSection() {
  return (
    <Section tone="paper" id="reports">
      <SectionHeading
        eyebrow="Go deeper"
        title="14 reports, grounded in your real chart"
        subtitle="Every report runs your own birth chart through a fixed set of classical calculations — not a generic template. A blurred preview is always free before you unlock the full reading."
      />

      <motion.div
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={listVariants}
      >
        {REPORTS.map((report) => (
          <motion.div
            key={report.key}
            variants={itemVariants}
            className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-raised"
          >
            <div className="relative h-36 w-full bg-paper-sunk">
              <Image
                src={`/reports/${report.key}.png`}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-6"
              />
            </div>
            <div className="flex flex-1 flex-col px-6 py-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-display text-lg leading-tight text-ink">{report.title}</h3>
                <span
                  className="shrink-0 rounded-pill bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-accent"
                  data-no-translate
                >
                  From ₹{report.fromRupees}
                  {report.cadence === 'month' ? '/mo' : ''}
                </span>
              </div>
              <ul className="space-y-2 text-[13.5px] leading-snug text-ink-muted">
                {report.questions.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span className="mt-[3px] text-accent" aria-hidden>
                      •
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
