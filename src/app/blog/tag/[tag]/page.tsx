import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import { SITE_URL } from '@/lib/links';

type PageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) return {};

  return {
    title: `${tag} — Vedic Astrology Guides`,
    description: `Aroha Astrology guides tagged "${tag}" — ${posts.length} article${posts.length === 1 ? '' : 's'}.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const pageUrl = `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${tag} — Vedic Astrology Guides`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: tag, item: pageUrl },
        ],
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
      <p className="text-sm">
        <Link href="/blog" className="text-accent hover:underline">
          ← All guides
        </Link>
      </p>
      <SectionHeading
        as="h1"
        eyebrow="Tagged"
        title={tag}
        subtitle={`${posts.length} guide${posts.length === 1 ? '' : 's'} on this topic.`}
        align="left"
        className="mt-6"
      />

      <div className="mt-14 flex flex-col divide-y divide-rule">
        {posts.map((post) => (
          <article key={post.slug} className="flex gap-6 py-8 first:pt-0">
            {post.frontmatter.hero && (
              <Link
                href={`/blog/${post.slug}`}
                className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-rule bg-paper-sunk sm:block"
              >
                <Image
                  src={post.frontmatter.hero}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                />
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="font-display text-2xl font-medium text-ink transition-colors group-hover:text-accent sm:text-3xl">
                  {post.frontmatter.title}
                </h2>
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">
                <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
                <span aria-hidden>·</span>
                <span data-no-translate>{post.readingTime} min read</span>
              </div>
              <p className="mt-3 max-w-2xl text-base text-ink-2">{post.frontmatter.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
