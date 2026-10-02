import Link from 'next/link';
import { HeroVisual } from '@/components/three/HeroVisual';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { BRAND, PRODUCTS, PRODUCT_ORDER } from '@/lib/brand';
import { PLAY_STORE_URL } from '@/lib/links';

/**
 * The front door. The H1 and copy are plain server HTML and the LCP
 * element; the celestial visual sits behind them (SVG first, WebGL later on
 * capable devices). The product status list states, in text, what exists
 * today — nothing about Aroha depends on the 3D scene being rendered.
 */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-astro-night text-astro-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 700px at 72% 45%, rgba(46,62,130,0.55), transparent 60%), radial-gradient(900px 600px at 10% 110%, rgba(212,166,78,0.12), transparent 60%), linear-gradient(180deg, #0B1020 0%, #0E1530 100%)',
        }}
      />
      <HeroVisual />

      {/* Clicks fall through the empty parts of this layer to the planets behind it. */}
      <div className="pointer-events-none relative mx-auto flex min-h-[min(860px,calc(100svh-64px))] max-w-[1280px] items-center px-[clamp(20px,4vw,56px)] pb-20 pt-[clamp(72px,12vh,140px)]">
        <div className="max-w-[760px] [&>*]:pointer-events-auto">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.22em] text-astro-gold">Aroha · Astrology · Vastu · Puja</p>
          <h1 id="hero-title" className="font-display mt-6 text-[clamp(44px,6.6vw,88px)] font-medium leading-[1] tracking-[-0.015em]">
            Ancient wisdom.
            <br />
            <em className="font-normal text-astro-gold">Modern guidance.</em>
          </h1>
          <p className="mt-7 max-w-[540px] text-[clamp(17px,1.5vw,20px)] leading-relaxed text-astro-ink-2">
            Explore your birth chart, understand your space and discover meaningful spiritual guidance through the Aroha ecosystem, built on
            the traditions of India and designed for how you live now.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <TrackedLink
              href="/astrology"
              cta="hero_explore_astrology"
              location="hero"
              product="astrology"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-astro-gold px-7 py-3.5 text-[15px] font-semibold text-astro-night transition-colors hover:bg-[#E6BD68]"
            >
              Explore Aroha Astrology <span aria-hidden>→</span>
            </TrackedLink>
            <TrackedLink
              href="#ecosystem"
              cta="hero_discover_ecosystem"
              location="hero"
              className="inline-flex items-center justify-center rounded-full border border-astro-rule px-7 py-3.5 text-[15px] font-semibold text-astro-ink transition-colors hover:border-astro-gold hover:text-astro-gold"
            >
              Discover the ecosystem
            </TrackedLink>
          </div>

          <ul aria-label="The Aroha ecosystem" className="mt-14 grid max-w-[560px] gap-3 border-t border-astro-rule pt-7 sm:grid-cols-3">
            {PRODUCT_ORDER.map((k) => {
              const p = PRODUCTS[k];
              return (
                <li key={k} className="flex flex-col gap-2">
                  <Link href={p.path} className="self-start text-sm font-semibold text-astro-ink underline-offset-4 hover:text-astro-gold hover:underline">
                    {p.name}
                  </Link>
                  <StatusBadge status={p.status} tone="dark" className="self-start" />
                  {k === 'astrology' ? (
                    // The app's two stores, right where its status is stated.
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]" data-no-translate>
                      <TrackedLink
                        href={PLAY_STORE_URL}
                        cta="hero_store_android"
                        location="hero_status"
                        product="astrology"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-astro-gold underline underline-offset-4 hover:text-[#E6BD68]"
                      >
                        Android<span className="sr-only"> (opens Google Play)</span>
                      </TrackedLink>
                      <span className="text-astro-ink-2">iOS · coming soon</span>
                    </div>
                  ) : (
                    p.note && <span className="text-[12.5px] text-astro-ink-2">{p.note}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="sr-only">{BRAND.description}</p>
        </div>
      </div>
    </section>
  );
}
