import { ImageResponse } from 'next/og';
import { getAllSlugs, getPost } from '@/lib/blog';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#1B1912';
const ACCENT = '#D98A2B';
const SUBTITLE = '#57544B';
const ACCENT_SOFT = '#7C786E';
const PAPER = '#F2ECDF';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// One bespoke card per post, replacing the single generic card every post
// used to share (see the root opengraph-image.tsx this borrows its motif
// and palette from) — each share now surfaces the actual post title.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = 'Aroha Astrology';
  try {
    title = getPost(slug).frontmatter.title;
  } catch {
    // Fall through to the default title — notFound() on the page itself is
    // what actually handles a missing slug; this route just needs to not throw.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          background: PAPER,
          padding: '80px 96px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: 80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: `3px solid ${ACCENT}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 64 + 30,
            right: 80 + 30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `2px solid ${ACCENT}`,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', fontSize: 22, fontFamily: 'Arial, sans-serif', fontWeight: 700, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Aroha Astrology · Blog
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 56,
            fontWeight: 600,
            color: INK,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            color: SUBTITLE,
          }}
        >
          Vedic astrology, explained clearly
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 12,
            fontSize: 20,
            fontFamily: 'Arial, sans-serif',
            color: ACCENT_SOFT,
          }}
        >
          arohaastrology.in/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
