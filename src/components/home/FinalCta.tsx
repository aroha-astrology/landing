import { AppCTA } from '@/components/ui/AppCTA';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { BRAND } from '@/lib/brand';
import { CelestialSvg } from '@/components/three/CelestialSvg';

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden bg-astro-night px-[clamp(20px,4vw,56px)] py-[clamp(88px,11vw,160px)] text-center text-astro-ink">
      <CelestialSvg className="absolute left-1/2 top-1/2 -z-10 h-[140%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-30" />
      <div className="reveal mx-auto max-w-3xl">
        <p className="text-[12.5px] font-bold uppercase tracking-[0.22em] text-astro-gold">{BRAND.tagline}</p>
        <h2 id="final-title" className="font-display mt-5 text-[clamp(40px,6.4vw,84px)] font-medium leading-[1]">
          {BRAND.promise}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-astro-ink-2">
          Begin where Aroha began: with your own birth chart. Vastu and puja will join you along the way.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <TrackedLink
            href="/astrology"
            cta="final_explore_astrology"
            location="final_cta"
            product="astrology"
            className="inline-flex items-center gap-2 rounded-full bg-astro-gold px-7 py-3.5 text-[15px] font-semibold text-astro-night transition-colors hover:bg-[#E6BD68]"
          >
            Explore Aroha Astrology <span aria-hidden>→</span>
          </TrackedLink>
          <AppCTA variant="outline" location="final_cta" className="!border-astro-rule !text-astro-ink hover:!border-astro-gold hover:!text-astro-gold">
            Get the app
          </AppCTA>
        </div>
      </div>
    </section>
  );
}
