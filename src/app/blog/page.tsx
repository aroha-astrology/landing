import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { ArticleCard, toSummary } from '@/components/blog/ArticleCard';
import { KnowledgeHubSearch } from '@/components/blog/KnowledgeHubSearch';
import { StatusBadge } from '@/components/product/StatusBadge';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllPosts, getPostsByCategory, getPublishedPosts } from '@/lib/blog';
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/categories';
import { PRODUCTS, WEBSITE_ID, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

const PAGE_URL = `${SITE_URL}/blog`;
const TITLE = 'Knowledge Hub: Vedic Astrology, Vastu and Puja Guides';
const DESCRIPTION =
  'Clear guides to Vedic astrology, Vastu Shastra and Hindu puja, from the Kundli and Nakshatras to room-by-room Vastu and Griha Pravesh.';

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/blog' });

const PANEL: Record<string, string> = {
  astrology: 'bg-astro-night text-astro-ink',
  vastu: 'bg-vastu-sand text-vastu-ink',
  puja: 'bg-puja-ivory-2 text-puja-ink',
};

export default function KnowledgeHubPage() {
  const posts = getAllPosts();
  const pillars = CATEGORY_ORDER.map((c) => posts.find((p) => p.slug === CATEGORIES[c].pillar)).filter((p) => p !== undefined);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Aroha Knowledge Hub',
        description: DESCRIPTION,
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        about: CATEGORY_ORDER.map((c) => ({ '@id': productBrandId(c) })),
        hasPart: CATEGORY_ORDER.map((c) => ({ '@type': 'CollectionPage', '@id': `${SITE_URL}/blog/${c}#webpage`, url: `${SITE_URL}/blog/${c}`, name: `${CATEGORIES[c].name} articles` })),
      },
      breadcrumbNode(PAGE_URL, [{ name: 'Blog', url: PAGE_URL }]),
      {
        '@type': 'ItemList',
        '@id': `${PAGE_URL}#itemlist`,
        itemListElement: getPublishedPosts().map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/blog/${post.slug}`,
          name: post.frontmatter.title,
        })),
      },
    ],
  };

  return (
    <div className="bg-paper px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)] pt-8 text-ink">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-[1180px]">
        <Breadcrumbs items={[{ name: 'Blog' }]} />

        <header className="mt-10 max-w-3xl">
          <p className="j-eyebrow text-[13px]">Knowledge Hub</p>
          <h1 className="font-display mt-3 text-[clamp(40px,6vw,72px)] font-medium leading-[1.04] text-balance">The wisdom behind Aroha</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-2 sm:text-xl">
            Guides to Vedic astrology, Vastu Shastra and Hindu puja: what the traditions say, how their concepts work, and where
            practitioners disagree. Every article is written to answer one question well, in plain language.
          </p>
        </header>

        <section aria-label="Topics" className="mt-14 grid gap-5 md:grid-cols-3">
          {CATEGORY_ORDER.map((c) => {
            const cat = CATEGORIES[c];
            const count = getPostsByCategory(c).length;
            return (
              <Link key={c} href={`/blog/${c}`} className={`group flex flex-col rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 ${PANEL[c]}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-3xl">{cat.name}</h2>
                  <StatusBadge status={PRODUCTS[c].status} tone={c === 'astrology' ? 'dark' : 'paper'} />
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed opacity-85">{cat.description}</p>
                <p className="mt-6 text-sm font-semibold">
                  {count} {count === 1 ? 'article' : 'articles'} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            );
          })}
        </section>

        {pillars.length > 0 && (
          <section aria-labelledby="start-here" className="mt-20">
            <h2 id="start-here" className="font-display text-3xl font-medium sm:text-4xl">
              Start here
            </h2>
            <p className="mt-2 text-ink-2">One foundational guide for each path.</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {pillars.map((p) => (
                <ArticleCard key={p.slug} article={toSummary(p)} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-20">
          <KnowledgeHubSearch articles={posts.map(toSummary)} />
        </div>
      </div>
    </div>
  );
}
