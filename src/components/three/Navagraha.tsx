'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The nine grahas orbiting the chakra. Each is an emissive sphere on its own
 * radius / speed / phase, with a faint orbit ring. Emissive + toneMapped:false
 * so the Bloom pass lights them up. Orbits live in the XY plane; the parent
 * group's tilt turns the circles into 3D ellipses that pass front-to-back.
 */

type Graha = { color: string; radius: number; speed: number; size: number; phase: number };

const GRAHAS: Graha[] = [
  { color: '#F2CA50', radius: 1.5, speed: 0.55, size: 0.16, phase: 0.0 }, // Surya
  { color: '#E8EAF0', radius: 1.9, speed: 0.46, size: 0.13, phase: 1.1 }, // Chandra
  { color: '#E0533B', radius: 2.35, speed: 0.4, size: 0.12, phase: 2.4 }, // Mangala
  { color: '#7FD1A0', radius: 2.75, speed: 0.34, size: 0.11, phase: 0.7 }, // Budha
  { color: '#E8B04B', radius: 3.25, speed: 0.28, size: 0.18, phase: 3.3 }, // Guru
  { color: '#F2D7D5', radius: 3.7, speed: 0.24, size: 0.14, phase: 1.8 }, // Shukra
  { color: '#5A82C2', radius: 4.2, speed: 0.19, size: 0.15, phase: 4.6 }, // Shani
  { color: '#9A6FC4', radius: 4.7, speed: 0.15, size: 0.1, phase: 2.0 }, // Rahu
  { color: '#B8BEC6', radius: 4.7, speed: 0.15, size: 0.1, phase: 2.0 + Math.PI }, // Ketu (opposite Rahu)
];

function Orb({ graha, animate }: { graha: Graha; animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: graha.color,
        emissive: graha.color,
        emissiveIntensity: 1.8,
        toneMapped: false,
      }),
    [graha.color],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = animate ? state.clock.elapsedTime : 0;
    const a = graha.phase + t * graha.speed;
    ref.current.position.set(Math.cos(a) * graha.radius, Math.sin(a) * graha.radius, 0);
  });

  // Initial position so the static (reduced-motion) frame is composed.
  const a0 = graha.phase;
  return (
    <mesh
      ref={ref}
      material={mat}
      position={[Math.cos(a0) * graha.radius, Math.sin(a0) * graha.radius, 0]}
    >
      <sphereGeometry args={[graha.size, 24, 24]} />
    </mesh>
  );
}

export function Navagraha({ animate = true }: { animate?: boolean }) {
  const orbitMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#D4AF37',
        transparent: true,
        opacity: 0.07,
      }),
    [],
  );
  const radii = useMemo(() => [...new Set(GRAHAS.map((g) => g.radius))], []);

  return (
    <group>
      {radii.map((r, i) => (
        <mesh key={i} material={orbitMat}>
          <torusGeometry args={[r, 0.004, 8, 120]} />
        </mesh>
      ))}
      {GRAHAS.map((g, i) => (
        <Orb key={i} graha={g} animate={animate} />
      ))}
    </group>
  );
}
