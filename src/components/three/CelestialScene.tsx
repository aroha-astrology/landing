'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '@/store/useScroll';

/**
 * The hero's celestial armillary: ecliptic and equator rings, a 12-fold
 * zodiac band with 27 Nakshatra ticks, nine grahas moving along the
 * ecliptic at their relative speeds, a faint mandala plane and a starfield.
 *
 * Everything is procedural line/point geometry — no models, no textures
 * except one 64px glow sprite drawn to a canvas — so the whole scene is a
 * few hundred KB of GPU buffers and zero network requests beyond three.js.
 * Pointer and scroll come from the shared `useScroll` store (published by
 * SmoothScrollProvider), read inside useFrame so nothing re-renders React.
 */

const GOLD = new THREE.Color('#D4A64E');
const GOLD_SOFT = new THREE.Color('#E9CF95');
const STARLIGHT = new THREE.Color('#F4EEDF');
const TILT = THREE.MathUtils.degToRad(23.44);

// Sidereal periods (days) set relative speeds: the Moon laps everything.
const GRAHAS: { color: string; size: number; period: number; phase: number }[] = [
  { color: '#F2B54A', size: 0.1, period: 365, phase: 0.2 }, // Sun
  { color: '#ECE6D6', size: 0.085, period: 27.3, phase: 1.3 }, // Moon
  { color: '#D0643C', size: 0.06, period: 687, phase: 2.4 }, // Mars
  { color: '#9FC08A', size: 0.05, period: 88, phase: 3.1 }, // Mercury
  { color: '#E3B866', size: 0.09, period: 4333, phase: 4.2 }, // Jupiter
  { color: '#F1E6CF', size: 0.07, period: 225, phase: 5.0 }, // Venus
  { color: '#8E9BC4', size: 0.08, period: 10759, phase: 5.8 }, // Saturn
  { color: '#6D7291', size: 0.05, period: -6798, phase: 0.9 }, // Rahu (retrograde)
  { color: '#A88B6C', size: 0.05, period: -6798, phase: 0.9 + Math.PI }, // Ketu (opposite)
];

function circlePoints(radius: number, segments = 256): THREE.Vector3[] {
  return Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
}

function makeLoop(radius: number, color: THREE.Color, opacity: number) {
  const geo = new THREE.BufferGeometry().setFromPoints(circlePoints(radius));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  return new THREE.LineLoop(geo, mat);
}

function makeTicks(r0: number, r1: number, count: number, color: THREE.Color, opacity: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r0, 0, Math.sin(a) * r0), new THREE.Vector3(Math.cos(a) * r1, 0, Math.sin(a) * r1));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Armillary({ reduced, lite }: { reduced: boolean; lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const planets = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const glow = useMemo(glowTexture, []);

  const rings = useMemo(() => {
    const group = new THREE.Group();
    // Ecliptic plane: zodiac band + nakshatra ticks.
    const ecliptic = new THREE.Group();
    ecliptic.add(makeLoop(3, GOLD, 0.9));
    ecliptic.add(makeLoop(3.28, GOLD, 0.55));
    ecliptic.add(makeTicks(3, 3.28, 12, GOLD, 0.8));
    ecliptic.add(makeTicks(3.28, 3.4, 27, GOLD_SOFT, 0.55));
    ecliptic.add(makeTicks(3.28, 3.33, 108, GOLD_SOFT, 0.25));
    group.add(ecliptic);
    // Celestial equator, tilted against the ecliptic.
    const equator = makeLoop(3.05, GOLD_SOFT, 0.35);
    equator.rotation.x = TILT;
    group.add(equator);
    // Two meridians: the classic armillary cage.
    for (const rot of [0, Math.PI / 2]) {
      const m = makeLoop(3.12, GOLD_SOFT, 0.14);
      m.rotation.z = Math.PI / 2;
      m.rotation.y = rot;
      group.add(m);
    }
    // Faint mandala plane behind the sphere.
    const mandala = new THREE.Group();
    for (const r of [4.2, 4.9, 5.6]) mandala.add(makeLoop(r, GOLD, 0.08));
    const petals = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 16 * 32 + 1 }, (_, i) => {
        const a = (i / (16 * 32)) * Math.PI * 2;
        const r = 4.2 + 0.7 * Math.abs(Math.sin(a * 8));
        return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
      }),
    );
    mandala.add(new THREE.Line(petals, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.1 })));
    mandala.rotation.x = Math.PI / 2;
    mandala.position.z = -2.5;
    group.add(mandala);
    return group;
  }, []);

  const stars = useMemo(() => {
    const count = lite ? 700 : 1600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 20;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p) - 10], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: STARLIGHT, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false }),
    );
  }, [lite]);

  useEffect(
    () => () => {
      // Free GPU buffers when the hero unmounts (client navigation away).
      for (const obj of [rings, stars]) {
        obj.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose();
          (m.material as THREE.Material | undefined)?.dispose?.();
        });
      }
      glow.dispose();
    },
    [rings, stars, glow],
  );

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const { px, py } = useScroll.getState();
    const heroH = window.innerHeight || 800;
    const scroll = Math.min(1, Math.max(0, window.scrollY / heroH));
    const t = state.clock.elapsedTime;
    const drift = reduced ? 0 : t * 0.035;
    // Damped pointer tilt; scroll turns the sphere and dollies back.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.42 + py * 0.12 + scroll * 0.35, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5 + drift + px * 0.22 + scroll * 0.9, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 13 + scroll * 4, 3, delta);
    if (planets.current && !reduced) {
      planets.current.children.forEach((child, i) => {
        const gr = GRAHAS[i];
        // One real year ≈ 40 s of animation; keeps the Moon visibly moving.
        const a = gr.phase + (t * 9.1) / gr.period;
        child.position.set(Math.cos(a) * 3.14, 0, Math.sin(a) * 3.14);
      });
    }
  });

  return (
    <group ref={root} rotation={[0.42, -0.5, 0]}>
      <primitive object={rings} />
      <group ref={planets}>
        {GRAHAS.map((gr, i) => (
          <group key={i} position={[Math.cos(gr.phase) * 3.14, 0, Math.sin(gr.phase) * 3.14]}>
            <mesh>
              <sphereGeometry args={[gr.size, 20, 20]} />
              <meshBasicMaterial color={gr.color} />
            </mesh>
            <sprite scale={[gr.size * 7, gr.size * 7, 1]}>
              <spriteMaterial map={glow} color={gr.color} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
          </group>
        ))}
      </group>
      {/* The observer at the centre — Vedic astrology is geocentric. */}
      <mesh>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#C9D2F2" />
      </mesh>
      <sprite scale={[1.6, 1.6, 1]}>
        <spriteMaterial map={glow} color="#7F8FD0" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <primitive object={stars} />
    </group>
  );
}

export default function CelestialScene({ active, reduced, lite, onReady }: { active: boolean; reduced: boolean; lite: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 13], fov: 38 }}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      onCreated={() => onReady()}
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <Armillary reduced={reduced} lite={lite} />
    </Canvas>
  );
}
