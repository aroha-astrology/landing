import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from './Breadcrumbs';
import { ArticleCard, toSummary } from './ArticleCard';
import { ArticleFinalCta } from './ArticleFinalCta';
import { StatusBadge } from '@/components/product/StatusBadge';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllSlugs, getPostsByCategory } from '@/lib/blog';
import { CATEGORIES, type CategoryKey } from '@/lib/categories';
import { PRODUCTS, WEBSITE_ID, breadcrumbNode, productBrandId } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';

/**
 * A hub below this many visible articles is too thin to be a landing page:
 * it still renders (the nav links to it) but asks not to be indexed.
 */
const MIN_INDEXABLE = 3;

/**
 * Optional photographic cover behind the hub header. The overlay fades from
 * the header's own colour on the left (where the text sits) to the photo on
 * the right, so text contrast never depends on the image.
 */
const COVER: Partial<Record<CategoryKey, { src: string; overlay: string }>> = {
  astrology: {
    src: '/assets/blog/covers/astrology.webp',
    overlay: 'bg-gradient-to-r from-astro-night via-astro-night/90 to-astro-night/30 max-md:via-astro-night/85 max-md:to-astro-night/75',
  },
  puja: {
    src: '/assets/blog/covers/puja.webp',
    overlay: 'bg-gradient-to-r from-puja-ivory-2 via-puja-ivory-2/95 to-puja-ivory-2/20 max-md:via-puja-ivory-2/92 max-md:to-puja-ivory-2/85',
  },
  vastu: {
    src: '/assets/blog/covers/vastu.webp',
    // The artwork is busy line work, so the text half stays solid and it only shows on the right.
    overlay: 'bg-gradient-to-r from-vastu-sand from-45% via-vastu-sand/90 via-60% to-vastu-sand/15 max-md:via-vastu-sand/95 max-md:to-vastu-sand/90',
  },
};

const HERO: Record<CategoryKey, string> = {
  astrology: 'bg-astro-night text-astro-ink',
  vastu: 'bg-vastu-sand text-vastu-ink',
  puja: 'bg-puja-ivory-2 text-puja-ink',
};

export function categoryMetadata(category: CategoryKey): Metadata {
  const cat = CATEGORIES[category];
  const published = getPostsByCategory(category).filter((p) => p.status === 'published').length;
  const title = `${cat.name} Articles: ${cat.title}`;
  return pageMetadata({
    title,
    description: cat.description,
    path: `/blog/${category}`,
    robots: published < MIN_INDEXABLE ? { index: false, follow: true } : undefined,
  });
}

export function CategoryHub({ category }: { category: CategoryKey }) {
  const cat = CATEGORIES[category];
  const product = PRODUCTS[category];
  const posts = getPostsByCategory(category);
  const pillar = posts.find((p) => p.isPillar);
  const rest = posts.filter((p) => !p.isPillar);
  const visible = new Set(getAllSlugs());
  const topics = cat.topics.filter((t) => visible.has(t.slug));
  const pageUrl = `${SITE_URL}/blog/${category}`;
  const dark = category === 'astrology';
  const cover = COVER[category];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${cat.name} articles — Aroha Knowledge Hub`,
        description: cat.description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': productBrandId(category) },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: posts
            .filter((p) => p.status === 'published')
            .map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/blog/${p.slug}`, name: p.frontmatter.title })),
        },
      },
      breadcrumbNode(pageUrl, [
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: cat.name, url: pageUrl },
      ]),
    ],
  };

  return (
    <div className="bg-paper text-ink">
      <JsonLd data={jsonLd} />
      <section className={`relative overflow-hidden px-[clamp(20px,4vw,56px)] pb-16 pt-8 ${HERO[category]}`}>
        {cover && (
          <>
            <Image src={cover.src} alt="" fill priority sizes="100vw" className="object-cover object-right" />
            <div aria-hidden className={`absolute inset-0 ${cover.overlay}`} />
          </>
        )}
        <div className="relative mx-auto max-w-[1180px]">
          <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: cat.name }]} tone={dark ? 'dark' : 'paper'} />
          <div className="mt-12 max-w-3xl">
            <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-astro-gold' : category === 'vastu' ? 'text-vastu-clay' : 'text-puja-saffron'}`}>
              Knowledge Hub · {cat.name}
            </p>
            <h1 className="font-display mt-3 text-[clamp(38px,5.5vw,64px)] font-medium leading-[1.05] text-balance">{cat.title}</h1>
            <p className="mt-6 text-lg leading-relaxed opacity-90">{cat.description}</p>
            <p className="mt-4 text-base leading-relaxed opacity-75">{cat.framing}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <StatusBadge status={product.status} tone={dark ? 'dark' : 'paper'} />
              <Link href={product.path} className="text-sm font-semibold underline underline-offset-4">
                About {product.name} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,56px)] pb-[clamp(64px,8vw,112px)]">
        {topics.length > 0 && (
          <nav aria-label={`Popular ${cat.name} topics`} className="mt-12 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Popular topics</span>
            {topics.map((t) => (
              <Link key={t.slug} href={`/blog/${t.slug}`} className="rounded-pill border border-rule-strong px-4 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">
                {t.label}
              </Link>
            ))}
          </nav>
        )}

        {pillar && (
          <section aria-labelledby="pillar" className="mt-14">
            <h2 id="pillar" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Start here
            </h2>
            <div className="mt-6 max-w-3xl">
              <ArticleCard article={toSummary(pillar)} variant="feature" />
            </div>
          </section>
        )}

        {posts.length === 0 ? (
          <p className="mt-16 max-w-2xl text-ink-2">
            Our first {cat.name} guides are in editorial review and will appear here once published. Meanwhile, read about{' '}
            <Link href={product.path} className="text-link underline">
              {product.name}
            </Link>
            .
          </p>
        ) : (
          <section aria-labelledby="latest" className="mt-20">
            <h2 id="latest" className="font-display text-3xl font-medium sm:text-4xl">
              All {cat.name} articles
            </h2>
            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p.slug}>
                  <ArticleCard article={toSummary(p)} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-20">
          <ArticleFinalCta category={category} />
        </div>
      </div>
    </div>
  );
}
