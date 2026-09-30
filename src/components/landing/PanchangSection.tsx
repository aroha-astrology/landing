import { Section } from '@/components/ui/Section';
import { AppCTA } from '@/components/ui/AppCTA';
import { FeatureVideo, FEATURE_VIDEOS } from '@/components/ui/PromoVideo';
import { getTodayPanchang, type PanchangData } from '@/lib/panchang';

/**
 * Live "today's Panchang" widget. An async Server Component — no client JS,
 * no entrance animation (that needs 'use client'; a plain static reveal is
 * the simpler, correct choice here). Renders real values fetched from the
 * live backend; on fetch failure it shows an honest unavailable state and a
 * link into the app rather than ever falling back to stale/sample data.
 */

type Limb = {
  label: string;
  value: string;
  detail?: string;
};

// All 8 limbs as one flat, equal-weight set (rather than a "primary 5" card
// plus a separate timings row) — that's what turns the section into a clean
// 4-column hairline grid instead of two visually different blocks.
function buildLimbs(data: PanchangData): Limb[] {
  return [
    { label: 'Tithi', value: data.tithi.name, detail: `${data.tithi.paksha} Paksha` },
    {
      label: 'Nakshatra',
      value: data.nakshatra.name,
      detail: `Pada ${data.nakshatra.pada} · ${data.nakshatra.lord}`,
    },
    { label: 'Yoga', value: data.yoga.name },
    { label: 'Karana', value: data.karana.name },
    { label: 'Vara', value: data.vara },
    { label: 'Sunrise', value: data.sunriseTime },
    { label: 'Sunset', value: data.sunsetTime },
    { label: 'Rahu Kaal', value: `${data.rahuKaal.start} – ${data.rahuKaal.end}` },
  ];
}

export async function PanchangSection({ intro = false, video = true }: { intro?: boolean; video?: boolean } = {}) {
  const data = await getTodayPanchang();

  return (
    <Section tone="paper" id="panchang">
      {/* Title + live indicator share a row (not a centered eyebrow+heading
          stack) so the "Live for {date}" badge reads as status attached to
          the heading, the way the design places it. */}
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="reveal max-w-2xl">
          {intro && <p className="j-eyebrow text-[13px]">Daily guidance</p>}
          <h2 className="font-display text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl">Today’s Panchang</h2>
          {intro && (
          <p className="mt-4 text-base text-ink-2 sm:text-lg">
            The five limbs of the day, live from the Aroha backend. Your personal Rashifal and transits are in the app; the full Panchang with
            Choghadiya and muhurta windows is on the{' '}
            <a href="/panchang" className="j-link underline underline-offset-4">
              Panchang page
            </a>
            .
          </p>
          )}
        </div>
        {data && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent" aria-hidden />
            <span>
              Live for <span data-no-translate>{data.date}</span>
            </span>
          </div>
        )}
      </div>

      {/* The live grid is the substance; the film beside it shows the same
          day in the app (Choghadiya, muhurta windows) for anyone deciding
          whether to install. Poster-only until played. */}
      <div className={video ? 'grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14' : ''}>
        <div>
          {!data ? (
            <div className={`${video ? '' : 'mx-auto '}max-w-lg rounded-2xl border border-rule bg-paper-raised p-8 text-center`}>
              <p className="text-ink-2">
                Panchang is temporarily unavailable — check it in the app.
              </p>
              <div className="mt-6">
                <AppCTA variant="solid">Open Panchang in the app →</AppCTA>
              </div>
            </div>
          ) : (
            // Hairline grid: 1px gaps over a rule-coloured background, each cell
            // filled with the section's own surface colour (paper) — same
            // technique as Features: 4 columns on tablets, 2 beside the film.
            <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4 lg:grid-cols-2">
              {buildLimbs(data).map((limb) => (
                <div key={limb.label} className="bg-paper px-5 py-[22px]">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                    {limb.label}
                  </p>
                  <p className="font-display text-[19px] text-ink" data-no-translate>
                    {limb.value}
                  </p>
                  {limb.detail && (
                    <p className="mt-1 text-xs text-ink-muted" data-no-translate>
                      {limb.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {video && <FeatureVideo video={FEATURE_VIDEOS.dailyPanchang} className="reveal mx-auto w-full max-w-[260px]" />}
      </div>
    </Section>
  );
}
