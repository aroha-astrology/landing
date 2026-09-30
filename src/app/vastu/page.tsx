import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ProductHero } from '@/components/product/ProductHero';
import { GuidesStrip } from '@/components/product/GuidesStrip';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { AppCTA } from '@/components/ui/AppCTA';
import { AppShot, VASTU_INTERIORS_SHOTS } from '@/components/ui/AppShot';
import { FeatureVideo, FEATURE_VIDEOS } from '@/components/ui/PromoVideo';
import { FAQSection } from '@/components/landing/FAQSection';
import { VastuCompass, FloorPlan } from '@/components/blog/Diagrams';
import { VastuGlyph } from '@/components/home/Glyphs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PRODUCTS, WEBSITE_ID, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/vastu`;
const TITLE = 'Aroha Vastu (Coming Soon): Floor-Plan Vastu & 3D Home Views';
const DESCRIPTION =
  'Aroha Vastu is coming soon: floor-plan Vastu analysis, room-by-room guidance and 3D views of your home. An early Vastu planner is in the app today.';

export const metadata: Metadata = pageMetadata({ absoluteTitle: true, title: TITLE, description: DESCRIPTION, path: '/vastu' });

const PLANNED = [
  { k: 'Floor-plan analysis', v: 'Your plan read zone by zone against the eight directions and the Brahmasthan at its centre.' },
  { k: 'Room-by-room guidance', v: 'Entrance, kitchen, bedrooms, pooja room and living spaces, each with what traditional Vastu suggests and why.' },
  { k: '3D visualisation', v: 'See your home as a space, not just a drawing, before you change anything in it.' },
  { k: 'Homes and versions', v: 'Save your homes and compare layouts over time, so a change is a considered choice.' },
];

const STEPS = [
  { k: 'Draw your plan', v: 'Lay out your rooms, doors and windows.' },
  { k: 'Set north', v: 'Orient the plan to true direction; everything in Vastu is read from it.' },
  { k: 'Read each zone', v: 'See how your rooms sit in the eight directions and the centre.' },
  { k: 'Explore in 3D', v: 'Walk through the result and compare versions.' },
];

const FAQS = [
  { question: 'What is Aroha Vastu?', answer: PRODUCTS.vastu.summary },
  {
    question: 'When will Aroha Vastu launch?',
    answer: 'Aroha Vastu is in development and we have not announced a launch date. This page will say clearly when it opens.',
  },
  {
    question: 'Can I use any Vastu tools today?',
    answer:
      'Yes. An early Vastu planner is available inside the Aroha Astrology app on Android: you can draw a 2D floor plan and check it against the eight directions while the full Aroha Vastu product is being built.',
  },
  {
    question: 'Is Vastu Shastra scientifically proven?',
    answer:
      'No. Vastu Shastra is a traditional Indian system of architecture and spatial design, described in texts such as the Mayamata and Manasara. Some of its guidance overlaps with practical design (light, ventilation, circulation), but its effects on wellbeing or prosperity are traditional beliefs, not established science. Aroha Vastu presents it that way.',
  },
  {
    question: 'Will Aroha Vastu tell me to rebuild my home?',
    answer:
      'Aroha Vastu is being designed to help you understand your space and make considered choices. Much traditional Vastu guidance concerns how rooms are used and arranged, and structural changes are a decision for you and a qualified architect or engineer.',
  },
];

export default function VastuPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': productBrandId('vastu') },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      breadcrumbNode(PAGE_URL, [{ name: 'Aroha Vastu', url: PAGE_URL }]),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductHero
        product={PRODUCTS.vastu}
        title="From the cosmos to your space"
        lead="Aroha Vastu is being built to read the home you live in through Vastu Shastra: its directions, rooms and centre. It will analyse your floor plan, guide you room by room and show you the result in 3D."
        visual={<VastuGlyph className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[110%] w-auto -translate-y-1/2 text-vastu-clay opacity-[0.12]" />}
      >
        <TrackedLink
          href="/blog/vastu"
          cta="vastu_page_guides"
          location="vastu_hero"
          product="vastu"
          className="inline-flex items-center gap-2 rounded-full bg-vastu-ink px-7 py-3.5 text-[15px] font-semibold text-vastu-sand transition-colors hover:bg-vastu-clay"
        >
          Read the Vastu guides <span aria-hidden>→</span>
        </TrackedLink>
        <span className="text-sm text-vastu-ink-2">Not yet available. No launch date announced.</span>
      </ProductHero>

      <section aria-labelledby="what-vastu" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="j-eyebrow text-[13px]">The tradition</p>
            <h2 id="what-vastu" className="font-display mt-3 text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
              What Vastu Shastra is, and what it isn’t
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Vastu Shastra is a traditional Indian system of architecture and spatial design. Its classical texts describe how a building
              should be oriented, how its plan relates to the eight directions, and why its centre, the Brahmasthan, should stay open.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Some of that guidance lines up with good practical design, like morning light from the east and heavier mass to the
              south-west. Its effects on wellbeing and prosperity are traditional beliefs rather than science, and practitioners interpret
              the texts differently. Aroha Vastu will say which is which.
            </p>
          </div>
          <div className="reveal" style={{ ['--reveal-i' as string]: 1 }}>
            <VastuCompass highlight={['NE', 'C']} />
          </div>
        </div>
      </section>

      <section aria-labelledby="planned" className="bg-vastu-sand px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)] text-vastu-ink">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-vastu-clay">In development</p>
          <h2 id="planned" className="font-display mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            What Aroha Vastu is being built to do
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-vastu-ink/15 bg-vastu-ink/15 md:grid-cols-2 lg:grid-cols-4">
            {PLANNED.map((p, i) => (
              <li key={p.k} className="reveal bg-vastu-sand px-7 py-8" style={{ ['--reveal-i' as string]: i }}>
                <span className="font-display text-sm italic text-vastu-clay">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display mt-3 text-[22px]">{p.k}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-vastu-ink-2">{p.v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-16">
            <h3 className="font-display text-2xl">Early screens</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-vastu-ink-2">
              From the Aroha Vastu build in progress. Features and scores may change before launch.
            </p>
            <div className="mt-8 grid items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.9fr]">
              <AppShot shot={VASTU_INTERIORS_SHOTS.floorPlan3d} tone="sand" sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw" className="reveal mx-auto w-full max-w-[300px]" />
              <AppShot shot={VASTU_INTERIORS_SHOTS.bedScore} tone="sand" sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw" className="reveal mx-auto w-full max-w-[300px]" />
              <AppShot shot={VASTU_INTERIORS_SHOTS.livingRoom3d} tone="sand" sizes="(min-width: 1024px) 480px, 90vw" className="reveal sm:col-span-2 lg:col-span-1" />
            </div>
          </div>
          <ol className="mt-16 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.k} className="reveal border-t border-vastu-ink/25 pt-5" style={{ ['--reveal-i' as string]: i }}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-vastu-clay">Step {i + 1}</p>
                <p className="font-display mt-2 text-xl">{s.k}</p>
                <p className="mt-1.5 text-[15px] text-vastu-ink-2">{s.v}</p>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-16 max-w-[820px]">
            <FloorPlan grid caption="How a floor plan is read in Vastu: a 3 × 3 grid over the plan, north at the top, gives the eight directional zones and the centre. Illustrative layout." />
          </div>
        </div>
      </section>

      <section aria-labelledby="today" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(56px,7vw,96px)]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 rounded-[28px] border border-rule bg-paper-raised p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="j-eyebrow text-[13px]">Available today</p>
            <h2 id="today" className="font-display mt-3 text-3xl font-medium sm:text-4xl">
              Vastu Studio, inside the Aroha Astrology app
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              While Aroha Vastu is being built, an early Vastu planner already ships in the Aroha Astrology app on Android: draw your home in
              2D, check it against the eight directions and save your layouts. Each room is scored by where it sits: in the film, a
              kitchen moved from the north to the south-east, the traditional fire corner, goes from 70 to 88.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-6 sm:flex-row lg:flex-col">
            <FeatureVideo video={FEATURE_VIDEOS.vastuPlanner} className="w-full max-w-[240px]" />
            <AppCTA variant="solid" location="vastu_today">
              Try Vastu Studio
            </AppCTA>
          </div>
        </div>
      </section>

      <GuidesStrip category="vastu" title="Vastu guides for real homes" />
      <FAQSection id="vastu-faq" eyebrow="Questions" title="About Aroha Vastu" items={FAQS} />
    </>
  );
}
