import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LINKS } from '@/lib/links';
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

function buildLimbs(data: PanchangData): Limb[] {
  return [
    {
      label: 'Tithi',
      value: data.tithi.name,
      detail: `${data.tithi.paksha} Paksha`,
    },
    {
      label: 'Nakshatra',
      value: data.nakshatra.name,
      detail: `Pada ${data.nakshatra.pada} · ${data.nakshatra.lord}`,
    },
    { label: 'Yoga', value: data.yoga.name },
    { label: 'Karana', value: data.karana.name },
    { label: 'Vara', value: data.vara },
  ];
}

export async function PanchangSection() {
  const data = await getTodayPanchang();

  return (
    <Section tone="paper" id="panchang">
      <SectionHeading eyebrow="Live" title="Today's Panchang" />

      {!data ? (
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-rule bg-paper-raised p-8 text-center">
          <p className="text-ink-2">
            Panchang is temporarily unavailable — check it in the app.
          </p>
          <div className="mt-6">
            <Button variant="solid" href={LINKS.panchang}>
              Open Panchang in the app →
            </Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-rule bg-paper-raised p-8">
          <p className="mb-6 text-center text-sm text-ink-muted">
            <time dateTime={data.date} data-no-translate>
              {data.date}
            </time>
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {buildLimbs(data).map((limb) => (
              <div
                key={limb.label}
                className="rounded-xl border border-rule bg-paper-sunk px-4 py-5 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {limb.label}
                </p>
                <p className="font-display mt-2 text-lg text-ink" data-no-translate>
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

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-rule pt-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Sunrise</p>
              <p className="font-data mt-1 text-lg" data-no-translate>
                {data.sunriseTime}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Sunset</p>
              <p className="font-data mt-1 text-lg" data-no-translate>
                {data.sunsetTime}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Rahu Kaal</p>
              <p className="font-data mt-1 text-lg" data-no-translate>
                {data.rahuKaal.start} – {data.rahuKaal.end}
              </p>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
