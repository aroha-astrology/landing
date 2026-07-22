import type { ReactNode } from 'react';

/**
 * Shared section wrapper. `tone` picks the surface: `paper` (default),
 * `sunk` (a faint warm band, e.g. the languages strip) or `night` (a
 * full-bleed dark act — Navagraha, Precision). Keeping the three tones to a
 * single component is what makes the light/dark rhythm read as one system
 * instead of ad-hoc per-section colours.
 */
type Tone = 'paper' | 'sunk' | 'night';

const TONE_CLASSES: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  sunk: 'bg-paper-sunk text-ink',
  night: 'bg-night text-night-ink',
};

type SectionProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
};

export function Section({ children, tone = 'paper', className = '', id }: SectionProps) {
  return (
    <section id={id} className={`relative px-5 py-20 sm:px-8 sm:py-28 ${TONE_CLASSES[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
