'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { GrahaChakra } from './GrahaChakra';
import { GrahaCard } from './GrahaCard';

/**
 * The hero's visual layer, from 768px up: the orrery (GrahaChakra) fills the
 * right half of the hero behind the copy. Click a planet and a card says what
 * it governs. Below 768px the orrery is its own block under the buttons
 * instead (HeroArmillaryMobile): behind a phone's full-width copy its planets
 * sat under the heading and the paragraph.
 */
export function HeroVisual() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const select = (name: string) => {
    setSelected(name);
    track('cta_click', { cta: 'hero_graha_click', location: 'hero_orrery', product: 'astrology' });
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* The picture and its hint share one box, so the hint always sits over the orrery's centre. */}
      <div className="absolute top-1/2 hidden aspect-square w-[58vw] -translate-y-1/2 md:right-[-18%] md:block lg:right-[1%] lg:w-[min(46vw,680px)]">
        <GrahaChakra className="h-full w-full" onSelect={select} selected={selected} />
        <p
          aria-hidden
          className="absolute -top-2 left-[38%] z-10 flex -translate-x-1/2 lg:left-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-astro-rule bg-astro-night/60 px-4 py-1.5 text-[12.5px] font-semibold tracking-[0.04em] text-astro-gold backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-astro-gold" style={{ animation: 'aroha-twinkle 2.4s ease-in-out infinite' }} />
          Click any planet to see what it governs
        </p>
      </div>

      {selected && (
        <GrahaCard
          key={selected}
          name={selected}
          onClose={() => setSelected(null)}
          className="!absolute bottom-8 right-[clamp(20px,4vw,56px)] z-10 hidden w-[min(340px,calc(100vw-40px))] md:block"
        />
      )}
    </div>
  );
}
