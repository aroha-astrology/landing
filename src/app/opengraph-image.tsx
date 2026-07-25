import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#1B1912';
// Amber carries the brand on the decorative rings, but it only reaches ~2.3:1
// against paper — so running text uses ink-2 instead.
const ACCENT = '#D98A2B';
const SUBTITLE = '#57544B';
const ACCENT_SOFT = '#7C786E';
const PAPER = '#F2ECDF';

export default async function Image() {
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
        {/* Geometric chart-wheel motif, top right */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: 80,
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: `3px solid ${ACCENT}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 64 + 40,
            right: 80 + 40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `2px solid ${ACCENT}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 64 + 100,
            right: 80 + 100,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: ACCENT,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 780 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 80,
              fontWeight: 600,
              color: INK,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Aroha Astrology
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 34,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 500,
              color: SUBTITLE,
              letterSpacing: '0.01em',
            }}
          >
            Vedic Birth Chart · Moon Sign · AI Astrologer
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              fontSize: 24,
              fontFamily: 'Arial, sans-serif',
              color: ACCENT_SOFT,
            }}
          >
            arohaastrology.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
