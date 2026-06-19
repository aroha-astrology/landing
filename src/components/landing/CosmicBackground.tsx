'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fixed, full-viewport deep-space backdrop sitting behind all content:
 *   1. a deep indigo → cosmic purple gradient base
 *   2. two soft nebula glows (gold + violet)
 *   3. a field of slowly twinkling/drifting particles
 *   4. a vignette to keep edges cinematic
 *
 * Particle positions are generated from a fixed seed (deterministic LCG) so the
 * server and client render the same markup — no hydration mismatch. Honors
 * `prefers-reduced-motion` by rendering the particles static.
 */

type Particle = { left: number; top: number; size: number; delay: number; dur: number; o: number };

function seededParticles(count: number): Particle[] {
  const out: Particle[] = [];
  let s = 8675309; // fixed seed → stable across SSR + client
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      left: next() * 100,
      top: next() * 100,
      size: 1 + next() * 2.4,
      delay: next() * 6,
      dur: 4 + next() * 7,
      o: 0.25 + next() * 0.5,
    });
  }
  return out;
}

export function CosmicBackground() {
  const reduce = useReducedMotion();
  // ~44 particles — dense enough to feel alive, light enough to stay smooth.
  const particles = useMemo(() => seededParticles(44), []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Gradient base — deep indigo into cosmic purple. */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-[#070512]" />

      {/* Nebula glows. */}
      <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_65%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[55vh] w-[55vh] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(120,60,180,0.22),transparent_65%)] blur-3xl" />

      {/* Particle field. */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: reduce ? p.o : undefined,
            }}
            animate={
              reduce
                ? undefined
                : { opacity: [p.o * 0.4, p.o, p.o * 0.4], y: [0, -12, 0] }
            }
            transition={
              reduce
                ? undefined
                : { duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </div>

      {/* Cinematic vignette. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,2,8,0.7)_100%)]" />
    </div>
  );
}
