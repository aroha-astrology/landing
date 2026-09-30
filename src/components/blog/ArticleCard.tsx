import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';
import { CategoryChip } from './CategoryChip';

/** Serializable subset of a post — what listings and the client-side filter need. */
export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: BlogPost['category'];
  hero: string | null;
  heroAlt?: string;
  readingTime: number;
  date: string;
  isPillar: boolean;
  status: BlogPost['status'];
  tags: string[];
};

export function toSummary(post: BlogPost): ArticleSummary {
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    category: post.category,
    hero: post.hero,
    heroAlt: post.frontmatter.heroAlt,
    readingTime: post.readingTime,
    date: post.frontmatter.date,
    isPillar: post.isPillar,
    status: post.status,
    tags: post.frontmatter.tags ?? [],
  };
}

type Variant = 'default' | 'feature' | 'compact';

/**
 * One article teaser. The whole card is a single link (title is the
 * accessible name); the image is decorative here because the title and
 * excerpt already describe the article — its real alt text lives on the
 * article page.
 */
export function ArticleCard({
  article,
  variant = 'default',
  headingLevel = 'h3',
  tone = 'paper',
}: {
  article: ArticleSummary;
  variant?: Variant;
  headingLevel?: 'h2' | 'h3';
  tone?: 'paper' | 'dark';
}) {
  const Heading = headingLevel;
  const dark = tone === 'dark';
  const feature = variant === 'feature';
  const compact = variant === 'compact';
  return (
    <article className={`group relative flex h-full ${compact ? 'flex-row gap-4' : 'flex-col'}`}>
      {article.hero && (
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border ${dark ? 'border-night-rule' : 'border-rule'} bg-night ${
            compact ? 'aspect-square w-24' : feature ? 'aspect-[16/9] w-full' : 'aspect-[16/10] w-full'
          }`}
        >
          <Image
            src={article.hero}
            alt=""
            fill
            sizes={compact ? '96px' : feature ? '(min-width: 1024px) 720px, 100vw' : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className={`flex min-w-0 flex-1 flex-col ${compact ? '' : 'pt-5'}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryChip category={article.category} />
          {article.isPillar && !compact && (
            <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${dark ? 'text-night-ink-2' : 'text-ink-muted'}`}>Start here</span>
          )}
          <span className={`text-xs ${dark ? 'text-night-ink-2' : 'text-ink-muted'}`} data-no-translate>
            {article.readingTime} min read
          </span>
          {article.status === 'review' && <span className="rounded-pill border border-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-text">In review</span>}
        </div>
        <Heading
          className={`font-display mt-2.5 leading-snug text-balance ${dark ? 'text-night-ink' : 'text-ink'} ${
            feature ? 'text-2xl sm:text-3xl' : compact ? 'text-base' : 'text-xl'
          }`}
        >
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline decoration-1 underline-offset-4">
            {article.title}
          </Link>
        </Heading>
        {!compact && (
          <p className={`mt-2.5 line-clamp-3 text-[15px] leading-relaxed ${dark ? 'text-night-ink-2' : 'text-ink-2'}`}>{article.description}</p>
        )}
      </div>
    </article>
  );
}
