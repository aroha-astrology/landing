'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { cos, sin } from '@/lib/svgmath';

const STAGES = [
  { product: 'Astrology', realm: 'Cosmos', line: 'Understand yourself: the sky at the moment you were born.' },
  { product: 'Vastu', realm: 'Space', line: 'Understand your space: the directions and centre of the home you live in.' },
  { product: 'Puja', realm: 'Ritual', line: 'Practise meaningful rituals: the moments that mark a life.' },
  { product: 'Aroha', realm: 'One ecosystem', line: 'Your life. Your space. Your journey.' },
];

// Each stage owns a quarter of the scroll distance.
const WINDOWS: [number, number][] = [
  [0, 0.25],
  [0.25, 0.5],
  [0.5, 0.75],
  [0.75, 1],
];

function useStageOpacity(p: MotionValue<number>, i: number) {
  const [a, b] = WINDOWS[i];
  const last = i === WINDOWS.length - 1;
  return useTransform(p, last ? [a - 0.04, a + 0.04] : [a - 0.04, a + 0.04, b - 0.04, b + 0.04], last ? [0, 1] : [0, 1, 1, 0]);
}

/**
 * The signature moment: one geometry assembling as you scroll.
 * Cosmos is a circle (the zodiac), Space is the square inscribed in it (the
 * Vastu Purusha grid), Ritual is the flame at the centre — and together,
 * circle-square-centre is the oldest mandala form there is: Aroha.
 *
 * The stage texts are an ordered list in the HTML, so the idea is legible
 * without scrolling or JS; reduced motion shows the finished figure.
 */
export function SignatureTransition() {
  const ref = useRef<HTMLElement>(null);
  // Read after mount: the server can't know the preference, and React keeps
  // server-rendered attributes on a hydration mismatch, so a first-render
  // value would never update the section's height.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = scrollYProgress;

  const bg = useTransform(p, [0, 0.3, 0.55, 0.8, 1], ['#0B1020', '#0B1020', '#231A12', '#24140C', '#141310']);
  const circle = useTransform(p, [0, 0.18], [0, 1]);
  const ticks = useTransform(p, [0.08, 0.22], [0, 1]);
  const square = useTransform(p, [0.28, 0.46], [0, 1]);
  const grid = useTransform(p, [0.38, 0.5], [0, 1]);
  const flame = useTransform(p, [0.55, 0.7], [0, 1]);
  const flameScale = useTransform(p, [0.55, 0.72], [0.4, 1]);
  const unity = useTransform(p, [0.78, 0.92], [0, 1]);
  const spin = useTransform(p, [0, 1], [0, 90]);
  const o0 = useStageOpacity(p, 0);
  const o1 = useStageOpacity(p, 1);
  const o2 = useStageOpacity(p, 2);
  const o3 = useStageOpacity(p, 3);
  const opacities = [o0, o1, o2, o3];

  const full = reduce ? 1 : undefined;

  return (
    <motion.section
      ref={ref}
      aria-labelledby="signature-title"
      className={`relative text-night-ink ${reduce ? '' : 'h-[280vh] md:h-[360vh]'}`}
      style={{ backgroundColor: reduce ? '#141310' : bg }}
    >
      <div className={`${reduce ? '' : 'sticky top-0 h-[100svh]'} flex items-center overflow-hidden px-[clamp(20px,4vw,56px)] py-20`}>
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative order-2 md:order-1">
            <h2 id="signature-title" className="text-[12.5px] font-bold uppercase tracking-[0.22em] text-astro-gold">
              From the cosmos to your doorstep
            </h2>
            <ol className={`relative mt-6 ${reduce ? 'space-y-8' : 'min-h-[240px] sm:min-h-[260px]'}`}>
              {STAGES.map((s, i) => (
                <motion.li key={s.product} className={reduce ? '' : 'absolute inset-x-0 top-0'} style={{ opacity: reduce ? 1 : opacities[i] }}>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-night-ink-2">
                    {i < 3 ? `${String(i + 1).padStart(2, '0')} · ${s.product}` : 'Together'}
                  </p>
                  <p className="font-display mt-3 text-[clamp(52px,8vw,104px)] leading-[0.95]">{s.realm}</p>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-night-ink-2">{s.line}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <svg viewBox="0 0 400 400" className="h-auto w-[min(78vw,480px)]" aria-hidden>
              {/* Cosmos: the zodiac circle */}
              <motion.circle cx="200" cy="200" r="180" fill="none" stroke="#D4A64E" strokeWidth="1.5" style={{ pathLength: full ?? circle }} />
              <motion.g style={{ opacity: full ?? ticks, rotate: reduce ? 0 : spin }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const a = (i * 30 * Math.PI) / 180;
                  return <line key={i} x1={200 + 162 * cos(a)} y1={200 + 162 * sin(a)} x2={200 + 180 * cos(a)} y2={200 + 180 * sin(a)} stroke="#D4A64E" />;
                })}
                {Array.from({ length: 27 }, (_, i) => {
                  const a = ((i * 360) / 27) * (Math.PI / 180);
                  return <circle key={i} cx={200 + 192 * cos(a)} cy={200 + 192 * sin(a)} r="1.6" fill="#E9CF95" />;
                })}
              </motion.g>
              {/* Space: the square inscribed in the circle, with the Vastu grid */}
              <motion.rect x={200 - 127.3} y={200 - 127.3} width={254.6} height={254.6} fill="none" stroke="#C98B63" strokeWidth="1.5" style={{ pathLength: full ?? square }} />
              <motion.g style={{ opacity: full ?? grid }} stroke="#C98B63" strokeOpacity=".55">
                {[1, 2].map((k) => (
                  <g key={k}>
                    <line x1={200 - 127.3 + (254.6 / 3) * k} y1={72.7} x2={200 - 127.3 + (254.6 / 3) * k} y2={327.3} />
                    <line x1={72.7} y1={200 - 127.3 + (254.6 / 3) * k} x2={327.3} y2={200 - 127.3 + (254.6 / 3) * k} />
                  </g>
                ))}
                <rect x={200 - 42.4} y={200 - 42.4} width={84.9} height={84.9} fill="#C98B63" fillOpacity=".12" stroke="none" />
              </motion.g>
              {/* Ritual: the flame at the centre, a photographed clay diya feathered into the dark */}
              <defs>
                <radialGradient id="sig-diya-fade">
                  <stop offset="74%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="sig-diya-mask">
                  <circle cx="200" cy="200" r="59" fill="url(#sig-diya-fade)" />
                </mask>
              </defs>
              <motion.g style={{ opacity: full ?? flame, scale: full ?? flameScale, transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="74" fill="#F2A93B" opacity=".14" />
                <image href="/assets/home/diya-flame.webp" x="141" y="141" width="118" height="118" mask="url(#sig-diya-mask)" />
              </motion.g>
              {/* Aroha: the three become one mandala */}
              <motion.g style={{ opacity: full ?? unity }}>
                <circle cx="200" cy="200" r="196" fill="none" stroke="#F4EEDF" strokeOpacity=".35" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="#F4EEDF" strokeOpacity=".4" />
                {Array.from({ length: 8 }, (_, i) => {
                  const a = (i * 45 * Math.PI) / 180;
                  return <line key={i} x1={200 + 60 * cos(a)} y1={200 + 60 * sin(a)} x2={200 + 127 * cos(a)} y2={200 + 127 * sin(a)} stroke="#F4EEDF" strokeOpacity=".25" />;
                })}
              </motion.g>
            </svg>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
