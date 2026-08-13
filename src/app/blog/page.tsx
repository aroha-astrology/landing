import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/blog`;

export const metadata: Metadata = {
  title: 'Blog — Aroha Astrology',
  description:
    'Guides to Vedic astrology — Moon signs, Rashi, Nakshatras, Vimshottari Dasha and more, explained clearly and accurately.',
  alternates: { canonical: '/blog' },
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Vedic Astrology Blog — Aroha Astrology',
        description:
          'Guides to Vedic astrology — Moon signs, Rashi, Nakshatras, Vimshottari Dasha and more, explained clearly and accurately.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: PAGE_URL },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${PAGE_URL}#itemlist`,
        itemListElement: posts.map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/blog/${post.slug}`,
          name: post.frontmatter.title,
        })),
      },
    ],
  };

  return (
    <Section tone="paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Blog"
        title="Vedic astrology, explained clearly"
        subtitle="Guides to Moon signs, Rashi, Nakshatras and the timing systems behind your birth chart."
        align="left"
      />

      <div className="mt-14 flex flex-col divide-y divide-rule">
        {posts.map((post) => (
          <article key={post.slug} className="py-8 first:pt-0">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="font-display text-2xl font-medium text-ink transition-colors group-hover:text-accent sm:text-3xl">
                {post.frontmatter.title}
              </h2>
            </Link>
            <time
              dateTime={post.frontmatter.date}
              className="mt-2 block text-sm font-medium uppercase tracking-[0.1em] text-ink-muted"
            >
              {formatDate(post.frontmatter.date)}
            </time>
            <p className="mt-3 max-w-2xl text-base text-ink-2">{post.frontmatter.description}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
