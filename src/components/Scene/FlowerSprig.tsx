import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

// Simple procedural baby's-breath style sprig: thin branches with small white/cream bud clusters
function Branch({
  origin,
  direction,
  length,
  budCount,
}: {
  origin: [number, number, number];
  direction: [number, number, number];
  length: number;
  budCount: number;
}) {
  const buds = useMemo(() => {
    return Array.from({ length: budCount }, (_, i) => {
      const t = (i + 1) / budCount;
      return {
        pos: [
          origin[0] + direction[0] * length * t,
          origin[1] + direction[1] * length * t,
          origin[2] + direction[2] * length * t,
        ] as [number, number, number],
        scale: 0.022 + ((i * 17) % 10) * 0.0018,
      };
    });
  }, [origin, direction, length, budCount]);

  const end: [number, number, number] = [
    origin[0] + direction[0] * length,
    origin[1] + direction[1] * length,
    origin[2] + direction[2] * length,
  ];
  const mid: [number, number, number] = [
    (origin[0] + end[0]) / 2,
    (origin[1] + end[1]) / 2,
    (origin[2] + end[2]) / 2,
  ];

  return (
    <group>
      {/* Thin stem */}
      <mesh position={mid}>
        <cylinderGeometry args={[0.004, 0.006, length, 5]} />
        <meshStandardMaterial color="#6b5a3e" roughness={0.8} />
      </mesh>
      {/* Small cream bud clusters along the stem */}
      {buds.map((bud, i) => (
        <mesh key={i} position={bud.pos} scale={bud.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#faf6ec" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function FlowerSprig({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Gentle sway, like a light breeze
    group.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.35) * 0.02;
  });

  const branches = useMemo(
    () => [
      { dir: [0.3, 1, -0.1], len: 1.1, buds: 6 },
      { dir: [0.55, 0.85, 0.15], len: 0.9, buds: 5 },
      { dir: [0.1, 1, 0.35], len: 0.95, buds: 5 },
      { dir: [0.65, 0.6, -0.25], len: 0.65, buds: 4 },
      { dir: [-0.15, 0.95, -0.3], len: 0.75, buds: 4 },
    ],
    [],
  );

  return (
    <group position={position} scale={scale}>
      {branches.map((b, i) => (
        <Branch
          key={i}
          origin={[0, 0, 0]}
          direction={b.dir as [number, number, number]}
          length={b.len}
          budCount={b.buds}
        />
      ))}
    </group>
  );
}
