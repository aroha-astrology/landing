'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { AppCTA } from '@/components/ui/AppCTA';
import { useT } from '@/lib/i18n/useT';
import { CITIES, type City } from '@/data/cities';
import { getUtcOffsetMinutes } from '@/lib/timezone';

/**
 * Free Kundli (D1 birth chart) generator. Same form/state-machine shape as
 * MoonSignSection, but a full chart needs an observer location, which the
 * curated CITIES list doesn't carry (only an IANA timezone id) — so submit
 * first resolves lat/lng via /api/geocode (Nominatim), then POSTs
 * /api/kundli with those coordinates. Two sequential network calls, one
 * loading state; never a fabricated placeholder chart.
 */

type PlanetResult = {
  planet: string;
  sign: string;
  signDegree: number;
  house: number;
  isRetrograde: boolean;
};

type KundliResult = {
  ascendant: { sign: string; degree: number; nakshatra: string; nakshatraPada: number };
  planets: PlanetResult[];
};

type FormState = 'idle' | 'loading' | 'error' | 'success';

const MOTION_PROPS = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

export function KundliSection({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' } = {}) {
  const t = useT();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityList, setShowCityList] = useState(false);

  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<KundliResult | null>(null);

  const cityMatches = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (q.length < 1) return [];
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [cityQuery]);

  const canSubmit = Boolean(date && time && selectedCity) && state !== 'loading';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date || !time || !selectedCity) return;

    setState('loading');
    setErrorMessage('');
    setResult(null);

    try {
      const geoRes = await fetch(
        `/api/geocode?city=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}`,
      );
      if (geoRes.status === 429) {
        setErrorMessage('Too many requests — try again in a minute.');
        setState('error');
        return;
      }
      const geo = geoRes.ok ? await geoRes.json() : null;
      if (!geo) {
        setErrorMessage("Couldn't locate that city. Try a nearby major city instead.");
        setState('error');
        return;
      }

      const tzOffsetMinutes = getUtcOffsetMinutes(selectedCity.timezone, date);
      const res = await fetch('/api/kundli', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ date, time, tzOffsetMinutes, lat: geo.lat, lng: geo.lon }),
      });

      if (res.status === 422) {
        setErrorMessage('Check your birth details and try again.');
        setState('error');
        return;
      }
      if (res.status === 429) {
        setErrorMessage('Too many requests — try again in a minute.');
        setState('error');
        return;
      }
      if (!res.ok) {
        setErrorMessage('Something went wrong. Please try again.');
        setState('error');
        return;
      }

      const data = (await res.json()) as KundliResult;
      setResult(data);
      setState('success');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setState('error');
    }
  }

  return (
    <Section tone="paper" id="kundli">
      <SectionHeading
        as={headingLevel}
        eyebrow="Free tool"
        title="Generate your free Kundli"
        subtitle="Your full Vedic birth chart — ascendant, houses and planet placements — computed from the Swiss Ephemeris."
      />

      <motion.div
        {...MOTION_PROPS}
        className="mx-auto mt-12 max-w-xl rounded-2xl border border-rule bg-paper-raised p-8"
      >
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="kundli-date" className="mb-1.5 block text-sm font-medium text-ink-2">
              Date of birth
            </label>
            <input
              id="kundli-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={t('Date of birth')}
              aria-label={t('Date of birth')}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="kundli-time" className="mb-1.5 block text-sm font-medium text-ink-2">
              Time of birth
            </label>
            <input
              id="kundli-time"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder={t('Time of birth')}
              aria-label={t('Time of birth')}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="relative">
            <label htmlFor="kundli-city" className="mb-1.5 block text-sm font-medium text-ink-2">
              Place of birth
            </label>
            <input
              id="kundli-city"
              type="text"
              required
              autoComplete="off"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setSelectedCity(null);
                setShowCityList(true);
              }}
              onFocus={() => setShowCityList(true)}
              onBlur={() => setTimeout(() => setShowCityList(false), 150)}
              placeholder={t('City, country')}
              aria-label={t('City, country')}
              className="w-full rounded-lg border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-accent"
            />
            {showCityList && cityMatches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-rule bg-paper-raised shadow-lg">
                {cityMatches.map((c) => (
                  <li key={`${c.name}-${c.country}`}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setSelectedCity(c);
                        setCityQuery(`${c.name}, ${c.country}`);
                        setShowCityList(false);
                      }}
                      className="block w-full px-3.5 py-2 text-left text-sm text-ink hover:bg-accent-soft"
                    >
                      {c.name}, <span className="text-ink-muted">{c.country}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedCity ? (
              <p className="mt-1.5 text-xs text-ink-muted">
                Timezone: <span data-no-translate>{selectedCity.timezone}</span>
              </p>
            ) : (
              cityQuery.length > 0 && (
                <p className="mt-1.5 text-xs text-ink-muted">Select a city from the list.</p>
              )
            )}
          </div>

          <Button type="submit" variant="solid" className="w-full" disabled={!canSubmit}>
            {state === 'loading' ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden
                />
                Calculating…
              </>
            ) : (
              'Generate my Kundli'
            )}
          </Button>
        </form>

        {state === 'error' && (
          <p role="alert" className="mt-5 rounded-lg bg-accent-soft px-4 py-3 text-sm text-ink-2">
            {errorMessage}
          </p>
        )}

        {state === 'success' && result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-xl border border-rule-strong bg-paper-sunk p-6"
          >
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Ascendant (Lagna)
              </p>
              <p className="font-display mt-1 text-4xl font-medium text-ink" data-no-translate>
                {result.ascendant.sign}
              </p>
              <p className="font-data mt-2 text-sm text-ink-2">
                <span data-no-translate>{result.ascendant.degree.toFixed(2)}°</span> ·{' '}
                <span data-no-translate>{result.ascendant.nakshatra}</span> ·{' '}
                <span data-no-translate>Pada {result.ascendant.nakshatraPada}</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-px border border-rule bg-rule sm:grid-cols-3">
              {result.planets.map((p) => (
                <div key={p.planet} className="bg-paper px-3 py-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                    {p.planet}
                  </p>
                  <p className="font-data mt-1 text-sm text-ink" data-no-translate>
                    {p.sign} {p.isRetrograde && '℞'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted" data-no-translate>
                    House {p.house}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <AppCTA variant="solid">See houses, dashas &amp; full reading →</AppCTA>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
}
