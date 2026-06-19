'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The signature artifact: a golden Rashi Chakra (zodiac wheel). An outer rim,
 * inner rings, twelve radial spokes dividing the rashis, and the twelve zodiac
 * glyphs — drawn to canvas textures at runtime so we ship no font/image files.
 * Spins slowly in its own plane; the parent group tilts it into 3D.
 *
 * Materials are emissive gold so the Bloom pass makes the whole wheel glow.
 */

const GOLD = '#D4AF37';
const GOLD_BRIGHT = '#F2CA50';
const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const OUTER = 3.0;
const INNER = 1.05;
const GLYPH_R = 2.62;

function makeGlyphTexture(symbol: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = GOLD_BRIGHT;
  ctx.font = '700 84px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = GOLD_BRIGHT;
  ctx.shadowBlur = 18;
  ctx.fillText(symbol, size / 2, size / 2 + 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

export function RashiChakra({ animate = true }: { animate?: boolean }) {
  const group = useRef<THREE.Group>(null);

  // Geometry + textures built once.
  const glyphTextures = useMemo(() => ZODIAC.map(makeGlyphTexture), []);
  const spokes = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6),
    [],
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD,
        emissive: GOLD,
        emissiveIntensity: 1.0,
        metalness: 0.9,
        roughness: 0.25,
      }),
    [],
  );
  const spokeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD,
        emissive: GOLD,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.4,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.z += delta * 0.06;
  });

  return (
    <group ref={group}>
      {/* Concentric rims. */}
      <mesh material={ringMat}>
        <torusGeometry args={[OUTER, 0.045, 16, 120]} />
      </mesh>
      <mesh material={ringMat}>
        <torusGeometry args={[OUTER - 0.5, 0.02, 12, 110]} />
      </mesh>
      <mesh material={ringMat}>
        <torusGeometry args={[INNER, 0.025, 12, 80]} />
      </mesh>

      {/* Twelve radial spokes between inner and outer rings. */}
      {spokes.map((a, i) => {
        const len = OUTER - INNER;
        const mid = (OUTER + INNER) / 2;
        return (
          <mesh
            key={i}
            material={spokeMat}
            position={[Math.cos(a) * mid, Math.sin(a) * mid, 0]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[len, 0.015, 0.015]} />
          </mesh>
        );
      })}

      {/* Zodiac glyphs around the wheel. */}
      {glyphTextures.map((tex, i) => {
        const a = (i * Math.PI) / 6 + Math.PI / 12; // centered in each house
        return (
          <mesh key={i} position={[Math.cos(a) * GLYPH_R, Math.sin(a) * GLYPH_R, 0.01]}>
            <planeGeometry args={[0.52, 0.52]} />
            <meshBasicMaterial map={tex} transparent depthWrite={false} />
          </mesh>
        );
      })}

      {/* Central bindu. */}
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={GOLD_BRIGHT}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
