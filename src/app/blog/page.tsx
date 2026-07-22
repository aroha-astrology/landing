import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllPosts } from '@/lib/blog';

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

  return (
    <Section tone="paper">
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
