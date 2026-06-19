'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CosmicBackground } from '../landing/CosmicBackground';

/**
 * Backdrop orchestrator. Always paints the CSS CosmicBackground (instant first
 * paint, and the graceful fallback). When the device supports WebGL it layers
 * the lazy, client-only 3D scene on top — at reduced quality on coarse-pointer
 * / small / low-memory devices, and static under prefers-reduced-motion.
 *
 * The 3D canvas is loaded with ssr:false so three.js never ships in the server
 * bundle and there's no hydration of WebGL on the server.
 */
const CosmicScene = dynamic(() => import('./CosmicScene'), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

type SceneState = {
  ready: boolean;
  webgl: boolean;
  animate: boolean;
  quality: 'high' | 'low';
};

export function Scene3D() {
  const [s, setS] = useState<SceneState>({
    ready: false,
    webgl: false,
    animate: true,
    quality: 'high',
  });

  // The 3D wheel is the hero's stage; once you scroll into the content it
  // recedes AND dims to a faint cosmic shimmer so sections stay legible.
  const { scrollYProgress } = useScroll();
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.16]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 768;
    const lowMem =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number' &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;

    setS({
      ready: true,
      webgl: supportsWebGL(),
      animate: !reduce,
      quality: coarse || small || lowMem ? 'low' : 'high',
    });
  }, []);

  const use3D = s.ready && s.webgl;

  return (
    <>
      {/* Base gradient + vignette (and the fallback). CSS particles only when
          the 3D starfield isn't running. */}
      <CosmicBackground particles={!use3D} />

      {use3D && (
        <motion.div
          className="pointer-events-none fixed inset-0 -z-[5]"
          style={{ opacity: s.animate ? sceneOpacity : 0.5 }}
          aria-hidden
        >
          <CosmicScene
            animate={s.animate}
            quality={s.quality}
            dpr={s.quality === 'high' ? [1, 2] : [1, 1.5]}
          />
        </motion.div>
      )}
    </>
  );
}
