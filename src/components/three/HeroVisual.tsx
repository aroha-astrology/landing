'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { CelestialSvg } from './CelestialSvg';

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
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<{ load: boolean; lite: boolean }>({ load: false, lite: false });
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);

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

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      <CelestialSvg
        className={`absolute right-[-30%] top-1/2 h-[120%] max-h-[900px] w-auto -translate-y-1/2 opacity-60 transition-opacity duration-1000 md:right-[-8%] md:opacity-90 lg:right-[-2%] ${
          ready ? '!opacity-0' : ''
        }`}
      />
      {mode.load && (
        <div className={`absolute inset-y-0 right-[-14%] w-[80%] transition-opacity duration-[1400ms] lg:right-[-6%] lg:w-[64%] ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <CelestialScene active={active} reduced={reduced} lite={mode.lite} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
