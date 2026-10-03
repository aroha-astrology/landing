import { TrackedLink } from '@/components/ui/TrackedLink';
import { StatusBadge } from '@/components/product/StatusBadge';
import { FeatureVideo, FEATURE_VIDEOS } from '@/components/ui/PromoVideo';
import { AppShot, VASTU_INTERIORS_SHOTS } from '@/components/ui/AppShot';
import { PRODUCTS } from '@/lib/brand';

/**
 * Aroha Vastu preview. Two real screens, each labelled with its status: the
 * Vastu planner film is what ships in the Aroha Astrology app today; the 3D
 * plan beside it is the 3D version, coming soon.
 */
export function VastuPreview() {
  const p = PRODUCTS.vastu;
  return (
    <section id="vastu-preview" aria-labelledby="vastu-title" className="scroll-mt-20 overflow-hidden bg-vastu-sand px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)] text-vastu-ink">
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="reveal">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-vastu-clay">{p.name}</p>
            <StatusBadge status={p.status} />
          </div>
          <h2 id="vastu-title" className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] text-balance">
            Check your home against Vastu
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-vastu-ink-2">
            Vastu Shastra is India’s traditional system of architecture and spatial design: how a home’s directions, centre and rooms are arranged. Aroha Vastu reads
            your own floor plan through that lens, room by room, with a score for each. A 3D version is coming soon.
          </p>
          <ul className="mt-8 space-y-3">
            {p.capabilities.map((c) => (
              <li key={c} className="flex gap-3 text-[15.5px]">
                <span aria-hidden className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-vastu-clay" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-xl rounded-2xl border border-vastu-ink/15 bg-[#F4EDDF] px-5 py-4 text-[14.5px] leading-relaxed text-vastu-ink-2">
            {`Where to get it: ${p.where} Coming soon: your home in 3D, with a walk-through view and furniture placement scored against Vastu.`}
          </p>
          <TrackedLink
            href="/vastu"
            cta="vastu_preview"
            location="vastu_preview"
            product="vastu"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-vastu-ink px-6 py-3 text-sm font-semibold text-vastu-sand transition-colors hover:bg-vastu-clay"
          >
            Discover Aroha Vastu <span aria-hidden>→</span>
          </TrackedLink>
        </div>

        <div className="reveal mx-auto grid w-full max-w-[560px] grid-cols-2 items-start gap-5 sm:gap-8" style={{ ['--reveal-i' as string]: 1 }}>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-vastu-clay">In the app today</p>
            <FeatureVideo video={FEATURE_VIDEOS.vastuPlanner} tone="sand" />
          </div>
          <div className="mt-16 sm:mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-vastu-ink-2">3D · coming soon</p>
            <AppShot shot={VASTU_INTERIORS_SHOTS.floorPlan3d} tone="sand" sizes="(min-width: 1024px) 260px, 45vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
