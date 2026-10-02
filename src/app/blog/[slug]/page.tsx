import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { CategoryChip } from '@/components/blog/CategoryChip';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArticleCard, toSummary } from '@/components/blog/ArticleCard';
import { ProductPanel } from '@/components/blog/ProductPanel';
import { ArticleScrollTracker } from '@/components/blog/ArticleScrollTracker';
import { ArticleFinalCta } from '@/components/blog/ArticleFinalCta';
import { Accordion } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { bodyHasFaq, formatDate, getAllSlugs, getPost, getRelatedPosts, renderableContent, type BlogPost } from '@/lib/blog';
import { CATEGORIES } from '@/lib/categories';
import { ORG_ID, WEBSITE_ID, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Posts without an explicit `author` are the pre-ecosystem astrology posts,
// which carry the site's content-advisor byline (see layout.tsx's
// #author-yogi-baba node). New articles set `author: "Aroha Editorial Team"`.
const LEGACY_AUTHOR = 'Yogi Baba';
const TEAM_AUTHOR = 'Aroha Editorial Team';

export const dynamicParams = false;

// Articles are our own reviewed files, so plain JS expressions in MDX props
// (e.g. <Checklist items={[...]} />) are allowed; blockDangerousJS still
// strips eval/Function-style constructs.
const MDX_OPTIONS = { blockJS: false, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

function load(slug: string): BlogPost | null {
  try {
    return getPost(slug);
  } catch {
    return null;
  }
}

function authorOf(post: BlogPost) {
  return post.frontmatter.author ?? LEGACY_AUTHOR;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = load(slug);
  if (!post) return {};
  const { title, seoTitle, description, date, updated, tags } = post.frontmatter;
  return {
    title: seoTitle ?? title,
    description,
    keywords: tags,
    alternates: { canonical: `/blog/${slug}` },
    robots: post.status === 'review' ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${slug}`,
      publishedTime: date,
      modifiedTime: updated ?? date,
      section: CATEGORIES[post.category].name,
      tags,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = load(slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const category = CATEGORIES[post.category];
  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const categoryUrl = `${SITE_URL}/blog/${post.category}`;
  const related = getRelatedPosts(post, 4);
  const author = authorOf(post);
  const showFaq = (fm.faqs?.length ?? 0) > 0 && !bodyHasFaq(post);
  const heroUrl = post.hero ? `${SITE_URL}${post.hero}` : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: fm.title,
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        primaryImageOfPage: heroUrl ? { '@id': `${pageUrl}#image` } : undefined,
        ...(fm.reviewedBy ? { reviewedBy: { '@type': 'Person', name: fm.reviewedBy }, lastReviewed: fm.reviewedAt } : {}),
        inLanguage: 'en',
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: fm.title,
        description: fm.description,
        image: heroUrl ? { '@type': 'ImageObject', '@id': `${pageUrl}#image`, url: heroUrl, width: 1600, height: 900, caption: fm.heroAlt } : undefined,
        datePublished: fm.date,
        dateModified: fm.updated ?? fm.date,
        author:
          author === LEGACY_AUTHOR
            ? { '@id': `${SITE_URL}/#author-yogi-baba` }
            : author === TEAM_AUTHOR
              ? { '@type': 'Organization', name: TEAM_AUTHOR, url: `${SITE_URL}/editorial-standards`, parentOrganization: { '@id': ORG_ID } }
              : { '@type': 'Person', name: author },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        isPartOf: { '@id': `${categoryUrl}#webpage` },
        articleSection: category.name,
        about: { '@id': productBrandId(post.category) },
        keywords: fm.tags?.join(', '),
        wordCount: post.content.split(/\s+/).length,
        isAccessibleForFree: true,
        inLanguage: 'en',
      },
      breadcrumbNode(pageUrl, [
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: category.name, url: categoryUrl },
        { name: fm.title, url: pageUrl },
      ]),
      ...(fm.faqs?.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${pageUrl}#faq`,
              mainEntity: fm.faqs.map((f) => ({
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
    <div className="bg-paper px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)] pt-8 text-ink">
      <JsonLd data={jsonLd} />
      <ArticleScrollTracker slug={slug} category={post.category} targetId="article-body" />

      <div className="mx-auto max-w-[1180px]">
        <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: category.name, href: `/blog/${post.category}` }, { name: fm.title }]} />

        {post.status === 'review' && (
          <p role="status" className="mt-6 rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm text-ink">
            <strong>In editorial review.</strong> This article is visible on preview builds only and is not indexed. See the review checklist in <Link href="/editorial-standards" className="underline">Editorial standards</Link>.
          </p>
        )}

        <article className="mt-8">
          <header className="mx-auto max-w-[760px]">
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              <Link href={`/blog/${post.category}`} aria-label={`More ${category.name} articles`}>
                <CategoryChip category={post.category} />
              </Link>
              <span data-no-translate>{post.readingTime} min read</span>
            </div>
            <h1 className="font-display mt-5 text-[clamp(34px,5vw,54px)] font-medium leading-[1.08] text-balance">{fm.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2 sm:text-xl">{fm.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule pt-5 text-sm text-ink-muted">
              <span>
                By <span className="font-semibold text-ink">{author}</span>
              </span>
              <span>
                Published <time dateTime={fm.date}>{formatDate(fm.date)}</time>
              </span>
              {fm.updated && (
                <span>
                  Updated <time dateTime={fm.updated}>{formatDate(fm.updated)}</time>
                </span>
              )}
              {fm.reviewedBy && <span>Reviewed by {fm.reviewedBy}</span>}
            </div>
          </header>

          {post.hero && (
            <figure className="mx-auto mt-10 max-w-[1080px]">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-rule bg-night">
                {/* Many heroes carry small lettering, which the default quality (75) smears. */}
                <Image src={post.hero} alt={fm.heroAlt ?? ''} fill priority quality={90} sizes="(min-width: 1180px) 1080px, 100vw" className="object-cover" />
              </div>
            </figure>
          )}

          <div className="mx-auto mt-12 grid max-w-[1080px] gap-10 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-[60px]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <TableOfContents headings={post.headings} />
            </div>
            <div className="min-w-0">
              <div id="article-body" className="article-body">
                <MDXRemote source={renderableContent(post)} components={mdxComponents} options={MDX_OPTIONS} />
              </div>

              {showFaq && (
                <section aria-labelledby="faq" className="mt-16">
                  <h2 id="faq" className="font-display text-[clamp(26px,3vw,32px)] font-medium">Common questions</h2>
                  <div className="mt-4">
                    <Accordion items={fm.faqs!} />
                  </div>
                </section>
              )}

              {fm.sources && fm.sources.length > 0 && (
                <section aria-labelledby="sources" className="mt-14 border-t border-rule pt-8">
                  <h2 id="sources" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Sources and further reading</h2>
                  <ul className="mt-4 space-y-2 text-sm text-ink-2">
                    {fm.sources.map((s) => (
                      <li key={s.title}>
                        {s.url ? (
                          <a href={s.url} className="text-link underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                            {s.title}
                          </a>
                        ) : (
                          <span className="italic">{s.title}</span>
                        )}
                        {s.note && <span className="text-ink-muted"> — {s.note}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {fm.tags?.length > 0 && (
                <nav aria-label="Topics" className="mt-12 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Topics</span>
                  {fm.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="rounded-pill bg-paper-sunk px-3 py-1 text-xs font-medium text-ink-2 transition-colors hover:bg-accent-soft hover:text-ink"
                    >
                      {tag}
                    </Link>
                  ))}
                </nav>
              )}

              <p className="mt-8 border-t border-rule pt-6 text-sm leading-relaxed text-ink-muted">
                {author === LEGACY_AUTHOR ? (
                  <>Written and reviewed by <span className="font-semibold text-ink">{LEGACY_AUTHOR}</span>, Vedic Astrology Content Advisor at Aroha. </>
                ) : author === TEAM_AUTHOR ? (
                  <>Written by the <span className="font-semibold text-ink">{TEAM_AUTHOR}</span>. </>
                ) : (
                  <>Written by <span className="font-semibold text-ink">{author}</span>. </>
                )}
                {category.framing.split('. ')[0]}. Read how we research and review articles in our{' '}
                <Link href="/editorial-standards" className="text-link underline underline-offset-4">
                  editorial standards
                </Link>
                .
              </p>

              <div className="mt-12">
                <ProductPanel category={post.category} features={fm.features} slug={slug} />
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mx-auto mt-20 max-w-[1080px] border-t border-rule pt-12">
            <h2 id="related" className="font-display text-3xl font-medium">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ArticleCard key={p.slug} article={toSummary(p)} />
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto mt-20 max-w-[1080px]">
          <ArticleFinalCta category={post.category} />
        </div>
      </div>
    </div>
  );
}
