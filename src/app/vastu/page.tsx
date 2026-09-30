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
const TITLE = 'Aroha Vastu: Check Your Floor Plan Room by Room';
const DESCRIPTION =
  'Aroha Vastu is available on Android: draw your floor plan, see every room judged by its direction with a Vastu score, and ask about your layout. 3D is coming soon.';

export const metadata: Metadata = pageMetadata({ absoluteTitle: true, title: TITLE, description: DESCRIPTION, path: '/vastu' });

const product = PRODUCTS.vastu;

const STEPS = [
  { k: 'Draw your plan', v: 'Lay out your home room by room: kitchen, bedrooms, pooja room, entrance.' },
  { k: 'Set north', v: 'Orient the plan to true direction; everything in Vastu is read from it.' },
  { k: 'Read each room', v: 'See the zone every room falls in, its score and what the tradition says about it.' },
  { k: 'Adjust and compare', v: 'Move a room and watch the score change, then save the layout.' },
];

const FAQS = [
  { question: 'What is Aroha Vastu?', answer: product.summary },
  {
    question: 'Where can I use Aroha Vastu?',
    answer:
      'Aroha Vastu is available now on Android, inside the Aroha Astrology app. An iOS version of the app is coming soon.',
  },
  {
    question: 'When is the 3D version coming?',
    answer:
      'A 3D version, with a walk-through of your home and furniture placement scored against Vastu, is in development. We have not announced a date; this page will say clearly when it opens.',
  },
  {
    question: 'Is Vastu Shastra scientifically proven?',
    answer:
      'No. Vastu Shastra is a traditional Indian system of architecture and spatial design, described in texts such as the Mayamata and Manasara. Some of its guidance overlaps with practical design (light, ventilation, circulation), but its effects on wellbeing or prosperity are traditional beliefs, not established science. Aroha Vastu presents it that way.',
  },
  {
    question: 'Will Aroha Vastu tell me to rebuild my home?',
    answer:
      'Aroha Vastu is designed to help you understand your space and make considered choices. Much traditional Vastu guidance concerns how rooms are used and arranged, and structural changes are a decision for you and a qualified architect or engineer.',
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
        product={product}
        title="From the cosmos to your space"
        lead="Aroha Vastu reads the home you live in through Vastu Shastra. Draw your floor plan, see every room judged by its direction, and get a Vastu score for your home, room by room."
        visual={<VastuGlyph className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[110%] w-auto -translate-y-1/2 text-vastu-clay opacity-[0.12]" />}
      >
        <AppCTA variant="solid" location="vastu_hero" className="!bg-vastu-ink !px-7 !py-3.5 !text-[15px] !text-vastu-sand hover:!bg-vastu-clay">
          Try Aroha Vastu
        </AppCTA>
        <TrackedLink
          href="/blog/vastu"
          cta="vastu_page_guides"
          location="vastu_hero"
          product="vastu"
          className="inline-flex items-center gap-2 rounded-full border border-vastu-ink/30 px-7 py-3.5 text-[15px] font-semibold text-vastu-ink transition-colors hover:border-vastu-clay hover:text-vastu-clay"
        >
          Read the Vastu guides <span aria-hidden>→</span>
        </TrackedLink>
      </ProductHero>

      <section aria-labelledby="today" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
          <div className="reveal">
            <p className="j-eyebrow text-[13px]">Available now</p>
            <h2 id="today" className="font-display mt-3 text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
              Your floor plan, room by room
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              {product.where} Draw your home and every room is judged by where it sits. In the film, a kitchen moved from the north to the
              south-east, the traditional fire corner, goes from 70 to 88.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.capabilities.map((c) => (
                <li key={c} className="flex gap-3 text-[15.5px] text-ink-2">
                  <span aria-hidden className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-vastu-clay" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <AppCTA variant="solid" location="vastu_today">
                Get Aroha Vastu
              </AppCTA>
            </div>
          </div>
          <FeatureVideo video={FEATURE_VIDEOS.vastuPlanner} className="reveal mx-auto w-full max-w-[280px]" />
        </div>
      </section>

      <section aria-labelledby="what-vastu" className="bg-paper-sunk px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
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
              the texts differently. Aroha Vastu says which is which.
            </p>
          </div>
          <div className="reveal" style={{ ['--reveal-i' as string]: 1 }}>
            <VastuCompass highlight={['NE', 'C']} />
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
        <div className="mx-auto max-w-[1180px]">
          <p className="j-eyebrow text-[13px]">How it works</p>
          <h2 id="how" className="font-display mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            Four steps from a drawing to a reading
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.k} className="reveal border-t border-ink/20 pt-5" style={{ ['--reveal-i' as string]: i }}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-vastu-clay">Step {i + 1}</p>
                <p className="font-display mt-2 text-xl">{s.k}</p>
                <p className="mt-1.5 text-[15px] text-ink-2">{s.v}</p>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-16 max-w-[820px]">
            <FloorPlan grid caption="How a floor plan is read in Vastu: a 3 × 3 grid over the plan, north at the top, gives the eight directional zones and the centre. Illustrative layout." />
          </div>
        </div>
      </section>

      <section aria-labelledby="three-d" className="bg-vastu-sand px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)] text-vastu-ink">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-vastu-clay">Coming soon</p>
          <h2 id="three-d" className="font-display mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            Aroha Vastu in 3D
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-vastu-ink-2">
            The next version of Aroha Vastu shows your home as a space, not just a drawing. It isn’t available yet, and we haven’t announced a
            date.
          </p>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {product.upcoming?.map((u) => (
              <li key={u} className="flex gap-3 text-[15.5px]">
                <span aria-hidden className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-vastu-clay" />
                {u}
              </li>
            ))}
          </ul>
          <div className="mt-12 grid items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.9fr]">
            <AppShot shot={VASTU_INTERIORS_SHOTS.floorPlan3d} tone="sand" sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw" className="reveal mx-auto w-full max-w-[300px]" />
            <AppShot shot={VASTU_INTERIORS_SHOTS.bedScore} tone="sand" sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw" className="reveal mx-auto w-full max-w-[300px]" />
            <AppShot shot={VASTU_INTERIORS_SHOTS.livingRoom3d} tone="sand" sizes="(min-width: 1024px) 480px, 90vw" className="reveal sm:col-span-2 lg:col-span-1" />
          </div>
        </div>
      </section>

      <GuidesStrip category="vastu" title="Vastu guides for real homes" />
      <FAQSection id="vastu-faq" eyebrow="Questions" title="About Aroha Vastu" items={FAQS} />
    </>
  );
}
