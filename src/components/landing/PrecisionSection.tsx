'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

// Ayanamsa drifts about 1 arcsecond a year, so hardcoding today's value here
// (rather than fetching it) is an acceptable approximation for a marketing
// stat — the real, live figure is what the app computes per-chart.
const STATS = [
  { value: '24.13°', label: 'Ayanamsa today', pct: 24 },
  { value: '9', label: 'Grahas mapped', pct: 90 },
  { value: 'D1–D60', label: 'Divisional charts', pct: 100 },
];

// 12 evenly-spaced ticks around the dial, one per 30°.
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);
const AYANAMSA_DEG = 24.13;

export function PrecisionSection() {
  return (
    <Section tone="night" id="precision">
      <div className="grid gap-12 lg:grid-cols-[minmax(280px,1fr)_minmax(240px,340px)] lg:items-center lg:gap-14">
        <div
        >
          <SectionHeading eyebrow="The method" title="How the charts are calculated" dark align="left" />

          <p className="mt-6 text-base text-night-ink-2 sm:text-lg">
            Every chart starts with the Swiss Ephemeris, an astronomical calculation engine that
            observatories rely on, to place all nine grahas to sub-degree accuracy at your exact
            moment and place of birth.
          </p>
          <p className="mt-4 text-base text-night-ink-2 sm:text-lg">
            Vedic astrology follows the constellations as they appear in the sky, while the
            Western calendar zodiac stays fixed to the seasons. So we apply the Lahiri ayanamsa,
            India’s official sidereal correction, and derive the divisional charts from D1
            through D60 from that base chart.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-night-rule pt-7 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl italic text-night-accent" data-no-translate>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-night-ink-2">{stat.label}</div>
                {/* Track + fill rather than a single gradient bar, so the
                    filled portion stays a flat, legible amber at any width. */}
                <div className="relative mt-2.5 h-0.5 bg-night-rule">
                  <div
                    className="absolute inset-y-0 left-0 bg-night-accent"
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex justify-center"
        >
          {/* A static instrument dial (not the orbiting-rings treatment used
              for Navagraha above) — ticks + one amber marker read as a
              precision gauge, echoing the "instrument, not poetry" copy. */}
          <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-full border border-night-rule">
            {TICKS.map((deg) => (
              <div
                key={deg}
                className="absolute inset-0"
                style={{ transform: `rotate(${deg}deg)` }}
                aria-hidden
              >
                <div className="absolute left-1/2 top-[6px] h-[10px] w-px -translate-x-1/2 bg-night-ink opacity-[0.35]" />
              </div>
            ))}
            <div
              className="absolute inset-0"
              style={{ transform: `rotate(${AYANAMSA_DEG}deg)` }}
              aria-hidden
            >
              <div className="absolute left-1/2 top-1 h-4 w-0.5 -translate-x-1/2 bg-night-accent" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-3xl italic text-night-accent" data-no-translate>
                {AYANAMSA_DEG}°
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-night-ink-2">Lahiri</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
