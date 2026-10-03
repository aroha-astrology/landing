import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ImageResponse } from 'next/og';
import { getAllSlugs, getPost } from '@/lib/blog';
import { CATEGORIES } from '@/lib/categories';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Aroha Knowledge Hub article';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// One card per article: the article's own hero art full-bleed, with the
// title set over a dark gradient. The art is converted from WebP to PNG at
// build time because the OG renderer (Satori) doesn't decode WebP.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = 'Aroha Knowledge Hub';
  let eyebrow = 'Aroha · Knowledge Hub';
  let art: string | null = null;
  try {
    const post = getPost(slug);
    title = post.frontmatter.title;
    eyebrow = `Aroha · ${CATEGORIES[post.category].name}`;
    if (post.hero) {
      const file = path.join(process.cwd(), 'public', post.hero);
      if (fs.existsSync(file)) {
        const png = await sharp(file).resize(1200, 630, { fit: 'cover' }).png().toBuffer();
        art = `data:image/png;base64,${png.toString('base64')}`;
      }
    }
  } catch {
    // Fall through to the text-only card — the page itself handles a
    // missing slug; this route just must not throw.
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0B1020' }}>
        {art && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={art} width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(90deg, rgba(11,16,32,0.94) 0%, rgba(11,16,32,0.82) 45%, rgba(11,16,32,0.1) 100%)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 80px', maxWidth: 820 }}>
          <div style={{ display: 'flex', fontSize: 22, fontFamily: 'Arial, sans-serif', fontWeight: 700, color: '#D4A64E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', marginTop: 22, fontSize: 58, fontFamily: 'Georgia, serif', color: '#F4EEDF', lineHeight: 1.12 }}>{title}</div>
          <div style={{ display: 'flex', marginTop: 34, fontSize: 22, fontFamily: 'Arial, sans-serif', color: '#A9AEC2' }}>
            Your birth chart and your home, read the Vedic way · arohaastrology.in
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
