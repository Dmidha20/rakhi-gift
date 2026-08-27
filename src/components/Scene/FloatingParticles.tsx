import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type ComponentRef, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  type Group,
  type Mesh,
  type Points as PointsObject,
} from "three";

type FloatingParticlesProps = {
  isOpen: boolean;
};

// Deterministic pseudo-random generator
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const PARTICLE_COUNT = 160;

// Distant soft glowing purple/pink/magenta bokeh orbs (matching festive theme)
function FestiveBokeh() {
  const group = useRef<Group>(null);

  const bokehOrbs = useMemo(() => {
    return [
      {
        x: -3.8,
        y: 2.2,
        z: -5.5,
        scale: 0.95,
        color: "#e040fb",
        baseOpacity: 0.35,
        speed: 0.8,
        phase: 0.2,
      },
      {
        x: 3.6,
        y: 2.6,
        z: -6.2,
        scale: 1.15,
        color: "#ff4081",
        baseOpacity: 0.38,
        speed: 0.6,
        phase: 1.5,
      },
      {
        x: -2.6,
        y: -0.4,
        z: -4.8,
        scale: 0.8,
        color: "#ab47bc",
        baseOpacity: 0.32,
        speed: 0.9,
        phase: 2.7,
      },
      {
        x: 3.2,
        y: 0.2,
        z: -5.0,
        scale: 1.0,
        color: "#ffd54f",
        baseOpacity: 0.3,
        speed: 0.7,
        phase: 3.9,
      },
      {
        x: -4.5,
        y: 0.8,
        z: -6.8,
        scale: 1.35,
        color: "#9c27b0",
        baseOpacity: 0.25,
        speed: 0.5,
        phase: 4.8,
      },
      {
        x: 4.4,
        y: 1.4,
        z: -6.0,
        scale: 0.95,
        color: "#ea80fc",
        baseOpacity: 0.35,
        speed: 0.75,
        phase: 5.4,
      },
      {
        x: -1.2,
        y: 3.4,
        z: -7.2,
        scale: 1.4,
        color: "#e040fb",
        baseOpacity: 0.22,
        speed: 0.45,
        phase: 0.9,
      },
      {
        x: 2.0,
        y: 3.6,
        z: -7.0,
        scale: 1.25,
        color: "#ff80ab",
        baseOpacity: 0.28,
        speed: 0.55,
        phase: 2.1,
      },
      {
        x: -3.2,
        y: -1.4,
        z: -4.5,
        scale: 0.85,
        color: "#ffd700",
        baseOpacity: 0.28,
        speed: 0.85,
        phase: 3.2,
      },
      {
        x: 3.0,
        y: -1.2,
        z: -4.5,
        scale: 0.9,
        color: "#e040fb",
        baseOpacity: 0.32,
        speed: 0.7,
        phase: 1.1,
      },
    ];
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const orb = bokehOrbs[i];
      const mesh = child as Mesh;
      if (mesh.material) {
        const flicker =
          Math.sin(t * orb.speed + orb.phase) * 0.08 +
          Math.sin(t * (orb.speed * 2.1) + orb.phase * 1.4) * 0.04;
        (mesh.material as unknown as { opacity: number }).opacity = Math.max(
          0.05,
          orb.baseOpacity + flicker,
        );
      }
    });
  });

  return (
    <group ref={group}>
      {bokehOrbs.map((orb, i) => (
        <mesh key={i} position={[orb.x, orb.y, orb.z]} scale={orb.scale}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={orb.baseOpacity}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Foreground floating glowing sparkles / dust motes
function ForegroundDustMotes() {
  const pointsRef = useRef<ComponentRef<typeof PointsObject>>(null);

  const positions = useMemo(() => {
    const random = createSeededRandom(999);
    const pos = new Float32Array(55 * 3);

    for (let i = 0; i < 55; i++) {
      const i3 = i * 3;
      pos[i3] = (random() - 0.5) * 6.5;
      pos[i3 + 1] = (random() - 0.5) * 4.5;
      pos[i3 + 2] = 1.8 + random() * 2.8; // Z in [1.8, 4.6]
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < 55; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * 0.6 + i) * 0.0018;
      posArray[i3] += Math.cos(time * 0.4 + i * 0.7) * 0.0012;

      if (posArray[i3 + 1] > 2.8) posArray[i3 + 1] = -2.5;
      if (posArray[i3 + 1] < -2.8) posArray[i3 + 1] = 2.5;
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffd54f"
        size={0.065}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
        opacity={0.65}
      />
    </Points>
  );
}

export function FloatingParticles({ isOpen }: FloatingParticlesProps) {
  const pointsRef = useRef<ComponentRef<typeof PointsObject>>(null);

  const [positions, velocities] = useMemo(() => {
    const random = createSeededRandom(1337);
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (random() - 0.5) * 8.5;
      pos[i3 + 1] = (random() - 0.5) * 6.5;
      pos[i3 + 2] = (random() - 0.5) * 4.5;

      vel[i3] = (random() - 0.5) * 0.0025;
      vel[i3 + 1] = 0.002 + random() * 0.004;
      vel[i3 + 2] = (random() - 0.5) * 0.0025;
    }

    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;
    const speedMultiplier = isOpen ? 1.4 : 1.0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] * speedMultiplier;
      posArray[i3 + 1] += velocities[i3 + 1] * speedMultiplier;
      posArray[i3 + 2] += velocities[i3 + 2] * speedMultiplier;

      if (posArray[i3 + 1] > 3.8) {
        posArray[i3 + 1] = -3.8;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <>
      {/* Background Soft Bokeh Orbs */}
      <FestiveBokeh />

      {/* Midground Floating Golden/Pink Ember Particles */}
      <Points
        ref={pointsRef}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ff80ab"
          size={0.048}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={isOpen ? 0.75 : 0.55}
        />
      </Points>

      {/* Foreground Crisp Floating Particles */}
      <ForegroundDustMotes />
    </>
  );
}
