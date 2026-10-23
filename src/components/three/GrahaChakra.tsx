'use client';

import { useEffect, useRef } from 'react';
import { cos, sin } from '@/lib/svgmath';

/**
 * The hero's orrery: the nine grahas on their own orbits around the Earth (a
 * Kundli is cast for a person standing on Earth, so Earth is the centre here).
 * Outside the orbits sit a slowly turning band of the twelve rashis and a rim of
 * 27 nakshatra marks.
 *
 * It is one flat SVG, drawn on the server so there is no layout shift and
 * nothing to download for it. The planets are moved by a small animation loop
 * that only runs while the picture is on screen, never under reduced motion,
 * and holds still while the pointer is over a planet or one is selected, so a
 * planet can actually be clicked. Orbital speeds are not to scale: they are
 * chosen so the sky is lively, the nearer planets quicker than the far ones.
 *
 * With `onSelect` the planets become buttons (name = a key of GRAHA_INFO). Without
 * it the picture is decoration and hidden from assistive tech.
 */

const C = 300;
const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * cos(a), C + r * sin(a)];
};
const at = (r: number, deg: number) => {
  const [x, y] = polar(r, deg);
  return `translate(${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100})`;
};

type Graha = {
  name: string;
  /** Sanskrit name, shown beside the planet while it is selected. */
  sanskrit: string;
  tex: string;
  glow: string;
  /** Orbit radius, disc diameter, seconds per turn (negative turns the other way), and where it starts. */
  r: number;
  size: number;
  period: number;
  start: number;
};

const GRAHAS: Graha[] = [
  { name: 'Moon', sanskrit: 'Chandra', tex: 'moon', glow: '#ECE6D6', r: 80, size: 20, period: 46, start: 290 },
  { name: 'Mercury', sanskrit: 'Budha', tex: 'mercury', glow: '#B9C2CC', r: 108, size: 16, period: 72, start: 20 },
  { name: 'Venus', sanskrit: 'Shukra', tex: 'venus', glow: '#F1E6CF', r: 135, size: 21, period: 104, start: 140 },
  { name: 'Sun', sanskrit: 'Surya', tex: 'sun', glow: '#F2B54A', r: 162, size: 32, period: 140, start: 75 },
  { name: 'Mars', sanskrit: 'Mangal', tex: 'mars', glow: '#D0643C', r: 188, size: 19, period: 185, start: 235 },
  { name: 'Jupiter', sanskrit: 'Guru', tex: 'jupiter', glow: '#E3B866', r: 212, size: 30, period: 270, start: 330 },
  { name: 'Saturn', sanskrit: 'Shani', tex: 'saturn', glow: '#8E9BC4', r: 233, size: 28, period: 380, start: 185 },
];

/** Rahu and Ketu are shadow points with no body: drawn as dark discs, always opposite each other. */
const NODES = [
  { name: 'Rahu', sanskrit: 'Rahu', glyph: '☊︎', start: 210 },
  { name: 'Ketu', sanskrit: 'Ketu', glyph: '☋︎', start: 30 },
];
const NODE_R = 246;
const NODE_PERIOD = -620;

const RASHIS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map(
  (g) => `${g}︎`,
);

// Deterministic starfield (no Math.random in render: server and client agree).
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 137.508) % 600,
  y: (i * 91.3 + (i % 7) * 37) % 600,
  r: i % 9 === 0 ? 1.5 : 0.8,
  d: (i % 5) * 0.8,
}));

export function GrahaChakra({
  className = '',
  onSelect,
  selected = null,
  planetScale = 1,
  hitRadius = 24,
  still = false,
}: {
  className?: string;
  /** Makes the planets tappable; called with the graha's name ("Saturn"). */
  onSelect?: (name: string) => void;
  /** The graha whose card is open, ringed in gold. */
  selected?: string | null;
  /** Draws the planet discs larger, for the orrery at phone size. */
  planetScale?: number;
  /** Radius of a planet's tap target in viewBox units. */
  hitRadius?: number;
  /** Never moves the planets: for the faint copies behind other sections. */
  still?: boolean;
}) {
  const interactive = Boolean(onSelect);
  const svg = useRef<SVGSVGElement>(null);
  const bodies = useRef<Record<string, SVGGElement | null>>({});
  const hold = useRef({ hover: false, selected: false });
  hold.current.selected = selected !== null;

  useEffect(() => {
    const el = svg.current;
    if (still || !el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const all = [
      ...GRAHAS.map((g) => ({ key: g.name, r: g.r, period: g.period, start: g.start })),
      ...NODES.map((n) => ({ key: n.name, r: NODE_R, period: NODE_PERIOD, start: n.start })),
    ];
    let visible = true;
    let raf = 0;
    let last = performance.now();
    // Seconds of motion so far; it stops advancing while held, so nothing jumps on release.
    let clock = 0;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (visible && document.visibilityState === 'visible' && !hold.current.hover && !hold.current.selected) {
        clock += dt;
        for (const p of all) {
          const node = bodies.current[p.key];
          if (!node) continue;
          const deg = p.start + (clock / p.period) * 360;
          const a = ((deg - 90) * Math.PI) / 180;
          node.setAttribute('transform', `translate(${(C + p.r * Math.cos(a)).toFixed(2)} ${(C + p.r * Math.sin(a)).toFixed(2)})`);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [still]);

  const hit = (name: string) =>
    interactive ? (
      // The disc is far smaller than a fingertip; this is what is actually tapped.
      <circle
        r={hitRadius}
        fill="transparent"
        role="button"
        tabIndex={0}
        aria-label={name}
        aria-pressed={selected === name}
        className="cursor-pointer outline-none focus-visible:stroke-[#E9CF95] focus-visible:[stroke-width:2]"
        style={{ pointerEvents: 'all' }}
        onPointerEnter={() => (hold.current.hover = true)}
        onPointerLeave={() => (hold.current.hover = false)}
        onClick={() => onSelect?.(name)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(name);
          }
        }}
      />
    ) : null;

  return (
    <svg
      ref={svg}
      viewBox="0 0 600 600"
      className={className}
      aria-hidden={interactive ? undefined : true}
      role={interactive ? 'group' : undefined}
      aria-label={interactive ? 'The nine grahas of Vedic astrology around the Earth' : undefined}
      focusable="false"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <radialGradient id="gc-sky" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#24336E" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#101A40" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7FA8FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7FA8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gc-node" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#2B3566" />
          <stop offset="100%" stopColor="#090D1E" />
        </radialGradient>
      </defs>

      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#F4EEDF"
          opacity={0.5}
          style={still ? undefined : { animation: `aroha-twinkle 5s ease-in-out ${s.d}s infinite` }}
        />
      ))}
      <circle cx={C} cy={C} r={296} fill="url(#gc-sky)" />

      {/* Twelve faint house lines under everything else. */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x0, y0] = polar(46, i * 30);
        const [x1, y1] = polar(250, i * 30);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#D4A64E" strokeOpacity={0.09} />;
      })}

      {/* The rashi band and the nakshatra rim, turning slowly together. */}
      <g style={still ? undefined : { transformOrigin: '300px 300px', animation: 'aroha-spin 300s linear infinite' }}>
        <circle cx={C} cy={C} r={296} fill="none" stroke="#D4A64E" strokeOpacity={0.55} />
        <circle cx={C} cy={C} r={286} fill="none" stroke="#D4A64E" strokeWidth={1.4} />
        <circle cx={C} cy={C} r={252} fill="none" stroke="#D4A64E" strokeOpacity={0.7} />
        {Array.from({ length: 27 }, (_, i) => {
          const [x0, y0] = polar(286, i * (360 / 27));
          const [x1, y1] = polar(296, i * (360 / 27));
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#E9CF95" strokeOpacity={0.55} />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const [x0, y0] = polar(252, i * 30);
          const [x1, y1] = polar(286, i * 30);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#D4A64E" strokeOpacity={0.6} />;
        })}
        {RASHIS.map((g, i) => (
          <text
            key={i}
            x={C}
            y={C - 269}
            transform={`rotate(${i * 30 + 15} ${C} ${C})`}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={19}
            fill="#E9CF95"
            fillOpacity={0.9}
          >
            {g}
          </text>
        ))}
      </g>

      {/* Orbits. */}
      {GRAHAS.map((g) => (
        <circle key={g.name} cx={C} cy={C} r={g.r} fill="none" stroke="#E9CF95" strokeOpacity={selected === g.name ? 0.7 : 0.2} />
      ))}
      <circle cx={C} cy={C} r={NODE_R} fill="none" stroke="#E9CF95" strokeOpacity={0.2} strokeDasharray="2 6" />

      {/* The Earth, at the centre: a Kundli is cast for someone standing on it. */}
      <circle cx={C} cy={C} r={58} fill="url(#gc-glow)" />
      <image href="/assets/planets/earth-disc.webp" x={C - 34} y={C - 34} width={68} height={68} />

      {/* Rahu and Ketu. */}
      {NODES.map((n) => (
        <g
          key={n.name}
          ref={(el) => {
            bodies.current[n.name] = el;
          }}
          transform={at(NODE_R, n.start)}
        >
          <circle r={13} fill="url(#gc-node)" stroke="#E9CF95" strokeOpacity={selected === n.name ? 1 : 0.6} strokeWidth={selected === n.name ? 2 : 1} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={14} fill="#E9CF95">
            {n.glyph}
          </text>
          {selected === n.name && <text y={-24} textAnchor="middle" fontSize={13} fill="#F7E2A6">{n.sanskrit}</text>}
          {hit(n.name)}
        </g>
      ))}

      {/* The seven planets. */}
      {GRAHAS.map((g) => {
        const d = Math.round(g.size * planetScale * 100) / 100;
        const isSelected = selected === g.name;
        return (
          <g
            key={g.name}
            ref={(el) => {
              bodies.current[g.name] = el;
            }}
            transform={at(g.r, g.start)}
          >
            <circle r={d * (g.tex === 'sun' ? 0.78 : 0.85)} fill={g.glow} opacity={g.tex === 'sun' ? 0.26 : 0.14} />
            <image href={`/assets/planets/${g.tex}-disc.webp`} x={-d / 2} y={-d / 2} width={d} height={d} />
            {isSelected && <circle r={d / 2 + 6} fill="none" stroke="#E9CF95" strokeWidth={2} />}
            {isSelected && (
              <text y={-(d / 2 + 14)} textAnchor="middle" fontSize={13} fill="#F7E2A6" stroke="#0B1020" strokeWidth={3} paintOrder="stroke">
                {g.sanskrit}
              </text>
            )}
            {hit(g.name)}
          </g>
        );
      })}
    </svg>
  );
}
