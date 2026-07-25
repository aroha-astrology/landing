import type { ReactNode } from 'react';

/**
 * Shared section wrapper. `tone` picks the surface: `paper` (default),
 * `sunk` (a faint warm band, e.g. the languages strip) or `night` (a
 * full-bleed dark act — Navagraha, Precision). Keeping the three tones to a
 * single component is what makes the light/dark rhythm read as one system
 * instead of ad-hoc per-section colours.
 */
type Tone = 'paper' | 'sunk' | 'night';

// Vertical rhythm is fluid and tone-dependent: the dark acts are given a
// taller measure than the paper sections so they read as interludes rather
// than just another band. Keeping this here means call sites never need an
// !important override to restore the design's spacing.
const TONE_CLASSES: Record<Tone, string> = {
  paper: 'bg-paper text-ink py-[clamp(56px,7vw,88px)]',
  sunk: 'bg-paper-sunk text-ink py-[clamp(56px,7vw,88px)]',
  night: 'bg-night text-night-ink py-[clamp(64px,8vw,104px)]',
};

type SectionProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
};

export function Section({ children, tone = 'paper', className = '', id }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative px-[clamp(20px,4vw,56px)] ${TONE_CLASSES[tone]} ${className}`}
    >
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </section>
  );
}
