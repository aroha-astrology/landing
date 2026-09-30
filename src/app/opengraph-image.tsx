import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Aroha — Ancient wisdom. Modern guidance. Astrology, Vastu and Puja.';

const NIGHT = '#0B1020';
const GOLD = '#D4A64E';
const INK = '#F4EEDF';
const MUTED = '#A9AEC2';

const PRODUCTS: [string, string][] = [
  ['Aroha Astrology', 'Available now'],
  ['Aroha Vastu', 'Available now'],
  ['Aroha Puja', 'Coming soon'],
];

/** The site-wide share card: the ecosystem and each product's real status. */
export default async function Image() {
  const ring = (d: number, o: number) => (
    <div
      style={{
        position: 'absolute',
        top: 315 - d / 2,
        right: 170 - d / 2,
        width: d,
        height: d,
        borderRadius: '50%',
        border: `2px solid ${GOLD}`,
        opacity: o,
        display: 'flex',
      }}
    />
  );
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: `radial-gradient(900px 600px at 85% 50%, #1D2A5A, ${NIGHT})`, padding: '72px 88px' }}>
        {ring(520, 0.25)}
        {ring(400, 0.5)}
        {ring(280, 0.3)}
        <div style={{ position: 'absolute', top: 305, right: 160, width: 20, height: 20, borderRadius: '50%', background: GOLD, display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 760 }}>
          <div style={{ display: 'flex', fontSize: 24, fontFamily: 'Arial, sans-serif', fontWeight: 700, color: GOLD, letterSpacing: '0.2em' }}>AROHA</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, fontSize: 76, fontFamily: 'Georgia, serif', color: INK, lineHeight: 1.04 }}>
            <span>Ancient wisdom.</span>
            <span style={{ color: GOLD, fontStyle: 'italic' }}>Modern guidance.</span>
          </div>
          <div style={{ display: 'flex', marginTop: 44, gap: 28 }}>
            {PRODUCTS.map(([name, status]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
                <span style={{ fontSize: 24, color: INK, fontWeight: 700 }}>{name}</span>
                <span style={{ fontSize: 18, color: status === 'Available now' ? '#A8E0B8' : MUTED, marginTop: 6 }}>{status}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 40, fontSize: 20, fontFamily: 'Arial, sans-serif', color: MUTED }}>arohaastrology.in</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
