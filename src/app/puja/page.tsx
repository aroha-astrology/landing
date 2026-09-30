import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ProductHero } from '@/components/product/ProductHero';
import { GuidesStrip } from '@/components/product/GuidesStrip';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { FAQSection } from '@/components/landing/FAQSection';
import { PujaGlyph } from '@/components/home/Glyphs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PRODUCTS, WEBSITE_ID, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/puja`;
const TITLE = 'Aroha Puja (Coming Soon): Book a Pandit for Puja at Home';
const DESCRIPTION =
  'Aroha Puja is coming soon: book a pandit for any puja at home, with the samagri included or arranged by you, priced for your choice.';

export const metadata: Metadata = pageMetadata({ absoluteTitle: true, title: TITLE, description: DESCRIPTION, path: '/puja' });

const STEPS = [
  { k: 'Choose your puja', v: 'Tell us the occasion or the puja your family wants performed.' },
  { k: 'Choose your samagri', v: 'Have the pandit bring everything, or arrange the items yourselves.' },
  { k: 'See the price for that choice', v: 'The price reflects the option you pick, shown before you book.' },
  { k: 'A pandit comes home', v: 'The puja is performed at your home, where the occasion belongs.' },
];

const OCCASIONS = [
  { group: 'Home', items: ['Griha Pravesh', 'Vastu Shanti', 'Satyanarayan Katha', 'Navagraha Shanti'] },
  { group: 'Life events', items: ['Namkaran (naming)', 'Annaprashan', 'Mundan', 'Milestone birthdays'] },
  { group: 'New beginnings', items: ['Vahan (vehicle) puja', 'Shop or office opening', 'Business beginnings'] },
  { group: 'Festivals', items: ['Ganesh Chaturthi', 'Lakshmi Puja', 'Durga Puja', 'Festival pujas at home'] },
];

const FAQS = [
  { question: 'What is Aroha Puja?', answer: PRODUCTS.puja.summary },
  {
    question: 'Can I book a puja now?',
    answer: 'Not yet. Aroha Puja is in development and bookings are not open. This page will say clearly when they are.',
  },
  {
    question: 'Will the pandit bring the samagri?',
    answer:
      'You will be able to choose. Either the pandit brings all the samagri the puja needs, or your family arranges the items yourselves, and the price will reflect which option you pick.',
  },
  {
    question: 'Which pujas will Aroha Puja cover?',
    answer:
      'The aim is to cover every kind of puja families perform at home, from Griha Pravesh and Satyanarayan Katha to vehicle pujas, business openings and milestone ceremonies. Practices vary by region and community, and your family’s tradition will guide how a puja is performed.',
  },
  {
    question: 'Which cities will Aroha Puja be available in?',
    answer: 'We have not announced launch cities yet.',
  },
];

export default function PujaPage() {
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
        about: { '@id': productBrandId('puja') },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      breadcrumbNode(PAGE_URL, [{ name: 'Aroha Puja', url: PAGE_URL }]),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductHero
        product={PRODUCTS.puja}
        title="Pujas at home, performed properly"
        lead="Aroha Puja will let you book a pandit for any puja at your home, and decide whether the pandit brings all the samagri or your family arranges it. A premium service for the moments that matter, when it opens."
        visual={<PujaGlyph className="pointer-events-none absolute right-[-6%] top-1/2 -z-10 h-[90%] w-auto -translate-y-1/2 text-puja-saffron opacity-[0.14]" />}
      >
        <TrackedLink
          href="/blog/puja"
          cta="puja_page_guides"
          location="puja_hero"
          product="puja"
          className="inline-flex items-center gap-2 rounded-full bg-puja-ink px-7 py-3.5 text-[15px] font-semibold text-puja-ivory transition-colors hover:bg-puja-kumkum"
        >
          Read the puja guides <span aria-hidden>→</span>
        </TrackedLink>
        <span className="text-sm text-puja-ink/70">Bookings are not open yet.</span>
      </ProductHero>

      <section aria-labelledby="how-puja" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
        <div className="mx-auto max-w-[1180px]">
          <p className="j-eyebrow text-[13px]">How it will work</p>
          <h2 id="how-puja" className="font-display mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            Four steps from occasion to puja
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.k} className="reveal rounded-3xl border border-rule bg-paper-raised p-6" style={{ ['--reveal-i' as string]: i }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-puja-saffron font-display text-puja-saffron">{i + 1}</span>
                <h3 className="font-display mt-5 text-xl text-ink">{s.k}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="samagri" className="px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)] text-puja-ink" style={{ background: 'linear-gradient(180deg, #FBF5EA, #F4E8D3)' }}>
        <div className="mx-auto max-w-[1180px]">
          <h2 id="samagri" className="font-display max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            Samagri, the way your family prefers
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-puja-ink/80">
            Every puja needs its items: kalash, flowers, diyas, kumkum, rice, fruit and more. Some families like to arrange them; others would
            rather it was handled. Aroha Puja will offer both.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="reveal rounded-[28px] bg-puja-ink p-8 text-puja-ivory">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-puja-marigold">Option one</p>
              <h3 className="font-display mt-3 text-3xl">Samagri included</h3>
              <p className="mt-3 leading-relaxed opacity-85">The pandit brings everything the puja needs. You prepare the space; the rest arrives with them.</p>
            </div>
            <div className="reveal rounded-[28px] border border-puja-ink/15 bg-puja-ivory p-8" style={{ ['--reveal-i' as string]: 1 }}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-puja-saffron">Option two</p>
              <h3 className="font-display mt-3 text-3xl">Arrange it yourself</h3>
              <p className="mt-3 leading-relaxed text-puja-ink/80">Your family provides the items, following the list for your puja, and the price reflects that.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="occasions" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,112px)]">
        <div className="mx-auto max-w-[1180px]">
          <h2 id="occasions" className="font-display max-w-2xl text-[clamp(30px,4vw,48px)] font-medium leading-[1.08]">
            For every kind of puja
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
            Examples of the occasions Aroha Puja is being built for. Puja traditions vary by region, community and family; yours will guide
            how each is performed.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o) => (
              <div key={o.group} className="reveal">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-puja-saffron">{o.group}</h3>
                <ul className="mt-4 space-y-2.5">
                  {o.items.map((it) => (
                    <li key={it} className="font-display border-b border-rule pb-2.5 text-xl text-ink">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GuidesStrip category="puja" title="Guides to puja and ritual" />
      <FAQSection id="puja-faq" eyebrow="Questions" title="About Aroha Puja" items={FAQS} />
    </>
  );
}
