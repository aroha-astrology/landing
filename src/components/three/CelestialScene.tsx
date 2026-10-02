'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '@/store/useScroll';

/**
 * The hero's celestial armillary: ecliptic and equator rings, a 12-fold
 * zodiac band with 27 Nakshatra ticks, the grahas moving along the ecliptic
 * at their relative speeds around the Earth, a faint mandala plane and a
 * starfield.
 *
 * The planets are lit spheres wearing surface maps generated in code
 * (scripts/planets/generate.mjs, ~400 KB of WebP in all). A single point
 * light rides with the Sun, so every body, the Moon included, shows the
 * phase it would have from where the Sun sits. Rahu and Ketu are shadow
 * points, so they're drawn as eclipsed discs rather than worlds.
 * Pointer and scroll come from the shared `useScroll` store (published by
 * SmoothScrollProvider), read inside useFrame so nothing re-renders React.
 *
 * Each graha carries an invisible, slightly larger hit sphere so small or
 * fast bodies are easy to click. Hovering or selecting one rings it in gold
 * and slows the orbits to a crawl; HeroVisual shows what it governs.
 */

const GOLD = new THREE.Color('#D4A64E');
const GOLD_SOFT = new THREE.Color('#E9CF95');
const STARLIGHT = new THREE.Color('#F4EEDF');
const TILT = THREE.MathUtils.degToRad(23.44);

// Sidereal periods (days) set relative speeds: the Moon laps everything.
// Sizes are for legibility, not to scale.
type Graha = { name: string; tex?: string; size: number; period: number; phase: number; spin: number; tilt?: number; rings?: boolean };
const GRAHAS: Graha[] = [
  { name: 'Sun', tex: 'sun', size: 0.34, period: 365, phase: 0.2, spin: 0.05 },
  { name: 'Moon', tex: 'moon', size: 0.13, period: 27.3, phase: 1.3, spin: 0 },
  { name: 'Mars', tex: 'mars', size: 0.12, period: 687, phase: 2.4, spin: 0.25, tilt: 0.44 },
  { name: 'Mercury', tex: 'mercury', size: 0.09, period: 88, phase: 3.1, spin: 0.05 },
  { name: 'Jupiter', tex: 'jupiter', size: 0.27, period: 4333, phase: 4.2, spin: 0.5, tilt: 0.05 },
  { name: 'Venus', tex: 'venus', size: 0.15, period: 225, phase: 5.0, spin: -0.03 },
  { name: 'Saturn', tex: 'saturn', size: 0.21, period: 10759, phase: 5.8, spin: 0.45, tilt: 0.47, rings: true },
  { name: 'Rahu', size: 0.075, period: -6798, phase: 0.9, spin: 0 }, // retrograde node
  { name: 'Ketu', size: 0.075, period: -6798, phase: 0.9 + Math.PI, spin: 0 }, // opposite node
];
const ORBIT = 3.14;
const TEX_URLS = [
  ...GRAHAS.filter((g) => g.tex).map((g) => `/assets/planets/${g.tex}.webp`),
  '/assets/planets/earth.webp',
  '/assets/planets/earth-clouds.webp',
  '/assets/planets/saturn-rings.png',
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

/** A thin halo ring, drawn on a camera-facing sprite around the hovered or selected graha. */
function haloTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = 'rgba(255,255,255,1)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Fresnel rim glow for the Earth's atmosphere (drawn on a slightly larger back-faced shell). */
function atmosphereMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: { color: { value: new THREE.Color('#6FA8FF') } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 color; varying vec3 vN; varying vec3 vV;
      void main() { float f = pow(1.0 - abs(dot(vN, vV)), 3.0); gl_FragColor = vec4(color, f * 0.55); }`,
  });
}

/** A ring whose UVs run radially (u: inner→outer), so a 1D strip texture maps onto it. */
function ringGeometry(inner: number, outer: number, segs: number) {
  const geo = new THREE.RingGeometry(inner, outer, segs, 1);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  return geo;
}

function Body({ graha, segs, map, rings, glow }: { graha: Graha; segs: number; map?: THREE.Texture; rings?: THREE.Texture; glow: THREE.Texture }) {
  const r = graha.size;
  const ringGeo = useMemo(() => (graha.rings ? ringGeometry(r * 1.3, r * 2.25, 96) : null), [graha.rings, r]);
  useEffect(() => () => ringGeo?.dispose(), [ringGeo]);

  if (graha.name === 'Sun') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[r, segs, segs]} />
          <meshBasicMaterial map={map} />
        </mesh>
        <sprite scale={[r * 5, r * 5, 1]}>
          <spriteMaterial map={glow} color="#FFB347" transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <sprite scale={[r * 11, r * 11, 1]}>
          <spriteMaterial map={glow} color="#FF8A2A" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    );
  }
  if (!map) {
    // Rahu / Ketu: shadow points, drawn as an eclipsed disc with a thin corona.
    return (
      <group>
        <mesh>
          <sphereGeometry args={[r, 24, 24]} />
          <meshBasicMaterial color="#070A18" />
        </mesh>
        <sprite scale={[r * 4.2, r * 4.2, 1]}>
          <spriteMaterial map={glow} color="#C9B27A" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    );
  }
  return (
    <group rotation={[0, 0, graha.tilt ?? 0]}>
      <mesh>
        <sphereGeometry args={[r, segs, segs]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>
      {ringGeo && rings && (
        <mesh geometry={ringGeo} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial map={rings} transparent side={THREE.DoubleSide} depthWrite={false} roughness={1} />
        </mesh>
      )}
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

type ArmillaryProps = { reduced: boolean; lite: boolean; selected: string | null; onSelect: (name: string | null) => void };

function Armillary({ reduced, lite, selected, onSelect }: ArmillaryProps) {
  const root = useRef<THREE.Group>(null);
  const planets = useRef<THREE.Group>(null);
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const sunLight = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState<string | null>(null);
  // Orbit clock: stopped while a graha is hovered (so it can't slide out from under
  // the cursor before the click), crawling while one is selected.
  const orbitTime = useRef(0);
  const orbitSpeed = useRef(1);
  const glow = useMemo(glowTexture, []);
  const halo = useMemo(haloTexture, []);
  const segs = lite ? 32 : 56;
  const textures = useLoader(THREE.TextureLoader, TEX_URLS);
  const maps = useMemo(() => {
    const out: Record<string, THREE.Texture> = {};
    TEX_URLS.forEach((url, i) => {
      const tex = textures[i];
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      out[url.split('/').pop()!.replace(/\.(webp|png)$/, '')] = tex;
    });
    return out;
  }, [textures]);
  const ringTex = maps['saturn-rings'];
  const atmosphere = useMemo(atmosphereMaterial, []);

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
    // The soft disc map keeps each star round: unmapped points draw as squares.
    const mat = new THREE.PointsMaterial({ color: STARLIGHT, map: glow, size: 0.21, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false });
    // Cap the size, or a star drifting close to the camera swells into a blob.
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>', 'gl_PointSize = min(gl_PointSize, 7.0);\n#include <fog_vertex>');
    };
    return new THREE.Points(geo, mat);
  }, [lite, glow]);

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
      halo.dispose();
      atmosphere.dispose();
    },
    [rings, stars, glow, halo, atmosphere],
  );

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = 'pointer';
    return () => void (document.body.style.cursor = '');
  }, [hovered]);

  const hit = (name: string) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(name === selected ? null : name);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(name);
    },
    onPointerOut: () => setHovered((h) => (h === name ? null : h)),
  });

  useFrame((_, delta) => {
    const g = root.current;
    if (!g) return;
    const { px, py } = useScroll.getState();
    const heroH = window.innerHeight || 800;
    const scroll = Math.min(1, Math.max(0, window.scrollY / heroH));
    orbitSpeed.current = hovered ? 0 : THREE.MathUtils.damp(orbitSpeed.current, selected ? 0.06 : 1, 4, delta);
    orbitTime.current += delta * orbitSpeed.current;
    const drift = reduced ? 0 : orbitTime.current * 0.035;
    // Damped pointer tilt; scroll turns the sphere and dollies back. Held still while hovering a graha.
    if (!hovered) {
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.42 + py * 0.12 + scroll * 0.35, 3, delta);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5 + drift + px * 0.22 + scroll * 0.9, 3, delta);
    }
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 13 + scroll * 4, 3, delta);
    if (planets.current) {
      planets.current.children.forEach((child, i) => {
        const gr = GRAHAS[i];
        // One real year ≈ 40 s of animation; keeps the Moon visibly moving.
        const a = gr.phase + (reduced ? 0 : (orbitTime.current * 9.1) / gr.period);
        child.position.set(Math.cos(a) * ORBIT, 0, Math.sin(a) * ORBIT);
        const body = child.children[0];
        if (body && !reduced) body.rotation.y += gr.spin * delta * orbitSpeed.current;
      });
      // The Sun is the light: every body shows its true phase.
      const sun = planets.current.children[0];
      if (sun && sunLight.current) sunLight.current.position.copy(sun.position);
    }
    if (earth.current && !reduced) earth.current.rotation.y += 0.08 * delta;
    if (clouds.current && !reduced) clouds.current.rotation.y += 0.1 * delta;
  });

  return (
    <group ref={root} rotation={[0.42, -0.5, 0]}>
      <primitive object={rings} />
      <pointLight ref={sunLight} color="#FFF1DA" intensity={2.6} decay={0} />
      <ambientLight intensity={0.07} color="#9FB0FF" />
      <group ref={planets}>
        {GRAHAS.map((gr) => {
          const ringed = selected === gr.name || hovered === gr.name;
          const haloSize = Math.max(gr.size * 3.2, 0.42) * (gr.rings ? 1.45 : 1);
          return (
            <group key={gr.name} position={[Math.cos(gr.phase) * ORBIT, 0, Math.sin(gr.phase) * ORBIT]}>
              {/* Body stays children[0]: useFrame spins it. */}
              <Body graha={gr} segs={segs} map={gr.tex ? maps[gr.tex] : undefined} rings={gr.rings ? ringTex : undefined} glow={glow} />
              <mesh visible={false} {...hit(gr.name)}>
                <sphereGeometry args={[Math.max(gr.size * 1.8, 0.24), 12, 12]} />
              </mesh>
              {ringed && (
                <sprite scale={[haloSize, haloSize, 1]}>
                  <spriteMaterial map={halo} color={GOLD_SOFT} transparent opacity={selected === gr.name ? 0.95 : 0.5} depthWrite={false} />
                </sprite>
              )}
            </group>
          );
        })}
      </group>
      {/* The observer at the centre: Vedic astrology is geocentric. */}
      <group rotation={[0, 0, 0.41]}>
        <mesh ref={earth}>
          <sphereGeometry args={[0.42, segs, segs]} />
          <meshStandardMaterial map={maps.earth} roughness={0.85} metalness={0} />
        </mesh>
        <mesh ref={clouds}>
          <sphereGeometry args={[0.428, segs, segs]} />
          <meshStandardMaterial map={maps['earth-clouds']} transparent depthWrite={false} roughness={1} />
        </mesh>
        <mesh scale={1.1}>
          <sphereGeometry args={[0.42, segs, segs]} />
          <primitive object={atmosphere} attach="material" />
        </mesh>
      </group>
      <primitive object={stars} />
    </group>
  );
}

type SceneProps = {
  active: boolean;
  reduced: boolean;
  lite: boolean;
  onReady: () => void;
  selected: string | null;
  onSelect: (name: string | null) => void;
};

export default function CelestialScene({ active, reduced, lite, onReady, selected, onSelect }: SceneProps) {
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 13], fov: 38 }}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      aria-hidden
      // Clicking empty sky closes the planet card.
      onPointerMissed={() => onSelect(null)}
    >
      <Suspense fallback={null}>
        <Armillary reduced={reduced} lite={lite} selected={selected} onSelect={onSelect} />
        {/* Mounts once every texture has loaded: only then fade the canvas in. */}
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
