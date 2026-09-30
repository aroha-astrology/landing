/**
 * Small product emblems, one per path. Same stroke language across all
 * three (thin line, one filled accent) so they read as a family:
 * a zodiac ring for Astrology, the Vastu Purusha grid for Vastu, a diya
 * flame for Puja.
 */
export function AstrologyGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeOpacity=".9" />
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeOpacity=".5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={60 + 40 * Math.cos(a)} y1={60 + 40 * Math.sin(a)} x2={60 + 52 * Math.cos(a)} y2={60 + 52 * Math.sin(a)} stroke="currentColor" strokeOpacity=".8" />;
      })}
      <ellipse cx="60" cy="60" rx="40" ry="12" stroke="currentColor" strokeOpacity=".45" transform="rotate(-23.4 60 60)" />
      <circle cx="60" cy="60" r="6" fill="currentColor" />
      <circle cx="96" cy="46" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function VastuGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <rect x="14" y="14" width="92" height="92" stroke="currentColor" strokeOpacity=".9" />
      {[1, 2].map((i) => (
        <g key={i} stroke="currentColor" strokeOpacity=".45">
          <line x1={14 + (92 / 3) * i} y1="14" x2={14 + (92 / 3) * i} y2="106" />
          <line x1="14" y1={14 + (92 / 3) * i} x2="106" y2={14 + (92 / 3) * i} />
        </g>
      ))}
      <rect x={14 + 92 / 3} y={14 + 92 / 3} width={92 / 3} height={92 / 3} fill="currentColor" fillOpacity=".22" />
      <line x1="14" y1="14" x2="106" y2="106" stroke="currentColor" strokeOpacity=".25" strokeDasharray="3 4" />
      <line x1="106" y1="14" x2="14" y2="106" stroke="currentColor" strokeOpacity=".25" strokeDasharray="3 4" />
      <path d="M60 2 l5 9 h-10 z" fill="currentColor" />
    </svg>
  );
}

export function PujaGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <circle cx="60" cy="50" r="30" fill="currentColor" fillOpacity=".12" />
      <path d="M60 16 C50 34 48 46 60 60 C72 46 70 34 60 16 Z" fill="currentColor" />
      <path d="M22 72 Q60 104 98 72 Q60 80 22 72 Z" stroke="currentColor" strokeOpacity=".9" />
      <path d="M22 72 Q60 92 98 72" stroke="currentColor" strokeOpacity=".5" />
      <line x1="60" y1="60" x2="60" y2="76" stroke="currentColor" strokeOpacity=".7" />
    </svg>
  );
}
