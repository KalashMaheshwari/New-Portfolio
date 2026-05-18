import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree, extend, ThreeElement } from '@react-three/fiber';
import { PerspectiveCamera, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const DATA = [
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E', category: 'Frontend' },
  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', color: '#3178C6', category: 'Frontend' },
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB', category: 'Frontend' },
  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/ffffff', color: '#ffffff', category: 'Frontend' },
  { name: 'GSAP', icon: 'https://cdn.simpleicons.org/greensock/88CE02', color: '#88CE02', category: 'Frontend' },
  { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer/0055FF', color: '#0055FF', category: 'Frontend' },
  { name: 'Three.js', icon: 'https://cdn.simpleicons.org/threedotjs/ffffff', color: '#ffffff', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', color: '#06B6D4', category: 'Frontend' },
  { name: 'Redux', icon: 'https://cdn.simpleicons.org/redux/764ABC', color: '#764ABC', category: 'Frontend' },
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB', color: '#3776AB', category: 'Backend' },
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933', color: '#339933', category: 'Backend' },
  { name: 'Express', icon: 'https://cdn.simpleicons.org/express/ffffff', color: '#ffffff', category: 'Backend' },
  { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D', color: '#DC382D', category: 'Backend' },
  { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/3ECF8E', color: '#3ECF8E', category: 'Backend' },
  { name: 'Prisma', icon: 'https://cdn.simpleicons.org/prisma/ffffff', color: '#ffffff', category: 'Backend' },
  { name: 'SQL', icon: 'https://cdn.simpleicons.org/sqlite/003B57', color: '#003B57', category: 'Database' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248', category: 'Database' },
  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1', color: '#4169E1', category: 'Database' },
  { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032', color: '#F05032', category: 'Tools' },
  { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED', color: '#2496ED', category: 'Tools' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', color: '#007ACC', category: 'Tools' },
  { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E', color: '#F24E1E', category: 'Tools' },
  { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux/FCC624', color: '#FCC624', category: 'Tools' },
  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/ffffff', color: '#ffffff', category: 'Tools' },
];

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools'];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Frontend: 'Crafting pixel-perfect interfaces with modern frameworks and animation libraries.',
  Backend: 'Building robust server architectures, APIs, and scalable infrastructure.',
  Database: 'Designing efficient data models across relational and document stores.',
  Tools: 'Leveraging industry-standard tooling for development, deployment, and design.',
};

/* ═══════════════════════════════════════════
   SVG TO TRANSLUCENT HEXAGON CANVAS TEXTURE
   ═══════════════════════════════════════════ */
const textureCache = new Map<string, THREE.CanvasTexture>();

function drawHexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function loadSvgTexture(url: string, color: string): Promise<THREE.CanvasTexture> {
  const cacheKey = url + color + '_v3';
  if (textureCache.has(cacheKey)) {
    return Promise.resolve(textureCache.get(cacheKey)!);
  }

  return new Promise((resolve) => {
    fetch(url)
      .then((res) => res.text())
      .then((svgText) => {
        const size = 512;
        // Fix for empty icons: ensure SVG has viewBox and dimensions
        if (!svgText.includes('viewBox')) {
          svgText = svgText.replace('<svg', '<svg viewBox="0 0 24 24"');
        }
        if (!svgText.includes('width=') || !svgText.includes('height=')) {
          svgText = svgText.replace('<svg', `<svg width="${size}" height="${size}"`);
        }

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const cx = size / 2;
        const cy = size / 2;
        const hexR = size * 0.42;

        // Outer soft glow behind hex
        const outerGlow = ctx.createRadialGradient(cx, cy, hexR * 0.5, cx, cy, hexR * 1.3);
        outerGlow.addColorStop(0, color + '18');
        outerGlow.addColorStop(0.6, color + '08');
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.fillRect(0, 0, size, size);

        // Translucent hex background — glass/frosted effect
        drawHexPath(ctx, cx, cy, hexR);
        const bgGrad = ctx.createLinearGradient(cx - hexR, cy - hexR, cx + hexR, cy + hexR);
        bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
        bgGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)');
        bgGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
        bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        ctx.fillStyle = bgGrad;
        ctx.fill();

        // Top highlight — glass reflection
        drawHexPath(ctx, cx, cy - 2, hexR - 6);
        ctx.save();
        ctx.clip();
        const reflectGrad = ctx.createLinearGradient(cx, cy - hexR, cx, cy - hexR * 0.1);
        reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        reflectGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)');
        reflectGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = reflectGrad;
        ctx.fillRect(0, 0, size, size);
        ctx.restore();

        // Hex border — vibrant outline matching icon color
        drawHexPath(ctx, cx, cy, hexR);
        const borderGrad = ctx.createLinearGradient(cx - hexR, cy - hexR, cx + hexR, cy + hexR);
        borderGrad.addColorStop(0, color);
        borderGrad.addColorStop(0.5, color + '80');
        borderGrad.addColorStop(1, color);
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Inner subtle edge
        drawHexPath(ctx, cx, cy, hexR - 8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const iconSize = size * 0.34;
          const offset = (size - iconSize) / 2;
          ctx.shadowColor = color + '50';
          ctx.shadowBlur = 18;
          ctx.drawImage(img, offset, offset, iconSize, iconSize);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          URL.revokeObjectURL(blobUrl);

          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          textureCache.set(cacheKey, texture);
          resolve(texture);
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          textureCache.set(cacheKey, texture);
          resolve(texture);
        };
        img.src = blobUrl;
      })
      .catch(() => {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        drawHexPath(ctx, size / 2, size / 2, size * 0.42);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        ctx.stroke();
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        textureCache.set(cacheKey, texture);
        resolve(texture);
      });
  });
}

/* ═══════════════════════════════════════════
   CUSTOM SHADER — ENERGY FIELD
   ═══════════════════════════════════════════ */
const EnergyFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#FF6B00'),
    uOpacity: 0.15,
  },
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      float pulse = sin(vPosition.y * 3.0 + uTime * 1.5) * 0.5 + 0.5;
      float wave = sin(vPosition.x * 2.0 + vPosition.z * 2.0 + uTime * 0.8) * 0.5 + 0.5;
      float grid = smoothstep(0.48, 0.5, abs(fract(vPosition.y * 1.5 + uTime * 0.1) - 0.5));
      grid += smoothstep(0.48, 0.5, abs(fract(vPosition.x * 1.5) - 0.5));
      grid = clamp(grid, 0.0, 1.0);
      float n = noise(vUv * 20.0 + uTime * 0.05);
      float alpha = fresnel * uOpacity * (0.5 + pulse * 0.3 + wave * 0.2);
      alpha += grid * 0.03 * fresnel;
      alpha += n * 0.01;
      vec3 col = uColor * (0.8 + pulse * 0.4);
      gl_FragColor = vec4(col, alpha);
    }
  `
);

extend({ EnergyFieldMaterial });

// Type declarations for custom R3F elements
declare module '@react-three/fiber' {
  interface ThreeElements {
    energyFieldMaterial: ThreeElement<typeof EnergyFieldMaterial>;
  }
}

/* ═══════════════════════════════════════════
   ENERGY PARTICLES
   ═══════════════════════════════════════════ */
const EnergyParticles = ({ radius, count = 180 }: { radius: number; count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      color.setHSL(0.06 + Math.random() * 0.04, 0.8 + Math.random() * 0.2, 0.5 + Math.random() * 0.3);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [radius, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      const speed = 0.3 + (i % 5) * 0.05;
      const angle = time * speed * 0.1;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      posAttr.setXYZ(
        i,
        x * cosA - z * sinA + Math.sin(time * 0.5 + i) * 0.04,
        y + Math.sin(time * 0.7 + i * 0.3) * 0.06,
        x * sinA + z * cosA + Math.cos(time * 0.5 + i) * 0.04
      );
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ═══════════════════════════════════════════
   FLOATING AMBIENT PARTICLES
   ═══════════════════════════════════════════ */
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.12;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FF6B00"
        transparent
        opacity={0.18}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ═══════════════════════════════════════════
   CONNECTION LINES
   ═══════════════════════════════════════════ */
const ConnectionLines = ({ positions: iconPositions, radius }: { positions: [number, number, number][]; radius: number }) => {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3; opacity: number }[] = [];
    const threshold = radius * 1.1;
    for (let i = 0; i < iconPositions.length; i++) {
      for (let j = i + 1; j < iconPositions.length; j++) {
        const a = new THREE.Vector3(...iconPositions[i]);
        const b = new THREE.Vector3(...iconPositions[j]);
        const dist = a.distanceTo(b);
        if (dist < threshold) {
          conns.push({ start: a, end: b, opacity: Math.max(0, 1 - dist / threshold) * 0.12 });
        }
      }
    }
    return conns;
  }, [iconPositions, radius]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (connections[i]) {
          const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
          const pulse = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.5) * 0.5 + 0.5;
          mat.opacity = connections[i].opacity * (0.5 + pulse * 0.5);
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([conn.start, conn.end]);
        // Using any to bypass the SVG <line> tag conflict in React 19 / TypeScript
        const LineTag = 'line' as any;
        return (
          <LineTag key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#FF6B00"
              transparent
              opacity={conn.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </LineTag>
        );
      })}
    </group>
  );
};

/* ═══════════════════════════════════════════
   ORBITAL RING
   ═══════════════════════════════════════════ */
const OrbitalRing = ({
  radius,
  rotation,
  speed = 1,
  color = '#FF6B00',
  opacity = 0.1,
}: {
  radius: number;
  rotation: [number, number, number];
  speed?: number;
  color?: string;
  opacity?: number;
}) => {
  const dotRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed * 0.5;
    if (dotRef.current) {
      dotRef.current.position.x = Math.cos(t) * radius;
      dotRef.current.position.z = Math.sin(t) * radius;
    }
    if (glowRef.current) {
      glowRef.current.position.x = Math.cos(t) * radius;
      glowRef.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <group rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 8, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════
   PULSING CORE
   ═══════════════════════════════════════════ */
const PulsingCore = ({ radius }: { radius: number }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.025 + Math.sin(t * 2) * 0.012;
    }
    if (outerRef.current) {
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.012 + Math.sin(t * 1.2) * 0.006;
      outerRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
    }
  });

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius * 0.12, 32, 32]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 0.45, 32, 32]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.025} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[radius * 0.8, 32, 32]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.012} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
};

/* ═══════════════════════════════════════════
   SPHERE FACE ICON — translucent hex
   ═══════════════════════════════════════════ */
const SphereFaceIcon = ({
  url,
  color,
  position,
  index,
}: {
  url: string;
  color: string;
  position: [number, number, number];
  index: number;
}) => {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const baseScale = 1.6;

  useEffect(() => {
    let cancelled = false;
    loadSvgTexture(url, color).then((tex) => {
      if (!cancelled) setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, [url, color]);

  useFrame((state) => {
    if (spriteRef.current) {
      const t = state.clock.elapsedTime;
      const breathe = 1 + Math.sin(t * 1.2 + index * 0.7) * 0.035;
      spriteRef.current.scale.setScalar(baseScale * breathe);
      const mat = spriteRef.current.material as THREE.SpriteMaterial;
      mat.opacity = 0.82 + Math.sin(t * 0.8 + index * 1.3) * 0.08;
    }
  });

  if (!texture) return null;

  return (
    <sprite ref={spriteRef} position={position} scale={[baseScale, baseScale, baseScale]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.85}
        depthWrite={false}
        depthTest={true}
        sizeAttenuation={true}
        blending={THREE.NormalBlending}
      />
    </sprite>
  );
};

/* ═══════════════════════════════════════════
   EDGE SPHERE — SMALLER, pushed further right
   ═══════════════════════════════════════════ */
const EdgeSphere = () => {
  const groupRef = useRef<THREE.Group>(null);
  const energyRef = useRef<any>(null);
  const { viewport } = useThree();

  const SPHERE_RADIUS = 6.5;
  // Push further to the right edge so only ~40-50% is visible
  const xPos = viewport.width / 2 + 2.5;

  const iconPlacements = useMemo(() => {
    const placements: { position: [number, number, number]; url: string; color: string }[] = [];
    const count = DATA.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const px = SPHERE_RADIUS * radiusAtY * Math.cos(theta);
      const py = SPHERE_RADIUS * y;
      const pz = SPHERE_RADIUS * radiusAtY * Math.sin(theta);

      placements.push({
        position: [px, py, pz],
        url: DATA[i].icon,
        color: DATA[i].color,
      });
    }
    return placements;
  }, []);

  const iconPositions = useMemo(() => iconPlacements.map((p) => p.position), [iconPlacements]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0018;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.25;
    }
    if (energyRef.current) {
      energyRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef} position={[xPos, 0, -2]}>
      {/* Energy field */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 64, 32]} />
        <energyFieldMaterial
          ref={energyRef}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Icosahedron wireframe */}
      <mesh>
        <icosahedronGeometry args={[SPHERE_RADIUS * 1.01, 2]} />
        <meshBasicMaterial
          color="#FF6B00"
          wireframe
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <PulsingCore radius={SPHERE_RADIUS} />

      {/* Orbital rings — scaled to smaller sphere */}
      <OrbitalRing radius={SPHERE_RADIUS + 0.4} rotation={[Math.PI / 2, 0, 0]} speed={1.2} opacity={0.07} />
      <OrbitalRing radius={SPHERE_RADIUS + 0.7} rotation={[Math.PI / 3, Math.PI / 6, 0]} speed={0.8} color="#FF8C40" opacity={0.045} />
      <OrbitalRing radius={SPHERE_RADIUS + 1.0} rotation={[Math.PI / 4, -Math.PI / 4, Math.PI / 6]} speed={0.5} color="#FF4500" opacity={0.035} />

      <ConnectionLines positions={iconPositions} radius={SPHERE_RADIUS} />
      <EnergyParticles radius={SPHERE_RADIUS + 0.4} count={160} />

      {iconPlacements.map((item, i) => (
        <SphereFaceIcon key={i} url={item.url} color={item.color} position={item.position} index={i} />
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════
   BACKGROUND ICON SPHERE
   ═══════════════════════════════════════════ */
const IconNode = ({ url, position }: { url: string; position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position.x) * 0.002;
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

const IconSphere = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const iconPositions = useMemo(() => {
    const items = [];
    const count = DATA.length;
    const radius = 9;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      items.push({
        pos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        url: DATA[i].icon,
      });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[viewport.width > 10 ? 15 : 0, 0, 0]}>
      {iconPositions.map((item, i) => (
        <IconNode key={i} url={item.url} position={item.pos} />
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════
   SCENE SETUP
   ═══════════════════════════════════════════ */
const SceneSetup = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#1a1a1a', 0.012);
  }, [scene]);
  return null;
};

/* ═══════════════════════════════════════════
   TECH CARD COMPONENT
   ═══════════════════════════════════════════ */
const TechCard = ({ tech, index }: { tech: (typeof DATA)[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex items-center gap-4 cursor-default overflow-hidden"
      style={{
        padding: '12px 28px 12px 16px',
        borderRadius: '16px',
        background: isHovered
          ? `linear-gradient(135deg, ${tech.color}08, ${tech.color}03)`
          : 'rgba(255,255,255,0.02)',
        border: isHovered ? `1px solid ${tech.color}30` : '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 50%, ${tech.color}10, transparent 70%)` }}
      />
      <div
        className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-500"
        style={{
          background: isHovered ? `${tech.color}12` : 'rgba(255,255,255,0.03)',
          border: isHovered ? `1px solid ${tech.color}25` : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <img
          src={tech.icon}
          alt={tech.name}
          className="w-5 h-5 object-contain transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0.55,
            filter: isHovered ? `drop-shadow(0 0 8px ${tech.color}40)` : 'none',
          }}
        />
      </div>
      <span
        className="relative text-[13.5px] font-mono tracking-wide whitespace-nowrap transition-colors duration-500"
        style={{ color: isHovered ? '#ffffff' : '#737373' }}
      >
        {tech.name}
      </span>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('Frontend');

  const filteredData = useMemo(() => DATA.filter((tech) => tech.category === activeCategory), [activeCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      tl.fromTo('.tech-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      tl.fromTo('.tech-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, '-=0.4');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div aria-hidden="true" className="w-full h-24 md:h-32 lg:h-40" />

      <section
        ref={sectionRef}
        id="tech-stack"
        className="relative w-full bg-[#1a1a1a] flex flex-col overflow-hidden py-[160px] md:py-[200px] max-md:py-[80px]"
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B00]/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.015] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#FF6B00]/[0.015] rounded-full blur-[180px] pointer-events-none translate-x-1/3 -translate-y-1/2" />

        {/* 3D Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 max-md:hidden">
          <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={35} />
            <ambientLight intensity={1.5} />
            <Suspense fallback={null}>
              <SceneSetup />
              <IconSphere />
              <FloatingParticles />
              <EdgeSphere />
            </Suspense>
          </Canvas>
        </div>

        {/* Sphere edge glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-[1]"
          style={{
            right: '-60px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, rgba(255,69,0,0.02) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full flex px-6 md:px-12 lg:px-0 max-md:!px-10 max-md:box-border">
          <div className="hidden lg:block" style={{ width: '140px', minWidth: '140px' }} />

          <div className="flex-1 max-w-3xl">
            <div className="tech-reveal flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-20">
              <div className="flex flex-col gap-5 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-[1.5px] bg-[#FF6B00]" />
                  <span className="text-[11px] font-mono tracking-[0.5em] uppercase text-neutral-500">Expertise</span>
                </div>
                <h2
                  className="text-6xl md:text-8xl lg:text-[7vw] text-white font-normal tracking-tight leading-[0.85]"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  TECH{' '}
                  <span className="opacity-20 italic font-light" style={{ fontFamily: 'Vogjer, serif' }}>
                    Stack
                  </span>
                </h2>
              </div>

              <div className="lg:pt-12 lg:max-w-[280px] flex-shrink-0">
                <p className="text-neutral-500 font-mono text-[12px] leading-[1.8] tracking-wide">
                  A curated selection of technologies utilized to architect modern digital experiences — from interactive frontends to resilient backend systems.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[32px] font-light text-[#FF6B00]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {DATA.length}+
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">Technologies</span>
                </div>
              </div>
            </div>

            <div className="h-16" />
            <div className="tech-line w-full h-[1px] bg-gradient-to-r from-[#FF6B00]/40 via-white/10 to-transparent origin-left" />
            <div className="h-12" />

            <div className="tech-reveal">
              <div className="flex flex-wrap items-center gap-6 md:gap-10">
                {CATEGORIES.map((cat, idx) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className="group relative flex items-center gap-3 py-3 cursor-pointer">
                    <span
                      className={`text-[9px] font-mono transition-all duration-500 ${activeCategory === cat ? 'text-[#FF6B00] scale-110' : 'text-neutral-700 group-hover:text-neutral-500'}`}
                      style={{ fontFamily: 'Vogjer, serif' }}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-[0.3em] transition-all duration-500 ${activeCategory === cat ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-300'}`}
                    >
                      {cat}
                    </span>
                    {activeCategory === cat && (
                      <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-[9px] font-mono text-[#FF6B00]/60 bg-[#FF6B00]/[0.08] px-2 py-0.5 rounded-full">
                        {filteredData.length}
                      </motion.span>
                    )}
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="techActiveUnderline"
                        className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, #FF6B00, #FF6B00 50%, transparent)', boxShadow: '0 0 20px rgba(255,107,0,0.4)' }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="h-5" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeCategory}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-neutral-600 font-mono text-[11px] tracking-wide"
                >
                  {CATEGORY_DESCRIPTIONS[activeCategory]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="h-12" />

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredData.map((tech, i) => (
                    <TechCard key={tech.name} tech={tech} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-16" />

            <div className="tech-reveal">
              <div className="w-full h-[1px] bg-white/[0.04]" />
              <div className="h-8" />
              <div className="flex flex-wrap items-center gap-10 md:gap-16">
                {CATEGORIES.map((cat) => {
                  const count = DATA.filter((d) => d.category === cat).length;
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className="group flex flex-col gap-1.5 cursor-pointer">
                      <span
                        className="text-[28px] font-light transition-colors duration-500"
                        style={{ fontFamily: 'Bebas Neue, sans-serif', color: isActive ? '#FF6B00' : '#333' }}
                      >
                        {count}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-[0.3em] transition-colors duration-500 ${isActive ? 'text-neutral-400' : 'text-neutral-700 group-hover:text-neutral-500'}`}
                      >
                        {cat}
                      </span>
                    </button>
                  );
                })}
                <div className="hidden md:block w-[1px] h-10 bg-white/[0.06]" />
                <div className="flex flex-col gap-1.5 max-md:hidden">
                  <span className="text-[28px] font-light text-white/20" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {DATA.length}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-700">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="w-full h-24 md:h-32 lg:h-40" />
    </>
  );
}