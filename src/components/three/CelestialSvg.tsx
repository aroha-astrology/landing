import { cos, sin } from '@/lib/svgmath';

/**
 * Server-rendered stand-in for the WebGL armillary: the same composition in
 * ~3 KB of SVG. It's what phones, low-power devices, crawlers and no-JS
 * visitors see, and what sits underneath the canvas until WebGL is ready.
 * The outer zodiac band drifts via CSS (stopped under reduced motion).
 *
 * With `onSelect` the planets become buttons: this is the armillary a phone
 * gets (HeroArmillaryMobile), where the WebGL scene never loads. Without it
 * the picture is decoration, hidden from assistive tech, as before.
 */
const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [300 + r * cos(a), 300 + r * sin(a)];
};

// Deterministic starfield (no Math.random in render: server and client agree).
const STARS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 137.508) % 600;
  const y = (i * 91.3 + (i % 7) * 37) % 600;
  return { x, y, r: i % 9 === 0 ? 1.6 : 0.8, d: (i % 5) * 0.8 };
});

/**
 * The grahas on the ecliptic ring: [angle, texture, glow colour, disc size,
 * name]. The name is the key into GRAHA_INFO. Rahu and Ketu are shadow points
 * with no body to draw, so they are not here; Earth sits at the centre and is
 * not a graha.
 */
const PLANETS: Array<[number, string, string, number, string]> = [
  [40, 'sun', '#F2B54A', 22, 'Sun'],
  [95, 'moon', '#ECE6D6', 11, 'Moon'],
  [150, 'mars', '#D0643C', 10, 'Mars'],
  [205, 'jupiter', '#E3B866', 17, 'Jupiter'],
  [262, 'saturn', '#8E9BC4', 14, 'Saturn'],
  [318, 'venus', '#F1E6CF', 11, 'Venus'],
  [359, 'mercury', '#B9C2CC', 9, 'Mercury'],
];

/**
 * Radius of a planet's tap target in viewBox units. The phone armillary is at
 * most 380px across a 600-unit viewBox, so 38 units is a 48px-wide target at
 * that size and about 42px on the narrowest phones.
 */
const HIT_RADIUS = 38;

export function CelestialSvg({
  className = '',
  onSelect,
  selected = null,
  planetScale = 1,
}: {
  className?: string;
  /** Makes the planets tappable; called with the graha's name ("Saturn"). */
  onSelect?: (name: string) => void;
  /** The graha whose card is open, ringed in gold. */
  selected?: string | null;
  /** Draws the planet discs larger, for the armillary at phone size. */
  planetScale?: number;
}) {
  const interactive = Boolean(onSelect);

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      aria-hidden={interactive ? undefined : true}
      role={interactive ? 'group' : undefined}
      aria-label={interactive ? 'The planets of Vedic astrology' : undefined}
      focusable="false"
    >
      <defs>
        <radialGradient id="cs-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7F8FD0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7F8FD0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F4EEDF" style={{ animation: `aroha-twinkle 5s ease-in-out ${s.d}s infinite` }} opacity={0.5} />
      ))}
      <circle cx={300} cy={300} r={120} fill="url(#cs-core)" />
      <g style={{ transformOrigin: '300px 300px', animation: 'aroha-spin 240s linear infinite' }}>
        <circle cx={300} cy={300} r={250} fill="none" stroke="#D4A64E" strokeWidth={1.2} />
        <circle cx={300} cy={300} r={226} fill="none" stroke="#D4A64E" strokeOpacity={0.6} />
        {Array.from({ length: 12 }, (_, i) => {
          const [x0, y0] = polar(226, i * 30);
          const [x1, y1] = polar(250, i * 30);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#D4A64E" strokeOpacity={0.85} />;
        })}
        {Array.from({ length: 27 }, (_, i) => {
          const [x0, y0] = polar(250, i * (360 / 27));
          const [x1, y1] = polar(262, i * (360 / 27));
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#E9CF95" strokeOpacity={0.5} />;
        })}
      </g>
      <g style={{ transformOrigin: '300px 300px', animation: 'aroha-spin-rev 420s linear infinite' }}>
        <ellipse cx={300} cy={300} rx={238} ry={70} fill="none" stroke="#E9CF95" strokeOpacity={0.45} transform="rotate(-23.4 300 300)" />
        <ellipse cx={300} cy={300} rx={70} ry={238} fill="none" stroke="#E9CF95" strokeOpacity={0.22} />
        <ellipse cx={300} cy={300} rx={238} ry={150} fill="none" stroke="#E9CF95" strokeOpacity={0.18} transform="rotate(35 300 300)" />
      </g>
      {PLANETS.map(([deg, tex, color, size, name]) => {
        const a = ((deg - 90) * Math.PI) / 180;
        const x = 300 + 238 * cos(a);
        const y = 300 + 70 * sin(a);
        const t = (-23.4 * Math.PI) / 180;
        const X = Math.round((300 + (x - 300) * cos(t) - (y - 300) * sin(t)) * 100) / 100;
        const Y = Math.round((300 + (x - 300) * sin(t) + (y - 300) * cos(t)) * 100) / 100;
        const d = Math.round(size * planetScale * 100) / 100;
        const isSelected = selected === name;
        return (
          <g key={name}>
            <circle cx={X} cy={Y} r={d * (tex === 'sun' ? 1.6 : 1)} fill={color} opacity={tex === 'sun' ? 0.35 : 0.12} />
            <image href={`/assets/planets/${tex}-disc.webp`} x={X - d / 2} y={Y - d / 2} width={d} height={d} />
            {isSelected && <circle cx={X} cy={Y} r={d / 2 + 7} fill="none" stroke="#D4A64E" strokeWidth={2} />}
            {interactive && (
              // The disc is far smaller than a fingertip; this is what is actually tapped.
              <circle
                cx={X}
                cy={Y}
                r={HIT_RADIUS}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={name}
                aria-pressed={isSelected}
                className="cursor-pointer outline-none focus-visible:stroke-[#D4A64E] focus-visible:[stroke-width:2]"
                onClick={() => onSelect?.(name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(name);
                  }
                }}
              />
            )}
          </g>
        );
      })}
      <image href="/assets/planets/earth-disc.webp" x={286} y={286} width={28} height={28} />
    </svg>
  );
}
