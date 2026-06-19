'use client';

import { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RashiChakra } from './RashiChakra';
import { Navagraha } from './Navagraha';
import { useScroll } from '@/store/useScroll';

/**
 * The full WebGL scene. A tilted Rashi Chakra + orbiting Navagraha float in a
 * volumetric starfield with drifting nebula. The camera dollies *into* the
 * cosmos as the page scrolls and drifts toward the pointer (parallax). Bloom
 * gives the gold its glow. Loaded only on the client (see Scene3D).
 */

type Quality = 'high' | 'low';

// Camera rig: pointer parallax + scroll dolly. Reads scroll from the store so
// it never triggers React re-renders.
function CameraRig({ animate }: { animate: boolean }) {
  useFrame((state) => {
    const { progress: p, px: pointerX, py: pointerY } = useScroll.getState();
    const targetZ = 8 + p * 9; // recede into the distance as you scroll
    const px = animate ? pointerX * 0.7 : 0;
    const py = animate ? pointerY * 0.5 : 0;
    const cam = state.camera;
    cam.position.x += (px - cam.position.x) * 0.04;
    cam.position.y += (py - cam.position.y) * 0.04;
    cam.position.z += (targetZ - cam.position.z) * 0.04;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function makeNebulaTexture(rgb: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${rgb},0.55)`);
  g.addColorStop(0.5, `rgba(${rgb},0.16)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function Nebula() {
  const gold = useMemo(() => makeNebulaTexture('212,175,55'), []);
  const violet = useMemo(() => makeNebulaTexture('120,70,190'), []);
  return (
    <group position={[0, 0, -8]}>
      <mesh position={[-3, 2, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial map={gold} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </mesh>
      <mesh position={[4, -3, -2]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial map={violet} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function CosmicScene({
  animate = true,
  quality = 'high',
  dpr = [1, 2],
}: {
  animate?: boolean;
  quality?: Quality;
  dpr?: [number, number];
}) {
  const starCount = quality === 'high' ? 3500 : 1200;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      frameloop={animate ? 'always' : 'demand'}
      aria-hidden
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 3]} intensity={11} color="#F2CA50" distance={20} />

      <Suspense fallback={null}>
        <Nebula />
        <Stars
          radius={80}
          depth={50}
          count={starCount}
          factor={4}
          saturation={0}
          fade
          speed={animate ? 0.6 : 0}
        />

        {/* Tilt turns the flat wheel + orbits into 3D. */}
        <group rotation={[-0.5, 0, 0]}>
          <RashiChakra animate={animate} />
          <Navagraha animate={animate} />
        </group>

        {quality === 'high' && (
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Suspense>

      <CameraRig animate={animate} />
    </Canvas>
  );
}
