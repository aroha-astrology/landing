import type { Metadata } from 'next';
import { DEFAULT_ROBOTS } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { ArticleCard, toSummary } from '@/components/blog/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { MIN_INDEXABLE_TAG_POSTS, getAllTags, getPostsByTag } from '@/lib/blog';
import { WEBSITE_ID, breadcrumbNode } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

type PageProps = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) return {};

  return {
    title: `${tag}: Articles`,
    description: `Aroha Knowledge Hub articles about ${tag}: ${posts.length} article${posts.length === 1 ? '' : 's'}.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
    // Small tag archives are thin pages: keep them as navigation for
    // readers, but out of the index (and out of sitemap.ts).
    robots: posts.length < MIN_INDEXABLE_TAG_POSTS ? { index: false, follow: true } : DEFAULT_ROBOTS,
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
        name: `${tag}: Aroha Knowledge Hub`,
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      breadcrumbNode(pageUrl, [
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: tag, url: pageUrl },
      ]),
    ],
  };

  return (
    <div className="bg-paper px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)] pt-8 text-ink">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-[1180px]">
        <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: `Tagged: ${tag}` }]} />
        <header className="mt-10 max-w-3xl">
          <p className="j-eyebrow text-[13px]">Tagged</p>
          <h1 className="font-display mt-3 text-[clamp(36px,5vw,56px)] font-medium leading-[1.08]">{tag}</h1>
          <p className="mt-4 text-lg text-ink-2">
            {posts.length} article{posts.length === 1 ? '' : 's'} on this topic.
          </p>
        </header>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <ArticleCard article={toSummary(p)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
