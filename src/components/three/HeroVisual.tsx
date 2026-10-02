'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { CelestialSvg } from './CelestialSvg';
import { GRAHA_INFO } from './grahaInfo';

// three.js + R3F are only ever downloaded when the device qualifies below.
const CelestialScene = dynamic(() => import('./CelestialScene'), { ssr: false });

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/** Desktop-class device, WebGL available, no reduced-motion or save-data preference. */
function qualifies(): { ok: boolean; lite: boolean } {
  // Reduced motion gets the still SVG; no reason to download a 3D engine.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { ok: false, lite: false };
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? '')) return { ok: false, lite: false };
  if (!window.matchMedia('(min-width: 768px)').matches) return { ok: false, lite: false };
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores < 4) return { ok: false, lite: false };
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return { ok: false, lite: false };
  } catch {
    return { ok: false, lite: false };
  }
  return { ok: true, lite: cores < 8 || window.innerWidth < 1100 };
}

/**
 * The hero's visual layer. Renders the SVG armillary immediately (server
 * HTML, no layout shift), then — on a qualifying device, after the browser
 * is idle — lazy-loads the WebGL scene and cross-fades it in. The canvas
 * only animates while the hero is on screen and the tab is visible.
 * Once the scene is up, clicking a graha opens a card on what it governs.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<{ load: boolean; lite: boolean }>({ load: false, lite: false });
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);

    const { ok, lite } = qualifies();
    let idle: number | undefined;
    if (ok) {
      const start = () => setMode({ load: true, lite });
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
      idle = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    }
    return () => {
      mq.removeEventListener('change', onChange);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (idle !== undefined) (w.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting && document.visibilityState === 'visible'), { threshold: 0 });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === 'visible' && el.getBoundingClientRect().bottom > 0);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const info = selected ? GRAHA_INFO[selected] : undefined;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      <CelestialSvg
        className={`absolute right-[-30%] top-1/2 h-[120%] max-h-[900px] w-auto -translate-y-1/2 opacity-60 transition-opacity duration-1000 md:right-[-8%] md:opacity-90 lg:right-[-2%] ${
          ready ? '!opacity-0' : ''
        }`}
      />
      {mode.load && (
        <div
          aria-hidden
          className={`absolute inset-y-0 right-[-14%] w-[80%] transition-opacity duration-[1400ms] lg:right-[-6%] lg:w-[64%] ${ready ? 'pointer-events-auto opacity-100' : 'opacity-0'}`}
        >
          <CelestialScene
            active={active}
            reduced={reduced}
            lite={mode.lite}
            onReady={() => setReady(true)}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      )}

      {/* Only the WebGL scene is clickable, so the hint waits for it. 74% is the armillary's centre at md and lg. */}
      {ready && (
        <p
          aria-hidden
          className="absolute left-[74%] top-6 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-astro-rule bg-astro-night/60 px-4 py-1.5 text-[12.5px] font-semibold tracking-[0.04em] text-astro-gold backdrop-blur-sm"
          style={{ animation: 'aroha-card-in 600ms ease-out' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-astro-gold" style={{ animation: 'aroha-twinkle 2.4s ease-in-out infinite' }} />
          Click any planet to see what it governs
        </p>
      )}

      {selected && info && (
        <aside
          key={selected}
          aria-label={`${selected} in Vedic astrology`}
          aria-live="polite"
          className="pointer-events-auto absolute bottom-8 right-[clamp(20px,4vw,56px)] z-10 w-[min(340px,calc(100vw-40px))] rounded-2xl border border-astro-rule bg-astro-night/85 p-5 text-astro-ink shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
          style={{ animation: 'aroha-card-in 320ms ease-out' }}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-astro-ink-2 transition-colors hover:bg-white/5 hover:text-astro-ink"
          >
            ×
          </button>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-astro-gold">Graha · {info.day}</p>
          <p className="font-display mt-2 text-[26px] font-medium leading-tight">
            {selected} <em className="font-normal text-astro-gold">{info.sanskrit}</em>
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
      )}
    </div>
  );
}
