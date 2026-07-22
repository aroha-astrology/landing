'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Dark Act I. The nine grahas of Jyotish as concentric orbiting rings — pure
 * SVG + CSS keyframes (no canvas/WebGL, that stack was removed). A static
 * legend below carries the same data for anyone who can't or doesn't hover,
 * and doubles as the accessible fallback when reduced motion is requested.
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

// Which ring (0 = inner, 1 = middle, 2 = outer) each graha orbits on.
const RING_OF = [0, 0, 0, 1, 1, 1, 2, 2, 2];
const RING_RADIUS = [90, 130, 170];
const RING_DURATION = ['22s', '32s', '46s'];
const RING_OFFSET_DEG = [0, 40, 80];
const CENTER = 200;

// Rounded to 2dp: Math.cos/sin can differ in the last bit between the SSR
// pass and the client's hydration pass, and React's hydration check compares
// numeric SVG attributes as exact strings — an unrounded value here causes a
// (harmless but noisy) hydration mismatch on every load.
function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Math.round((CENTER + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((CENTER + r * Math.sin(rad)) * 100) / 100,
  };
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function NavagrahaSection() {
  const reduce = useReducedMotion();

  const rings = RING_RADIUS.map((radius, ringIndex) => {
    const planets = GRAHAS.filter((_, i) => RING_OF[i] === ringIndex);
    const step = 360 / planets.length;
    return {
      radius,
      duration: RING_DURATION[ringIndex],
      dots: planets.map((g, i) => ({ ...g, ...polar(radius, RING_OFFSET_DEG[ringIndex] + i * step) })),
    };
  });

  return (
    <Section tone="night" id="navagraha">
      <SectionHeading eyebrow="The Nine Influences" title="Navagraha" dark />

      <div className="mt-14 flex justify-center">
        <svg
          viewBox="0 0 400 400"
          className="h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px]"
          role="img"
          aria-label="The nine grahas of Jyotish orbiting in concentric rings"
        >
          <defs>
            {GRAHAS.map((g) => (
              <radialGradient key={g.sanskrit} id={`glow-${g.sanskrit}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={g.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={g.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {RING_RADIUS.map((r) => (
            <circle key={r} cx={CENTER} cy={CENTER} r={r} fill="none" stroke="var(--night-rule)" strokeWidth={1} />
          ))}

          {rings.map((ring, ringIndex) => (
            <g
              key={ringIndex}
              style={
                reduce
                  ? undefined
                  : {
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animation: `orbit-spin-${ringIndex} ${ring.duration} linear infinite`,
                    }
              }
            >
              {ring.dots.map((dot) => (
                <g key={dot.sanskrit}>
                  {/* Faint spoke from center to this graha — rotates with its
                      dot (same <g>) so it fills the empty arcs between the
                      3-per-ring dots without detaching during the orbit. */}
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={dot.x}
                    y2={dot.y}
                    stroke={dot.color}
                    strokeOpacity={0.18}
                    strokeWidth={1}
                  />
                  <circle cx={dot.x} cy={dot.y} r={22} fill={`url(#glow-${dot.sanskrit})`} aria-hidden />
                  <circle cx={dot.x} cy={dot.y} r={9} fill={dot.color} data-no-translate>
                    <title>{`${dot.sanskrit} (${dot.english}) — ${dot.domain}`}</title>
                  </circle>
                </g>
              ))}
            </g>
          ))}

          <circle cx={CENTER} cy={CENTER} r={26} fill="url(#glow-Chandra)" opacity={0.4} aria-hidden />
          <circle cx={CENTER} cy={CENTER} r={4} fill="var(--night-ink)" />
        </svg>
      </div>

      {!reduce && (
        <style>{`
          @keyframes orbit-spin-0 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes orbit-spin-1 { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes orbit-spin-2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      )}

      <motion.ul
        className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={listVariants}
      >
        {GRAHAS.map((g) => (
          <motion.li key={g.sanskrit} variants={itemVariants} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: g.color, boxShadow: `0 0 10px ${g.color}99` }}
              aria-hidden
              data-no-translate
            />
            <p className="text-sm leading-snug">
              <span className="font-medium text-night-ink">{g.sanskrit}</span>{' '}
              <span className="text-night-ink-2">({g.english})</span>
              <br />
              <span className="text-night-ink-2">{g.domain}</span>
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
