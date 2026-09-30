import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { LINKS } from '@/lib/links';
import { JsonLd } from '@/components/seo/JsonLd';

// Single source of truth for the homepage FAQ copy — rendered into the
// accordion below and used to generate the matching FAQPage JSON-LD, so the
// two can never drift out of sync. Other pages (e.g. /panchang, /kundli)
// pass their own `items` instead of this default.
const homeFaqItems: AccordionItem[] = [
  {
    question: 'What is Aroha?',
    answer:
      'Aroha is an Indian spiritual-technology ecosystem with three products: Aroha Astrology for Vedic astrology, which is available now; Aroha Vastu for understanding the harmony of your home through Vastu Shastra, which is coming soon; and Aroha Puja for booking a pandit to perform pujas at home, which is also coming soon.',
  },
  {
    question: 'What can I do with Aroha Astrology today?',
    answer:
      'Generate your free Janam Kundli (Lagna, Rashi, Nakshatra and all nine planets), follow your Vimshottari Dasha, check yogas and doshas, match two Kundlis with Guna Milan, read the daily Panchang and horoscope, ask the Vedic Astrologer chat about your own chart, and unlock personalised reports. It is on Android now; iOS is coming soon.',
  },
  {
    question: 'When will Aroha Vastu and Aroha Puja launch?',
    answer:
      'Both are in development and we have not announced launch dates. This site will say clearly when each one opens. Meanwhile, an early Vastu planner is available inside the Aroha Astrology app.',
  },
  {
    question: 'How will Aroha Puja work?',
    answer:
      'Aroha Puja is being built as a premium service for booking a pandit to perform any puja at your home. You will be able to choose whether the pandit brings all the samagri or your family arranges the items, and the price will reflect that choice. Bookings are not open yet.',
  },
  {
    question: 'Is astrology or Vastu scientifically proven?',
    answer:
      'No. Vedic astrology is a traditional system of interpretation and Vastu Shastra is a traditional system of architecture and spatial design; neither has been established by scientific evidence. Aroha presents them as traditions to reflect with, and never as a substitute for medical, legal or financial advice.',
  },
  {
    question: 'Is my birth chart really free?',
    answer:
      'Yes. Your birth chart, daily Panchang, horoscope, the Moon-sign tool, 36-point Guna Milan compatibility check, shlokas library and the Bhagavad Gita cost nothing. Deeper reports and chat run on a simple credit system, shown clearly before you use them, and every report gives you a free preview first.',
  },
  {
    question: 'How accurate are the charts?',
    answer:
      "Planet positions, houses and Dasha periods are computed with the Swiss Ephemeris and the Lahiri ayanamsa, so the chart itself is astronomically exact for the birth details you give. Interpretation is a different matter: the Vedic Astrologer's job is to explain what those positions traditionally mean, as a tool for reflection rather than a prediction.",
  },
  {
    question: 'Do I need my exact birth time?',
    answer:
      "Ideally, yes. The Moon moves fast enough that a 15 to 20 minute error can shift your Nakshatra, and a larger one can move your Ascendant into a different sign. If you're unsure, your birth certificate or hospital record usually has it, and the app can help narrow down an unknown time from major life events.",
  },
  {
    question: 'Which languages does Aroha support?',
    answer: 'Aroha Astrology supports 7 Indian languages, so you can read your chart and chat with the Vedic Astrologer in the language you think in.',
  },
  {
    question: 'Is my birth data kept private?',
    answer: `Your birth details are used to compute your chart and are handled according to our privacy policy at ${LINKS.privacy}, which sets out what is stored and how.`,
  },
];

export function FAQSection({
  id = 'faq',
  eyebrow = 'Questions',
  title = 'Before you start',
  items = homeFaqItems,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  items?: AccordionItem[];
} = {}) {
  return (
    <Section tone="paper" id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} />

      {/* 840px per the redesign spec (was max-w-2xl/672px) — gives the
          longer answers more room per line. */}
      <div className="mx-auto mt-12 max-w-[840px]">
        <Accordion items={items} />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
    </Section>
  );
}
