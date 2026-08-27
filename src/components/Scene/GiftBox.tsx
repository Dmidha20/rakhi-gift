import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  type Group,
  type Mesh,
  type PointLight,
} from "three";

type GiftBoxProps = {
  isOpen: boolean;
  onOpen: () => void;
};

// Procedural soft-feathered circular glow sprite texture for magical sparks
function createGlowSpriteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.18, "rgba(255, 220, 110, 0.98)");
  gradient.addColorStop(0.45, "rgba(255, 160, 20, 0.65)");
  gradient.addColorStop(0.75, "rgba(255, 110, 0, 0.22)");
  gradient.addColorStop(1, "rgba(255, 90, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Procedural 4-point golden star glint sprite texture (matching reference image sparkles)
function createStarSpriteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Soft central glow
  const radial = ctx.createRadialGradient(64, 64, 0, 64, 64, 48);
  radial.addColorStop(0, "rgba(255, 255, 255, 1)");
  radial.addColorStop(0.3, "rgba(255, 225, 130, 0.8)");
  radial.addColorStop(0.7, "rgba(255, 150, 20, 0.2)");
  radial.addColorStop(1, "rgba(255, 100, 0, 0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 128, 128);

  // Vertical light beam
  const vGrad = ctx.createLinearGradient(0, 0, 0, 128);
  vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  vGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.ellipse(64, 64, 3, 56, 0, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal light beam
  const hGrad = ctx.createLinearGradient(0, 0, 128, 0);
  hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  hGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.ellipse(64, 64, 56, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Premium materials matching the reference candle-lit ivory and burgundy keepsake
const boxMaterial = {
  color: "#fbf6ed",
  roughness: 0.28,
  metalness: 0.05,
};

const interiorMaterial = {
  color: "#f7f1e6",
  roughness: 0.38,
  metalness: 0.02,
};

const rimMaterial = {
  color: "#e8dcce",
  roughness: 0.22,
  metalness: 0.14,
};

const ribbonMaterial = {
  color: "#6e1226",
  roughness: 0.18,
  metalness: 0.26,
};

const goldCharmMaterial = {
  color: "#e5b955",
  roughness: 0.12,
  metalness: 0.95,
};

function RibbonBody() {
  return (
    <group>
      {/* Front & Back Ribbon vertical strips */}
      <mesh position={[0, 0, 1.03]} castShadow>
        <boxGeometry args={[0.22, 1.04, 0.02]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      <mesh position={[0, 0, -1.03]} castShadow>
        <boxGeometry args={[0.22, 1.04, 0.02]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      {/* Left & Right Ribbon vertical strips */}
      <mesh position={[1.13, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 1.04, 0.22]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      <mesh position={[-1.13, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 1.04, 0.22]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      {/* Bottom Ribbon cross */}
      <mesh position={[0, -0.52, 0]} receiveShadow>
        <boxGeometry args={[0.22, 0.015, 2.04]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      <mesh position={[0, -0.52, 0]} receiveShadow>
        <boxGeometry args={[2.24, 0.015, 0.22]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
    </group>
  );
}

function BoxBody() {
  return (
    <group>
      {/* Main outer ivory rounded box */}
      <RoundedBox
        args={[2.25, 1.04, 2.05]}
        radius={0.06}
        smoothness={5}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...boxMaterial} />
      </RoundedBox>

      {/* Subtle top rim seam */}
      <RoundedBox
        args={[2.27, 0.04, 2.07]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.51, 0]}
        castShadow
      >
        <meshStandardMaterial {...rimMaterial} />
      </RoundedBox>

      {/* Interior cavity - soft ivory satin lining */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.08, 0.42, 1.88]} />
        <meshStandardMaterial {...interiorMaterial} />
      </mesh>

      <RibbonBody />
    </group>
  );
}

// Delicate gold heart charm hanging from the ribbon knot
function HeartCharm() {
  return (
    <group position={[0, -0.075, 0.135]} scale={0.72}>
      {/* Small golden suspension ring */}
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.035, 0.008, 12, 24]} />
        <meshStandardMaterial {...goldCharmMaterial} />
      </mesh>

      {/* Heart Shape Pendant */}
      <group position={[0, 0, 0]}>
        {/* Left lobe */}
        <mesh position={[-0.04, 0.03, 0]} castShadow>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial {...goldCharmMaterial} />
        </mesh>
        {/* Right lobe */}
        <mesh position={[0.04, 0.03, 0]} castShadow>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial {...goldCharmMaterial} />
        </mesh>
        {/* Bottom cone / tip */}
        <mesh position={[0, -0.025, 0]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.082, 0.095, 16]} />
          <meshStandardMaterial {...goldCharmMaterial} />
        </mesh>
        {/* Ivory enamel inlay in center */}
        <mesh position={[0, 0.008, 0.012]} scale={[0.65, 0.65, 0.5]}>
          <coneGeometry args={[0.07, 0.08, 16]} />
          <meshStandardMaterial
            color="#fffcf5"
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

function Bow() {
  return (
    <group position={[0, 0.12, 0]} scale={0.8}>
      {/* Left Main Loop */}
      <mesh position={[-0.24, 0.05, 0]} rotation={[0.08, 0, -0.56]} castShadow>
        <torusGeometry args={[0.22, 0.052, 16, 32, Math.PI * 1.75]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      {/* Right Main Loop */}
      <mesh position={[0.24, 0.05, 0]} rotation={[0.08, 0, 0.56]} castShadow>
        <torusGeometry args={[0.22, 0.052, 16, 32, Math.PI * 1.75]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>

      {/* Front-left trailing ribbon tail */}
      <mesh
        position={[-0.26, -0.06, 0.28]}
        rotation={[0.32, -0.45, -0.15]}
        castShadow
      >
        <boxGeometry args={[0.18, 0.015, 0.55]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>
      {/* Front-right trailing ribbon tail */}
      <mesh
        position={[0.26, -0.06, 0.28]}
        rotation={[0.32, 0.45, 0.15]}
        castShadow
      >
        <boxGeometry args={[0.18, 0.015, 0.55]} />
        <meshStandardMaterial {...ribbonMaterial} />
      </mesh>

      {/* Center Ribbon Knot */}
      <RoundedBox
        args={[0.2, 0.14, 0.16]}
        radius={0.035}
        smoothness={3}
        position={[0, 0.02, 0]}
        castShadow
      >
        <meshStandardMaterial {...ribbonMaterial} />
      </RoundedBox>

      {/* Gold Heart Charm hanging from the knot */}
      <HeartCharm />
    </group>
  );
}

function Lid({ isOpen }: { isOpen: boolean }) {
  const hinge = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!hinge.current) return;
    const easing = Math.min(delta * 2.8, 1);
    // Smooth rear hinge rotation: ~62 degrees from closed position
    const targetRotation = isOpen ? -1.08 : 0;
    hinge.current.rotation.x +=
      (targetRotation - hinge.current.rotation.x) * easing;
  });

  return (
    // Rear hinge pivot precisely at top rear edge of the box body
    <group ref={hinge} position={[0, 0.525, -1.025]}>
      {/* Lid content positioned forward along +Z from the hinge */}
      <group position={[0, 0.075, 1.025]}>
        {/* Lid Box */}
        <RoundedBox
          args={[2.32, 0.15, 2.12]}
          radius={0.05}
          smoothness={5}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial {...boxMaterial} />
        </RoundedBox>

        {/* Lid Top Ribbons */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.22, 0.015, 2.1]} />
          <meshStandardMaterial {...ribbonMaterial} />
        </mesh>
        <mesh position={[0, 0.082, 0]} castShadow>
          <boxGeometry args={[2.3, 0.015, 0.22]} />
          <meshStandardMaterial {...ribbonMaterial} />
        </mesh>

        {/* Bow and Charm on top of lid */}
        <Bow />
      </group>
    </group>
  );
}

// 55 luminous golden/amber sparks & 4-point star glints rising naturally from inside
function InnerLightMotes({ isOpen }: { isOpen: boolean }) {
  const group = useRef<Group>(null);
  const glowTexture = useMemo(() => createGlowSpriteTexture(), []);
  const starTexture = useMemo(() => createStarSpriteTexture(), []);

  const motes = useMemo(() => {
    const colors = [
      "#ffffff",
      "#ffe8a3",
      "#ffca28",
      "#ffa000",
      "#ffd54f",
      "#ffb300",
      "#ff9800",
    ];

    return Array.from({ length: 55 }, (_, i) => {
      const isStar = i % 4 === 0;
      const isFocal = i % 6 === 0;
      return {
        baseX: Math.sin(i * 1.55) * (0.24 + (i % 5) * 0.08),
        baseZ: Math.cos(i * 1.95) * (0.22 + (i % 4) * 0.08),
        speed: 0.42 + (i % 7) * 0.1,
        offset: i * 0.38,
        scale: isStar
          ? 0.055 + (i % 4) * 0.016
          : isFocal
            ? 0.042 + (i % 3) * 0.015
            : 0.018 + (i % 4) * 0.01,
        color: colors[i % colors.length],
        swirlSpeed: 0.85 + (i % 4) * 0.4,
        swirlRadius: 0.045 + (i % 4) * 0.03,
        maxAlpha: isStar ? 0.95 : isFocal ? 0.85 : 0.68,
        isStar,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const mote = motes[i];
      // Vertical float distance: 0.35 to 2.35 above the box floor
      const y = ((t * mote.speed + mote.offset) % 2.0) + 0.35;
      const normY = (y - 0.35) / 2.0;

      // Gentle conical upward dispersion
      const spreadFactor = 1.0 + normY * 1.35;
      const swirl = t * mote.swirlSpeed + i;

      child.position.set(
        mote.baseX * spreadFactor + Math.sin(swirl) * mote.swirlRadius,
        y,
        mote.baseZ * spreadFactor + Math.cos(swirl) * mote.swirlRadius,
      );

      const mesh = child as Mesh;
      if (mesh.material) {
        const alpha = isOpen ? Math.sin(normY * Math.PI) * mote.maxAlpha : 0;
        (mesh.material as unknown as { opacity: number }).opacity = Math.max(
          0,
          alpha,
        );
      }
    });
  });

  return (
    <group ref={group}>
      {motes.map((mote, i) => (
        <mesh key={i} scale={mote.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={mote.isStar ? starTexture : glowTexture}
            color={mote.color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GiftBox({ isOpen, onOpen }: GiftBoxProps) {
  const group = useRef<Group>(null);
  const innerPointLight = useRef<PointLight>(null);
  const lidWashLight = useRef<PointLight>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;

    // Subtle gentle idle breathing rotation
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.24) * 0.025;

    // Pure warm golden light transition (gentle, warm romantic illumination)
    if (innerPointLight.current) {
      const targetIntensity = isOpen ? 5.5 : 0;
      innerPointLight.current.intensity +=
        (targetIntensity - innerPointLight.current.intensity) *
        Math.min(delta * 2.8, 1);
    }

    // Soft wash light for open lid underside (subtle warm fill, no blowout)
    if (lidWashLight.current) {
      const targetLidWash = isOpen ? 2.2 : 0;
      lidWashLight.current.intensity +=
        (targetLidWash - lidWashLight.current.intensity) *
        Math.min(delta * 2.8, 1);
    }
  });

  return (
    <group
      ref={group}
      position={[0, 0, 0]}
      onClick={onOpen}
      onPointerOver={(event) => event.stopPropagation()}
    >
      <BoxBody />

      {/* Core warm amber/golden light radiating from inside the open box */}
      <pointLight
        ref={innerPointLight}
        position={[0, 0.45, 0]}
        color="#ffa726"
        intensity={0}
        distance={3.6}
        decay={2}
      />

      {/* Soft warm golden wash light illuminating the open lid underside */}
      <pointLight
        ref={lidWashLight}
        position={[0, 0.95, -0.15]}
        color="#ffd54f"
        intensity={0}
        distance={3.0}
        decay={2}
      />

      {/* Luminous rising golden sparks & star glints */}
      <InnerLightMotes isOpen={isOpen} />

      {/* Physical lid hinged at rear edge */}
      <Lid isOpen={isOpen} />
    </group>
  );
}
