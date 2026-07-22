import { Section } from '@/components/ui/Section';
import { AppCTA } from '@/components/ui/AppCTA';
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

export async function PanchangSection() {
  const data = await getTodayPanchang();

  return (
    <Section tone="paper" id="panchang">
      {/* Title + live indicator share a row (not a centered eyebrow+heading
          stack) so the "Live for {date}" badge reads as status attached to
          the heading, the way the design places it. */}
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <h2 className="font-display text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl">
          Today’s Panchang
        </h2>
        {data && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent" aria-hidden />
            <span>
              Live for <span data-no-translate>{data.date}</span>
            </span>
          </div>
        )}
      </div>

      {!data ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-rule bg-paper-raised p-8 text-center">
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
        // technique as Features, just 4 columns wide for these 8 limbs.
        <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
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
    </Section>
  );
}
