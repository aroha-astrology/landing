import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Section } from '@/components/ui/Section';
import { getAllSlugs, getPost } from '@/lib/blog';

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

  const { title, description, date, tags } = post.frontmatter;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    author: { '@type': 'Organization', name: 'Aroha Astrology' },
  };

  return (
    <Section tone="paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <time
            dateTime={date}
            className="block text-sm font-medium uppercase tracking-[0.1em] text-ink-muted"
          >
            {formatDate(date)}
          </time>
          <h1 className="font-display mt-3 text-3xl font-medium leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-ink-2">{description}</p>
          {tags?.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-accent"
                >
                  {tag}
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
          <MDXRemote source={post.content} />
        </div>
      </article>
    </Section>
  );
}
