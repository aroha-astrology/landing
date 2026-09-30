import { AppCTA } from '@/components/ui/AppCTA';
import { TrackedLink } from '@/components/ui/TrackedLink';
import type { CategoryKey } from '@/lib/categories';

const COPY: Record<CategoryKey, { eyebrow: string; title: string; body: string; href: string; cta: string; tone: string }> = {
  astrology: {
    eyebrow: 'Aroha Astrology',
    title: 'See it in your own chart',
    body: 'Theory makes more sense against your own placements. Generate your free Kundli on the web, or open the app for your Dasha timeline and chart-grounded answers.',
    href: '/kundli',
    cta: 'Generate your free Kundli',
    tone: 'bg-astro-night text-astro-ink',
  },
  vastu: {
    eyebrow: 'Aroha Vastu · Coming soon',
    title: 'From reading about Vastu to seeing your own home',
    body: 'Aroha Vastu will read your floor plan direction by direction and show it in 3D. Until then, an early Vastu planner is available in the Aroha Astrology app.',
    href: '/vastu',
    cta: 'Discover Aroha Vastu',
    tone: 'bg-vastu-ink text-vastu-sand',
  },
  puja: {
    eyebrow: 'Aroha Puja · Coming soon',
    title: 'A puja at home, done properly',
    body: 'Aroha Puja will let you book a pandit for any puja at home, with the samagri included or arranged by your family. It is not open for bookings yet.',
    href: '/puja',
    cta: 'Discover Aroha Puja',
    tone: 'bg-puja-ink text-puja-ivory',
  },
};

/** Calm closing CTA, one per product. No urgency language, no fake scarcity. */
export function ArticleFinalCta({ category }: { category: CategoryKey }) {
  const c = COPY[category];
  return (
    <section className={`overflow-hidden rounded-3xl px-7 py-10 sm:px-12 sm:py-14 ${c.tone}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">{c.eyebrow}</p>
      <h2 className="font-display mt-3 max-w-2xl text-3xl font-medium leading-tight sm:text-4xl">{c.title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-85">{c.body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <TrackedLink
          href={c.href}
          cta={`article_final_${category}`}
          location="article_final_cta"
          product={category}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
        >
          {c.cta}
        </TrackedLink>
        {category === 'astrology' && (
          <AppCTA variant="outline" className="!border-current !text-current">
            Get the app
          </AppCTA>
        )}
      </div>
    </section>
  );
}
