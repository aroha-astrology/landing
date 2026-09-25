import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Section } from '@/components/ui/Section';
import { AppCTA } from '@/components/ui/AppCTA';
import { PromoVideo, promoVideoForSlug } from '@/components/ui/PromoVideo';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { getAllSlugs, getPost, getRelatedPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/links';

const DEFAULT_AUTHOR = 'Yogi Baba';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
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
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    return {};
  }

  const { title, description, date } = post.frontmatter;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: date,
      url: `/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  const { title, description, date, updated, tags, faqs, hero, heroAlt, author } = post.frontmatter;
  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const relatedPosts = getRelatedPosts(post);
  const promoVideo = promoVideoForSlug(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: title,
        description,
        datePublished: date,
        dateModified: updated ?? date,
        url: pageUrl,
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        isPartOf: { '@id': `${SITE_URL}/blog#webpage` },
        author: { '@id': `${SITE_URL}/#author-yogi-baba` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        keywords: tags?.length ? tags.join(', ') : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
        ],
      },
      ...(faqs?.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${pageUrl}#faq`,
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <Section tone="paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-raised px-5 py-4">
          <p className="text-sm font-medium text-ink-2">
            Want your own chart, not just the theory? Get the free Aroha Astrology app.
          </p>
          <AppCTA variant="outline">Get the App</AppCTA>
        </div>

        <header className="mb-10">
          {hero && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-rule bg-paper-sunk">
              <Image
                src={hero}
                alt={heroAlt ?? ''}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                priority
                className="object-contain p-10"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium uppercase tracking-[0.1em] text-ink-muted">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden>·</span>
            <span data-no-translate>{post.readingTime} min read</span>
            <span aria-hidden>·</span>
            <span>{author ?? DEFAULT_AUTHOR}</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-ink-2">{description}</p>
          {tags?.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="block rounded-pill bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div
          className="
            [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:text-ink
            [&_h3]:font-display [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-ink
            [&_p]:mb-4 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-ink-2
            [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4
            [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-ink-2
            [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-ink-2
            [&_li]:mb-1
            [&_strong]:font-semibold [&_strong]:text-ink
          "
        >
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <footer className="mt-14 border-t border-rule pt-8">
          <p className="text-sm text-ink-muted">
            Written and reviewed by <span className="font-semibold text-ink">{author ?? DEFAULT_AUTHOR}</span>,
            Vedic Astrology Content Advisor at Aroha Astrology.
          </p>
        </footer>

        <aside className="mt-14 flex flex-col items-center gap-8 rounded-2xl border border-rule bg-paper-raised px-6 py-8 sm:flex-row sm:px-8">
          <PromoVideo video={promoVideo} className="max-w-[260px]" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-muted">See it in action</p>
            <h2 className="font-display mt-2 text-2xl font-medium text-ink">Your own chart, read properly</h2>
            <p className="mt-3 text-ink-2">
              Free Vedic Kundli, a Vedic Astrologer chat in 7 Indian languages, and 14 personal reports. Available on
              Android. iOS coming soon.
            </p>
            <div className="mt-5">
              <AppCTA>Get the App</AppCTA>
            </div>
          </div>
        </aside>

        {relatedPosts.length > 0 && (
          <aside className="mt-14 border-t border-rule pt-10">
            <h2 className="font-display text-xl font-medium text-ink">Related guides</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                  {related.frontmatter.hero && (
                    <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-rule bg-paper-sunk">
                      <Image
                        src={related.frontmatter.hero}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-contain p-6"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-base leading-snug text-ink transition-colors group-hover:text-accent">
                    {related.frontmatter.title}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </Section>
  );
}
