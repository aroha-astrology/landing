'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Dark Act I, rendered as an "instrument strip" — a single hairline with the
 * nine grahas marked along it at even intervals, echoing an instrument's
 * calibration scale rather than a chart of orbiting bodies. Every mark is
 * uniform amber (no per-planet colour): the point is that we read every
 * graha's position with the same precision, not that they look different
 * from each other.
 */

const GRAHAS = [
  { sanskrit: 'Surya', english: 'Sun', domain: 'Soul & vitality' },
  { sanskrit: 'Chandra', english: 'Moon', domain: 'Mind & emotion' },
  { sanskrit: 'Mangala', english: 'Mars', domain: 'Drive & courage' },
  { sanskrit: 'Budha', english: 'Mercury', domain: 'Intellect & speech' },
  { sanskrit: 'Guru', english: 'Jupiter', domain: 'Wisdom & growth' },
  { sanskrit: 'Shukra', english: 'Venus', domain: 'Love & pleasure' },
  { sanskrit: 'Shani', english: 'Saturn', domain: 'Discipline & time' },
  { sanskrit: 'Rahu', english: 'North Node', domain: 'Ambition & illusion' },
  { sanskrit: 'Ketu', english: 'South Node', domain: 'Detachment & release' },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function NavagrahaSection() {
  return (
    // `!py-` forces the fluid clamp() rhythm over Section's own fixed
    // py-20/sm:py-28 — two same-specificity utilities on one element aren't
    // resolved by attribute order, so importance is what guarantees this.
    <Section tone="night" id="navagraha">
      <SectionHeading
        eyebrow="The Nine Influences"
        title="Navagraha"
        subtitle="Each Graha governs a domain of your chart. We read their positions the way an instrument reads a scale — precisely, not poetically."
        dark
      />

      <div className="relative mt-16">
        {/* The hairline itself; each dot's fill matches the section
            background so it reads as a notch cut into the line rather than
            a dot sitting on top of it. */}
        <div className="relative mb-11 h-px bg-night-rule">
          {GRAHAS.map((g, i) => (
            <div
              key={g.sanskrit}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-night"
              style={{ left: `${(i / (GRAHAS.length - 1)) * 100}%` }}
              aria-hidden
            />
          ))}
        </div>

        <motion.ul
          className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-x-3 gap-y-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
        >
          {GRAHAS.map((g) => (
            <motion.li key={g.sanskrit} variants={itemVariants}>
              <p className="font-display text-[17px] text-night-ink">{g.sanskrit}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.04em] text-night-accent">{g.english}</p>
              <p className="mt-1.5 text-[12px] leading-[1.4] text-night-ink-2">{g.domain}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
