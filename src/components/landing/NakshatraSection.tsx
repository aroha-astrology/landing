'use client';

import { type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GoldButton } from '@/components/ui/GoldButton';
import { useT } from '@/lib/i18n/useT';

/**
 * The interactive tool. A slowly rotating constellation map on one side; an
 * elegant birth-details form on the other. Inputs are dark + transparent with
 * a golden underline that brightens on focus. Placeholders/aria-labels use the
 * useT helper since the DOM translator can't reach element attributes.
 *
 * The form is presentational here (submission is a no-op) — wiring it to the
 * Kundli backend is out of scope for the landing page.
 */

// Star coordinates for the decorative constellation (viewBox 0 0 200 200).
const STARS = [
  { cx: 40, cy: 60, r: 2.5 },
  { cx: 80, cy: 40, r: 1.8 },
  { cx: 120, cy: 70, r: 3 },
  { cx: 150, cy: 50, r: 2 },
  { cx: 100, cy: 110, r: 2.4 },
  { cx: 60, cy: 140, r: 1.6 },
  { cx: 140, cy: 150, r: 2.2 },
  { cx: 170, cy: 120, r: 1.5 },
];
const LINES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [4, 5],
  [4, 6],
  [6, 7],
];

const inputClass =
  'w-full border-0 border-b border-primary/30 bg-transparent px-1 py-2.5 text-text placeholder:text-text-dim transition-colors focus:border-primary focus:text-primary-ink focus:outline-none [color-scheme:dark]';

export function NakshatraSection() {
  const reduce = useReducedMotion();
  const t = useT();

  const onSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <section className="relative px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Rotating constellation. */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative h-64 w-64 sm:h-80 sm:w-80"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-6 rounded-full border border-primary/10" />
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
              {LINES.map(([a, b], i) => (
                <line
                  key={i}
                  x1={STARS[a].cx}
                  y1={STARS[a].cy}
                  x2={STARS[b].cx}
                  y2={STARS[b].cy}
                  stroke="rgba(212,175,55,0.35)"
                  strokeWidth="0.6"
                />
              ))}
              {STARS.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#F2CA50">
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur={`${3 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* Birth-details form. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-cormorant mb-2 text-base uppercase tracking-[0.35em] text-primary/80">
            Your Star Map
          </p>
          <h2 className="font-cinzel bg-gradient-to-b from-[#F7E7B0] to-[#D4AF37] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
            Discover your Nakshatra
          </h2>
          <p className="mt-4 max-w-md text-text-2">
            Enter your birth details to reveal the constellation that shaped your destiny.
          </p>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="dob" className="mb-1 block text-sm tracking-wide text-text-muted">
                Date of Birth
              </label>
              <input id="dob" type="date" className={inputClass} aria-label={t('Date of Birth')} />
            </div>
            <div>
              <label htmlFor="tob" className="mb-1 block text-sm tracking-wide text-text-muted">
                Time of Birth
              </label>
              <input id="tob" type="time" className={inputClass} aria-label={t('Time of Birth')} />
            </div>
            <div>
              <label htmlFor="pob" className="mb-1 block text-sm tracking-wide text-text-muted">
                Place of Birth
              </label>
              <input
                id="pob"
                type="text"
                className={inputClass}
                placeholder={t('City, Country')}
                aria-label={t('Place of Birth')}
              />
            </div>

            <GoldButton type="submit" variant="outline" className="mt-2 w-full sm:w-auto">
              Reveal My Nakshatra <span aria-hidden>→</span>
            </GoldButton>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
