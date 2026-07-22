'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

const READOUTS = ['Ayanamsa 24.13°', '9 Grahas', 'D1–D60'];

const SPOKES = Array.from({ length: 12 }, (_, i) => i * 30);

export function PrecisionSection() {
  const reduce = useReducedMotion();

  return (
    <Section tone="night" id="precision">
      <SectionHeading eyebrow="The method" title="Precision, not vibes" dark />

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-base text-night-ink-2 sm:text-lg">
            Every chart starts with the Swiss Ephemeris — the same astronomical calculation
            engine observatories rely on — to place all nine grahas to sub-degree accuracy at
            your exact moment and place of birth.
          </p>
          <p className="mt-4 text-base text-night-ink-2 sm:text-lg">
            Vedic astrology tracks the actual visible constellations rather than the fixed
            Western calendar zodiac, so we apply the Lahiri ayanamsa — India’s official sidereal
            correction — before deriving divisional charts, from D1 through D60, off that base
            chart.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-night-rule pt-6">
            {READOUTS.map((r) => (
              <span key={r} className="font-data text-lg" data-no-translate>
                {r}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            viewBox="0 0 300 300"
            className="h-[240px] w-[240px] sm:h-[300px] sm:w-[300px]"
            role="img"
            aria-label="A decorative chart-wheel outline"
          >
            <g
              style={
                reduce
                  ? undefined
                  : {
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animation: 'wheel-spin 90s linear infinite',
                    }
              }
            >
              <circle cx={150} cy={150} r={135} fill="none" stroke="var(--night-rule)" strokeWidth={1} />
              <circle cx={150} cy={150} r={95} fill="none" stroke="var(--night-rule)" strokeWidth={1} />
              {SPOKES.map((deg) => {
                const rad = (deg * Math.PI) / 180;
                // Rounded to 2dp: Math.cos/sin can differ in the last bit
                // between the SSR pass and the client's hydration pass, and
                // React compares numeric SVG attributes as exact strings.
                const x1 = Math.round((150 + 95 * Math.cos(rad)) * 100) / 100;
                const y1 = Math.round((150 + 95 * Math.sin(rad)) * 100) / 100;
                const x2 = Math.round((150 + 135 * Math.cos(rad)) * 100) / 100;
                const y2 = Math.round((150 + 135 * Math.sin(rad)) * 100) / 100;
                return (
                  <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--night-rule)" strokeWidth={1} />
                );
              })}
            </g>
            <circle cx={150} cy={150} r={3} fill="var(--night-accent)" />
          </svg>
          {!reduce && (
            <style>{`
              @keyframes wheel-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
