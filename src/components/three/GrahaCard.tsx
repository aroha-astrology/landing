'use client';

import { TrackedLink } from '@/components/ui/TrackedLink';
import { GRAHA_INFO } from './grahaInfo';

/**
 * What one graha stands for: the card a visitor gets by clicking a planet in
 * the hero armillary (the WebGL scene on a desktop, the tappable SVG on a
 * phone). Where it sits is the caller's business, passed as `className`.
 */
export function GrahaCard({
  name,
  onClose,
  className = '',
}: {
  /** A key of GRAHA_INFO, e.g. "Saturn". Renders nothing for a name it doesn't know. */
  name: string;
  onClose: () => void;
  className?: string;
}) {
  const info = GRAHA_INFO[name];
  if (!info) return null;

  return (
    <aside
      aria-label={`${name} in Vedic astrology`}
      aria-live="polite"
      className={`pointer-events-auto relative rounded-2xl border border-astro-rule bg-astro-night/85 p-5 text-astro-ink shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
      style={{ animation: 'aroha-card-in 320ms ease-out' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-astro-ink-2 transition-colors hover:bg-white/5 hover:text-astro-ink"
      >
        ×
      </button>
      <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-astro-gold">Graha · {info.day}</p>
      <p className="font-display mt-2 text-[26px] font-medium leading-tight">
        {name} <em className="font-normal text-astro-gold">{info.sanskrit}</em>
      </p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-astro-ink-2">{info.blurb}</p>
      <p className="mt-4 text-[11.5px] font-bold uppercase tracking-[0.2em] text-astro-ink-2">Responsible for</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {info.governs.map((g) => (
          <li key={g} className="rounded-full border border-astro-rule px-2.5 py-1 text-[12.5px] text-astro-ink">
            {g}
          </li>
        ))}
      </ul>
      <TrackedLink
        href="/blog/navagraha-nine-planets-vedic-astrology"
        cta="hero_graha_read_more"
        location="hero_armillary"
        product="astrology"
        className="mt-4 inline-flex text-[13.5px] font-semibold text-astro-gold underline-offset-4 hover:underline"
      >
        Read about all nine grahas <span aria-hidden>&nbsp;→</span>
      </TrackedLink>
    </aside>
  );
}
