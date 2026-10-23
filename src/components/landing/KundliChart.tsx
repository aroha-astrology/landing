/**
 * The North Indian Kundli chart, as the Aroha app draws it: a square cut by its
 * two diagonals and the diamond between the mid-points of its sides, which
 * makes the twelve houses. House 1 (the Lagna) is always the top diamond; the
 * houses run anticlockwise from it. Each house carries the number of the sign
 * in it and the grahas placed there.
 *
 * Plain SVG with no state, so the result renders the same on the server.
 */

type Planet = { planet: string; sign: string; house: number; isRetrograde: boolean };

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

/** Signs in which a planet is exalted / debilitated (the nodes are left out: the texts disagree). */
const EXALTED: Record<string, string> = { Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo', Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra' };
const DEBILITATED: Record<string, string> = { Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces', Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries' };

/** Where planets are written in each house, and where its sign number sits. */
const HOUSES: Record<number, { planets: [number, number]; num: [number, number] }> = {
  1: { planets: [200, 100], num: [200, 172] },
  2: { planets: [100, 34], num: [100, 80] },
  3: { planets: [38, 100], num: [76, 100] },
  4: { planets: [100, 200], num: [172, 200] },
  5: { planets: [38, 300], num: [76, 300] },
  6: { planets: [100, 366], num: [100, 320] },
  7: { planets: [200, 300], num: [200, 228] },
  8: { planets: [300, 366], num: [300, 320] },
  9: { planets: [362, 300], num: [324, 300] },
  10: { planets: [300, 200], num: [228, 200] },
  11: { planets: [362, 100], num: [324, 100] },
  12: { planets: [300, 34], num: [300, 80] },
};

const GOOD = '#2F7A4B';
const BAD = '#B03A2E';

function mark(p: Planet) {
  const up = EXALTED[p.planet] === p.sign;
  const down = DEBILITATED[p.planet] === p.sign;
  return { up, down, color: up ? GOOD : down ? BAD : 'var(--accent-text)' };
}

export function KundliChart({ ascendantSign, planets }: { ascendantSign: string; planets: Planet[] }) {
  const asc = SIGNS.indexOf(ascendantSign);

  return (
    <div data-no-translate>
      <svg
        viewBox="-10 -10 420 420"
        className="mx-auto block h-auto w-full max-w-[380px]"
        role="img"
        aria-label={`North Indian Kundli chart, ascendant ${ascendantSign}`}
      >
        <polygon points="200,0 300,100 200,200 100,100" fill="var(--accent-soft)" />
        <g fill="none" stroke="var(--ink-muted)" strokeWidth={1.4} strokeLinejoin="round">
          <rect x="0" y="0" width="400" height="400" strokeWidth={2} stroke="var(--ink-2)" />
          <line x1="0" y1="0" x2="400" y2="400" />
          <line x1="400" y1="0" x2="0" y2="400" />
          <polygon points="200,0 400,200 200,400 0,200" />
        </g>

        {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
          const spot = HOUSES[house];
          const here = planets.filter((p) => p.house === house);
          // Four or more in one house go in two columns so the small corner houses don't overflow.
          const cols = here.length > 3 ? 2 : 1;
          const rows = Math.ceil(here.length / cols);
          return (
            <g key={house}>
              {asc >= 0 && (
                <text
                  x={spot.num[0]}
                  y={spot.num[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fill="var(--ink-muted)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {((asc + house - 1) % 12) + 1}
                </text>
              )}
              {house === 1 && (
                <text x={200} y={26} textAnchor="middle" fontSize={11} fontWeight={700} letterSpacing="1.5" fill="var(--accent-text)">
                  ASC
                </text>
              )}
              {here.map((p, i) => {
                const m = mark(p);
                const col = cols === 2 ? i % 2 : 0;
                const row = cols === 2 ? Math.floor(i / 2) : i;
                const x = spot.planets[0] + (cols === 2 ? (col ? 15 : -15) : 0);
                const y = spot.planets[1] + (row - (rows - 1) / 2) * 17 + (house === 1 ? 6 : 0);
                return (
                  <text key={p.planet} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={m.color}>
                    {PLANET_ABBR[p.planet] ?? p.planet.slice(0, 2)}
                    {p.isRetrograde && <tspan fontSize={10} dy={-5}>R</tspan>}
                    {m.up && <tspan fontSize={13} dy={p.isRetrograde ? 5 : 0}>↑</tspan>}
                    {m.down && <tspan fontSize={13} dy={p.isRetrograde ? 5 : 0}>↓</tspan>}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
