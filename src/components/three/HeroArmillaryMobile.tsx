'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { CelestialSvg } from './CelestialSvg';
import { GrahaCard } from './GrahaCard';

/**
 * The hero armillary on a phone.
 *
 * From 768px up the armillary sits behind the hero copy, off to the right
 * where there is room for it (see HeroVisual). A phone has no such room: the
 * same picture laid behind the text put planet discs under the heading and
 * the paragraph, and they could not be tapped anyway, since the clickable
 * WebGL scene never loads on a phone. So below `md` the armillary is its own
 * block in the page, under the buttons, with nothing on top of it — and its
 * planets are tappable, opening the same card the desktop scene opens.
 *
 * It is the server-rendered SVG, not WebGL: no 3D engine is downloaded on a
 * phone for this.
 */
export function HeroArmillaryMobile() {
  const [selected, setSelected] = useState<string | null>(null);
  const card = useRef<HTMLDivElement>(null);

  // The card opens below the armillary, which can be below the fold on a short
  // phone: bring it into view so the tap visibly did something.
  useEffect(() => {
    if (selected) card.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  const select = (name: string) => {
    setSelected(name);
    track('cta_click', { cta: 'hero_graha_tap', location: 'hero_armillary', product: 'astrology' });
  };

  return (
    <div className="mt-12 md:hidden">
      <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-astro-rule bg-astro-night/60 px-4 py-1.5 text-[12.5px] font-semibold tracking-[0.04em] text-astro-gold">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-astro-gold"
          style={{ animation: 'aroha-twinkle 2.4s ease-in-out infinite' }}
        />
        Tap any planet to see what it governs
      </p>
      <CelestialSvg
        className="mx-auto mt-2 block h-auto w-[min(88vw,380px)]"
        onSelect={select}
        selected={selected}
        // The discs are drawn for a 900px armillary; at phone size they need to be
        // nearer twice that to read as planets and to be worth aiming a thumb at.
        planetScale={1.9}
      />
      <div ref={card} className="scroll-mb-6">
        {selected && <GrahaCard name={selected} onClose={() => setSelected(null)} className="mt-2" />}
      </div>
    </div>
  );
}
