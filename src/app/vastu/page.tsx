import type { Metadata } from 'next';
import { AppCTA } from '@/components/ui/AppCTA';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PhoneShot } from '@/components/ui/PhoneShot';
import { FAQSection } from '@/components/landing/FAQSection';
import { PLAY_STORE_URL, SITE_URL } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Vastu Studio — Check Your Home’s Vastu Online, Room by Room',
  description:
    'Draw your floor plan, point it north and get a live Vastu score for every room. See why a room is rated the way it is, where it would sit better, and a personalised Vastu report — in the Aroha app.',
  alternates: { canonical: '/vastu' },
  openGraph: {
    title: 'Aroha Vastu Studio — your home’s Vastu, room by room',
    description:
      'Draw your floor plan, point it north and see every room’s Vastu direction and rating as you go.',
    url: '/vastu',
    images: [{ url: '/vastu/studio-2d.webp', width: 560, height: 1014, alt: 'Aroha Vastu Studio floor plan with a live Vastu score' }],
  },
};

/**
 * What the studio does, in the order someone meets it. Each row is one real
 * screenshot from the app (public/vastu) and a short, plain explanation —
 * the copy stays honest about what is a traditional guideline and what is
 * the app's own rule set, the same way the blog does.
 */
const STEPS = [
  {
    eyebrow: 'Start',
    title: 'Draw your home, or start from a template',
    body: 'Start from an empty plot, a ready-made 1, 2 or 3 BHK, a demo home, or trace over a photo of your existing floor plan. Drag rooms into place, resize them, and add doors and windows on any wall. Your photo stays on your phone and is never uploaded.',
    src: '/vastu/start.webp',
    alt: 'Vastu Studio start screen: draw my home, explore a demo, trace a floor plan photo, or start from a 1, 2 or 3 BHK template',
  },
  {
    eyebrow: 'Live score',
    title: 'Every room gets a direction and a rating as you draw',
    body: 'Point the plan north with your phone’s compass or by hand, and each room is placed in one of the eight directions around the centre (the Brahmasthan). The Aroha Vastu score updates with every move, and you can tap it to see exactly what counts towards it.',
    src: '/vastu/studio-2d.webp',
    alt: 'A floor plan on an 8-direction compass with living room in the North-West, puja room in the North-East and kitchen in the South-East, scored 78',
  },
  {
    eyebrow: 'Vastu Lens',
    title: 'See where a room belongs before you move it',
    body: 'Switch on the Vastu Lens and tap a room: the directions that suit it glow green and the ones to avoid turn red. It turns a table of rules into something you can see at a glance on your own plan.',
    src: '/vastu/vastu-lens.webp',
    alt: 'Vastu Lens colouring the plan green where a bathroom belongs and red where it should be avoided',
  },
  {
    eyebrow: 'Why?',
    title: 'Every rating comes with its reason',
    body: 'Tap “Why?” on any room for the traditional reasoning behind its rating, the best direction for it, other acceptable ones, and which to avoid. Where traditions differ, the app says so rather than pretending there is one answer.',
    src: '/vastu/why-this-rating.webp',
    alt: 'Explanation for a bathroom in the East: rated Correction Advised, best in the North-West, also fine in West and North',
  },
  {
    eyebrow: 'Fix this',
    title: 'One tap to preview a better spot',
    body: '“Fix this” finds the free spaces on your plot where the room would score better, shows a ghost of it there, and tells you how the overall score would change. Keep it or undo it — nothing moves until you say so.',
    src: '/vastu/fix-this.webp',
    alt: 'A suggested move for the bathroom from East to West, previewed as a dashed outline, raising the score from 78 to 86',
  },
  {
    eyebrow: 'Fix my plan',
    title: 'Improve the whole home, step by step',
    body: '“Fix my plan” looks at every room together and proposes a short list of moves in order. Preview them all at once, apply them one at a time, or skip any you would rather keep — your home, your call.',
    src: '/vastu/fix-my-plan.webp',
    alt: 'Fix my plan listing three improvements — master bed, bathroom and kitchen — taking the score from 48 to 92',
  },
  {
    eyebrow: '3D',
    title: 'Walk round your home in 3D',
    body: 'See the same plan as a 3D model with walls, doors and furniture. Turn on Vastu colours to see each room’s rating in place, or switch to a top view. It runs on your phone — no download, no extra app.',
    src: '/vastu/3d-vastu.webp',
    alt: 'A 3D model of the home with each room tinted by its Vastu rating and labelled with its direction',
  },
  {
    eyebrow: 'Advanced',
    title: '16 zones and the Vastu Purusha Mandala',
    body: 'For those who want to go deeper, overlay the finer 16-zone compass or the 81-pada (9×9) Vastu Purusha Mandala grid aligned to true north, with the Brahmasthan marked at the centre.',
    src: '/vastu/16-zones.webp',
    alt: 'The floor plan with a 16-zone Vastu compass overlay',
  },
  {
    eyebrow: 'Report',
    title: 'A personalised Vastu report for your home',
    body: 'When you want the full picture, get a written report for your floor plan: what matters most, room-by-room guidance, simple non-structural remedies, element balance, best directions for sleeping, working and cooking — and how the home suits your own birth chart. The price is shown before you pay, and you can ask follow-up questions.',
    src: '/vastu/report-rooms.webp',
    alt: 'A Vastu report showing room-by-room guidance for bathroom, kitchen and master bedroom',
  },
];

const faqItems = [
  {
    question: 'What is Aroha Vastu Studio?',
    answer:
      'Vastu Studio is a floor-plan tool inside the Aroha Astrology app. You draw or trace your home, set which way is north, and it shows each room’s direction and a Vastu rating as you go, with a reason for every rating, suggested better positions, a whole-home “Fix my plan”, a 3D view and an optional personalised Vastu report.',
  },
  {
    question: 'Is it free?',
    answer:
      'Drawing your home, the live Vastu score, the Vastu Lens, “Why?” explanations, “Fix this”, “Fix my plan”, saving homes and versions are all free. The written, personalised Vastu report is a paid, one-time report per floor plan, and the price is always shown before you confirm.',
  },
  {
    question: 'Do I need an architect’s drawing?',
    answer:
      'No. A rough plan is enough — the score depends on which direction each room sits in, not on exact measurements. You can start from a 1, 2 or 3 BHK template and adjust it, or put a photo of your plan underneath and trace over it.',
  },
  {
    question: 'How do I find north for my home?',
    answer:
      'Open the North tool and use your phone’s compass while standing inside the home, then lock the reading. If your phone has no compass, turn the plan by hand to match a map. Getting north right matters more than anything else, because every room’s direction is measured from it.',
  },
  {
    question: 'Which Vastu rules does it use?',
    answer:
      'A single, named rule set (aroha-traditional-v1) drawn from widely followed traditional Vastu Shastra guidance — for example, kitchen in the South-East, master bedroom in the South-West, puja room in the North-East. Different traditions sometimes disagree; the app names its rule set and notes where others differ rather than presenting one view as universal.',
  },
  {
    question: 'Do I have to rebuild my home if a room is in the “wrong” direction?',
    answer:
      'No. Most guidance is about how a room is used — what goes where, what is kept clear, light and airy. The report focuses on simple, non-structural remedies first, and marks structural changes as optional, for when you next renovate.',
  },
  {
    question: 'Is my floor plan private?',
    answer:
      'Your saved homes belong to your account and are visible only to you. If you trace over a photo, that photo stays on your device and is never uploaded.',
  },
  {
    question: 'Is a Vastu score a prediction?',
    answer:
      'No. The score shows how closely your layout follows the app’s traditional Vastu rule set. It is a guide for reflection and planning, not a measurement of your home or a prediction of outcomes.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Aroha Vastu Studio',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Android, Web',
      url: `${SITE_URL}/vastu`,
      description:
        'Draw your floor plan, set north and get a live Vastu rating for every room, with explanations, suggested fixes, a 3D view and a personalised Vastu report.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', url: PLAY_STORE_URL },
      featureList: [
        'Floor plan editor with 1, 2 and 3 BHK templates',
        'Trace over a photo of your floor plan',
        'Compass-based north alignment',
        'Live Vastu score for every room',
        'Vastu Lens: where each room belongs',
        'Why? explanation for every rating',
        'Fix this and Fix my plan suggestions',
        '3D home view with Vastu colours',
        '16-zone compass and 9×9 Vastu Purusha Mandala overlays',
        'Saved homes and version history',
        'Personalised Vastu report with remedies',
      ],
      screenshot: STEPS.map((s) => `${SITE_URL}${s.src}`),
      inLanguage: ['en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu'],
    },
    {
      '@type': 'HowTo',
      name: 'How to check the Vastu of your home with Aroha Vastu Studio',
      step: [
        { '@type': 'HowToStep', name: 'Draw your home', text: 'Start from a template, a blank plot or a photo of your floor plan, and place your rooms.' },
        { '@type': 'HowToStep', name: 'Set north', text: 'Use your phone’s compass inside the home, or turn the plan by hand to match a map.' },
        { '@type': 'HowToStep', name: 'Read the ratings', text: 'Each room shows its direction and Vastu rating; tap Why? for the reasoning.' },
        { '@type': 'HowToStep', name: 'Try the fixes', text: 'Use Fix this or Fix my plan to preview better positions before changing anything.' },
        { '@type': 'HowToStep', name: 'Get your report', text: 'Optionally, get a personalised written Vastu report with simple remedies.' },
      ],
    },
  ],
};

export default function VastuPage() {
  return (
    <>
      <main>
        <Section tone="paper" className="overflow-hidden">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Aroha Vastu Studio"
                title="Your home’s Vastu, room by room"
                subtitle="Draw your floor plan, point it north, and see every room’s direction and Vastu rating as you go — with the reason behind each one and a better spot to try. Free to use in the Aroha app."
              />
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <AppCTA variant="solid">Try Vastu Studio free</AppCTA>
                <a href="#how-it-works" className="text-sm font-medium text-link hover:text-accent">
                  See how it works ↓
                </a>
              </div>
              <ul className="mt-8 grid gap-2 text-sm text-ink-2 sm:grid-cols-2">
                <li>✓ Live score for every room</li>
                <li>✓ “Why?” for every rating</li>
                <li>✓ Fix this &amp; Fix my plan</li>
                <li>✓ 3D view of your home</li>
                <li>✓ 16 zones &amp; 9×9 Mandala</li>
                <li>✓ In 7 Indian languages</li>
              </ul>
            </div>
            <div className="relative mx-auto flex w-full max-w-[440px] justify-center gap-4">
              <PhoneShot
                src="/vastu/studio-2d.webp"
                alt="Aroha Vastu Studio: a home on the 8-direction compass scored 78"
                priority
                className="w-[58%] rotate-[-3deg]"
              />
              <PhoneShot
                src="/vastu/3d-view.webp"
                alt="The same home as a 3D model"
                className="mt-14 w-[52%] rotate-[3deg]"
              />
            </div>
          </div>
        </Section>

        <Section tone="sunk" id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="From a rough sketch to a clear plan"
            subtitle="Nine screens from the app, in the order you would use them."
          />
          <ol className="mt-14 space-y-20">
            {STEPS.map((step, i) => (
              <li
                key={step.src}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="mx-auto w-[68vw] max-w-[300px]">
                  <PhoneShot src={step.src} alt={step.alt} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {String(i + 1).padStart(2, '0')} · {step.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="space-y-5 text-ink-2">
            <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
              What Vastu Shastra looks at in a home
            </h2>
            <p>
              Vastu Shastra is the traditional Indian science of architecture
              and space. At its heart is a simple idea: a home is divided into
              eight directions around a calm centre, the{' '}
              <strong>Brahmasthan</strong>, and each direction is associated
              with an element and a kind of activity. The North-East
              (Ishanya) is kept light and open for prayer and study; the
              South-East (Agneya) belongs to fire, so it suits the kitchen; the
              South-West (Nairutya) is heavy and stable, so it suits the master
              bedroom; the North-West (Vayavya) is airy, suiting guest rooms
              and bathrooms.
            </p>
            <p>
              Checking a home by hand means holding a table of these rules in
              your head while squinting at a plan. Vastu Studio does that part
              for you: once your plan is pointed north, every room is placed
              in its direction automatically, rated against a single, named
              traditional rule set, and explained in plain language. For the
              full room-by-room guide, read{' '}
              <a href="/blog/vastu-for-home-room-directions" className="text-link hover:text-accent">
                Vastu for your home: the right direction for every room
              </a>
              .
            </p>
            <p className="text-sm text-ink-muted">
              Vastu guidance is traditional, and traditions differ on the
              details. Aroha’s score shows how closely a layout follows its
              stated rule set — it is a guide, not a guarantee of outcomes.
            </p>
          </div>
        </section>

        <FAQSection id="vastu-faq" eyebrow="Questions" title="About Vastu Studio" items={faqItems} />

        <Section tone="night">
          <SectionHeading
            dark
            eyebrow="Get started"
            title="Check your home’s Vastu today"
            subtitle="Vastu Studio is part of the free Aroha Astrology app, alongside your Kundli, daily Panchang and personalised reports."
          />
          <div className="mt-8">
            <AppCTA>Get the App</AppCTA>
          </div>
        </Section>
      </main>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
