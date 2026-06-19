'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TiltCard } from '@/components/ui/TiltCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * The Navagraha — the nine influences of Jyotish. A grid of tilt cards, each
 * with a glowing orb tinted to match its planet in the 3D scene, the Sanskrit
 * name, its English counterpart, and the life-domain it governs. The grid
 * parallax-drifts as the section scrolls through the viewport.
 */

const GRAHAS = [
  { sanskrit: 'Surya', english: 'Sun', domain: 'Vitality & soul', color: '#F2CA50' },
  { sanskrit: 'Chandra', english: 'Moon', domain: 'Mind & emotion', color: '#E8EAF0' },
  { sanskrit: 'Mangala', english: 'Mars', domain: 'Energy & courage', color: '#E0533B' },
  { sanskrit: 'Budha', english: 'Mercury', domain: 'Intellect & speech', color: '#7FD1A0' },
  { sanskrit: 'Guru', english: 'Jupiter', domain: 'Wisdom & fortune', color: '#E8B04B' },
  { sanskrit: 'Shukra', english: 'Venus', domain: 'Love & beauty', color: '#F2D7D5' },
  { sanskrit: 'Shani', english: 'Saturn', domain: 'Discipline & karma', color: '#5A82C2' },
  { sanskrit: 'Rahu', english: 'North Node', domain: 'Desire & ambition', color: '#9A6FC4' },
  { sanskrit: 'Ketu', english: 'South Node', domain: 'Detachment & moksha', color: '#B8BEC6' },
];

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function NavagrahaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section ref={ref} className="relative px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="The Nine Influences" title="Navagraha" className="mb-12" />

        <motion.div
          style={{ y }}
          className="grid grid-cols-2 gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.07 }}
        >
          {GRAHAS.map((g) => (
            <motion.div key={g.sanskrit} variants={item}>
              <TiltCard className="flex flex-col items-center gap-3 p-6 text-center">
                {/* Glowing orb tinted to match the 3D planet. */}
                <span
                  className="h-12 w-12 rounded-full"
                  data-no-translate
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${g.color}, ${g.color}55 55%, transparent 75%)`,
                    boxShadow: `0 0 22px ${g.color}88`,
                  }}
                  aria-hidden
                />
                <h3 className="font-cinzel text-xl text-text">{g.sanskrit}</h3>
                <p className="-mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">
                  {g.english}
                </p>
                <p className="font-cormorant text-base italic text-primary/80">{g.domain}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
