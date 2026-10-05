import { NextResponse } from 'next/server';
import { getAllSlugs } from '@/lib/blog';
import { getTranslatedPost, translatedLangs, translatedSlugs } from '@/lib/blog-i18n';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLangs().map((lang) => ({ lang }));
}

/** Title and description of every translated article, for the blog listings and cards. */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const visible = new Set(getAllSlugs());
  const out: Record<string, { title: string; description: string }> = {};
  for (const slug of translatedSlugs(lang)) {
    if (!visible.has(slug)) continue;
    const p = getTranslatedPost(lang, slug);
    if (p) out[slug] = { title: p.frontmatter.title, description: p.frontmatter.description };
  }
  return NextResponse.json(out, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
