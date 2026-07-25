import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { LINKS } from '@/lib/links';

// Single source of truth for the FAQ copy — rendered into the accordion below
// and used to generate the matching FAQPage JSON-LD, so the two can never
// drift out of sync.
const faqItems: AccordionItem[] = [
  {
    question: 'What is a Vedic birth chart (Kundli)?',
    answer:
      'A Kundli is a map of where the sun, moon and planets sat in the sky at the exact moment and place you were born, laid out according to Vedic (Jyotish) astrology. Aroha computes yours from your birth date, time and place and uses it as the basis for every reading.',
  },
  {
    question: "How is this different from the astrology I'm used to?",
    answer:
      'Most Western media astrology (the sun-sign horoscopes in newspapers) uses the tropical zodiac, which is fixed to the calendar seasons. Vedic astrology uses the sidereal zodiac, which tracks the actual visible constellations. Both are internally consistent systems — they just measure against different reference points, so a chart computed the Vedic way can place your planets in a different sign than a tropical chart would.',
  },
  {
    question: 'Is my birth data kept private?',
    answer: `Yes. Your birth details are used to compute your chart and are handled according to our privacy policy — see ${LINKS.privacy} for the full details on what's stored and how.`,
  },
  {
    question: 'Is it really free?',
    answer:
      'Generating your birth chart and using the free Moon-sign tool cost nothing. Some deeper reports and features run on a credit system, which is shown clearly before you use them.',
  },
  {
    question: 'What languages does it support?',
    answer: 'Aroha currently supports 13 languages, so you can read your chart and chat with the AI astrologer in the language you think in.',
  },
  {
    question: "Does this work if I wasn't born in India?",
    answer:
      'Yes. The underlying calculation, the Swiss Ephemeris, works for any birth location worldwide — it needs only your birth date, time and place, wherever that was.',
  },
  {
    question: 'Do I need to know my exact birth time?',
    answer:
      "Ideally, yes, to the minute. The Moon moves fast enough that even a 15-20 minute error can shift your Nakshatra, and a bigger error can move your Ascendant into a different sign entirely. If you're not sure, your birth certificate or hospital records usually have it.",
  },
  {
    question: 'What is a rising sign (Lagna / Ascendant)?',
    answer:
      "Your rising sign is whichever zodiac sign was crossing the eastern horizon at your exact moment of birth. In Vedic astrology it's called your Lagna, and it sets the entire house structure of your chart — where your career, relationships and health placements fall are all measured from it.",
  },
  {
    question: 'What is a Nakshatra?',
    answer:
      "A Nakshatra is one of 27 lunar mansions the Moon's path is divided into, each spanning 13°20' of the zodiac. It gives a more precise reading than your Moon sign alone, and traditionally factors into naming conventions and marriage compatibility (Guna Milan).",
  },
  {
    question: 'Can I check compatibility with a partner?',
    answer:
      "Yes — Aroha includes Ashtakoota (Guna Milan) style compatibility matching, comparing two birth charts to see how key placements align, once you're in the app.",
  },
  {
    question: "How accurate is the AI astrologer's interpretation?",
    answer:
      "The chart itself — planet positions, houses, dashas — is computed by the Swiss Ephemeris, the same precision engine observatories use, so that part is astronomically exact. The AI's job is only to explain what that data traditionally means in plain language; like any astrological reading, it's a tool for reflection, not a scientific prediction.",
  },
];

export function FAQSection() {
  return (
    <Section tone="paper" id="faq">
      <SectionHeading eyebrow="Questions" title="Before you start" />

      {/* 840px per the redesign spec (was max-w-2xl/672px) — gives the
          longer answers more room per line. */}
      <div className="mx-auto mt-12 max-w-[840px]">
        <Accordion items={faqItems} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />
    </Section>
  );
}
