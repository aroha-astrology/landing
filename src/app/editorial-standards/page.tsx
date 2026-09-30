import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ProsePage } from '@/components/content/ProsePage';
import { Checklist } from '@/components/blog/Diagrams';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND, ORG_ID, WEBSITE_ID, breadcrumbNode } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/editorial-standards`;

export const metadata: Metadata = pageMetadata({
  title: 'Editorial Standards',
  description:
    'How the Aroha Knowledge Hub researches, reviews and corrects articles on astrology, Vastu and puja, and how we describe beliefs and use AI.',
  path: '/editorial-standards',
});

const REVIEW = [
  'Factual accuracy: names, dates, calculations and classical references checked against sources.',
  'Traditional belief is worded as belief (“traditionally”, “in many traditions”), never as scientific fact.',
  'No medical, financial, legal or fear-based claims, and no promises of outcomes.',
  'Cultural sensitivity: regional and community variation acknowledged; no tradition presented as the only correct one.',
  'One clear search intent, answered in the opening, with no duplication of an existing article.',
  'Readability: plain language, defined terms, useful structure; no padding.',
  'Internal links to the pillar, 3–5 related articles and the relevant Aroha product.',
  'Images are original, properly licensed or AI-generated illustrations, with accurate alt text. Illustrations never stand in for a real event, person or product screen.',
];

export default function EditorialStandardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Editorial standards',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      breadcrumbNode(PAGE_URL, [{ name: 'Editorial standards', url: PAGE_URL }]),
    ],
  };
  return (
    <ProsePage
      crumb="Editorial standards"
      eyebrow="Knowledge Hub"
      title="Editorial standards"
      lead="How we research, write, review and correct the articles in the Aroha Knowledge Hub, and how we write about practices many people hold sacred."
    >
      <JsonLd data={jsonLd} />

      <h2>What we publish</h2>
      <p>
        The <Link href="/blog">Knowledge Hub</Link> explains Vedic astrology, Vastu Shastra and puja: what the traditions say, how their
        concepts work and where practitioners disagree. Each article is written to answer one question well. We don’t publish articles to
        fill a keyword list, and we don’t publish two articles that answer the same question.
      </p>

      <h2>How we describe beliefs</h2>
      <p>
        Vedic astrology, Vastu and puja are traditions of interpretation and practice, not established science. We describe what classical
        texts and living traditions hold, clearly marked as such, and we separate that from what is empirically known. Where a Vastu
        guideline also makes practical sense (morning light, ventilation), we say so without claiming the tradition has been proven.
      </p>
      <p>
        We never tell readers that a placement, a direction or a missed ritual will cause harm, and we never present a remedy or a puja as
        a guaranteed outcome. Nothing we publish is medical, financial or legal advice.
      </p>

      <h2>Sources</h2>
      <p>
        We work from classical texts where they apply, such as the <em>Brihat Parashara Hora Shastra</em> and <em>Brihat Jataka</em> for
        astrology, the <em>Mayamata</em> and <em>Manasara</em> for Vastu, and the Grihya Sutras and Puranic traditions for ritual, alongside
        reputable scholarship and practitioners. We name sources where a specific claim depends on them. We don’t copy or paraphrase other
        websites.
      </p>

      <h2>Authors, AI assistance and human review</h2>
      <p>
        New articles are published by the Aroha Editorial Team. Some are drafted with AI assistance. Every article is reviewed by a person
        before it is published, and articles awaiting review are kept out of search engines and site listings. The older astrology guides
        carry the byline of Yogi Baba, our Vedic Astrology Content Advisor.
      </p>
      <Checklist title="The review checklist every article passes" items={REVIEW} />

      <h2>Images</h2>
      <p>
        Article illustrations are original Aroha artwork, drawn in code from the subject of each article (a Nakshatra ring for a Nakshatra
        guide, a floor plan for a Vastu guide). We don’t use images we lack the rights to. Diagrams inside articles are real text, so they
        work with screen readers.
      </p>

      <h2>Updates and corrections</h2>
      <p>
        Every article shows when it was published and, if it has been materially revised, when it was updated. If you find an error, write
        to <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> and we will correct it and update the date.
      </p>
    </ProsePage>
  );
}
