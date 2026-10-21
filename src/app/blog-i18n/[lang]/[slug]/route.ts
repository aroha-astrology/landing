import { NextResponse } from 'next/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { staticMdxComponents } from '@/components/blog/StaticMdxComponents';
import { MDX_OPTIONS } from '@/lib/mdx-options';
import { extractHeadings, getAllSlugs, linkableContent } from '@/lib/blog';
import { getTranslatedPost, translatedLangs, translatedSlugs } from '@/lib/blog-i18n';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  const visible = new Set(getAllSlugs());
  return translatedLangs().flatMap((lang) => translatedSlugs(lang).filter((s) => visible.has(s)).map((slug) => ({ lang, slug })));
}

/**
 * A translated article as JSON: { title, description, heroAlt, faqs, headings, html }. The article
 * page fetches this for a visitor whose saved language is not English and swaps it in; English stays
 * the server-rendered default. The body is compiled with the same MDX options and components as the
 * English page, so diagrams, callouts and tables look the same.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = getTranslatedPost(lang, slug);
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const source = linkableContent(post.content);
  const element = await MDXRemote({ source, components: staticMdxComponents, options: MDX_OPTIONS });
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(element);

  return NextResponse.json(
    {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      heroAlt: post.frontmatter.heroAlt ?? '',
      faqs: post.frontmatter.faqs ?? [],
      headings: extractHeadings(source),
      html,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
  );
}
