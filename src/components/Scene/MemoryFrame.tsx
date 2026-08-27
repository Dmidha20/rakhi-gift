import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CanvasTexture,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import type { MemoryItem } from "../../data/memories";

type MemoryFrameProps = {
  memory: MemoryItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  isFocused: boolean;
  onSelect: () => void;
  transitionProgress: number; // 0 to 1
};

// Generates an elegant warm archival keepsake photograph placeholder texture
function createPlaceholderTexture(title: string, date?: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Warm dark espresso to amber radial gradient
  const gradient = ctx.createRadialGradient(256, 230, 40, 256, 256, 320);
  gradient.addColorStop(0, "#4a2820");
  gradient.addColorStop(0.5, "#2a1512");
  gradient.addColorStop(1, "#180c0a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Soft warm golden inner vignette / border
  ctx.strokeStyle = "rgba(224, 180, 120, 0.25)";
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 480);

  // Decorative subtle heart icon
  ctx.font = "42px Georgia, serif";
  ctx.fillStyle = "#dfb478";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("❤️", 256, 195);

  // Elegant script title placeholder
  ctx.font = "italic 32px Georgia, serif";
  ctx.fillStyle = "#f7ede1";
  ctx.fillText(title, 256, 270);

  // Subtle subtitle / date
  if (date) {
    ctx.font = "500 16px -apple-system, sans-serif";
    ctx.fillStyle = "#cca885";
    ctx.letterSpacing = "4px";
    ctx.fillText(date.toUpperCase(), 256, 315);
  }

  // Film grain dots for warm vintage keepsake texture
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.06;
    ctx.fillStyle = `rgba(255, 235, 205, ${alpha})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const frameMaterial = {
  color: "#eae2d5",
  roughness: 0.42,
  metalness: 0.04,
};

const matMaterial = {
  color: "#faf6f0",
  roughness: 0.7,
  metalness: 0.01,
};

const goldRimMaterial = {
  color: "#d4b06e",
  roughness: 0.22,
  metalness: 0.45,
};

const goldPinMaterial = {
  color: "#dfba72",
  roughness: 0.18,
  metalness: 0.85,
};

export function MemoryFrame({
  memory,
  position,
  rotation = [0, 0, 0],
  isFocused,
  onSelect,
  transitionProgress,
}: MemoryFrameProps) {
  const group = useRef<Group>(null);
  const photoMesh = useRef<Mesh>(null);

  const photoTexture = useMemo(() => {
    return createPlaceholderTexture(memory.title, memory.date);
  }, [memory.title, memory.date]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const t = clock.getElapsedTime() + memory.id * 1.5;

    // Organic subtle idle float
    const floatY = Math.sin(t * 0.45) * 0.035;
    const floatRotZ = Math.sin(t * 0.35) * 0.015;
    const floatRotX = Math.cos(t * 0.3) * 0.012;

    // Target positions & scales when focused vs floating
    const targetScale = isFocused ? 1.14 : 1.0;
    const targetPosZ = position[2] + (isFocused ? 0.75 : 0);
    const targetPosY = position[1] + (isFocused ? 0.12 : floatY);
    const targetPosX = position[0];

    const targetRotX = rotation[0] + (isFocused ? 0 : floatRotX);
    const targetRotY = rotation[1] * (isFocused ? 0.25 : 1.0);
    const targetRotZ = rotation[2] + (isFocused ? 0 : floatRotZ);

    const easing = Math.min(delta * 3.0, 1);

    // Apply entrance transition (fades in and rises slightly)
    const entranceScale = Math.min(Math.max(transitionProgress, 0), 1);

    group.current.position.x +=
      (targetPosX - group.current.position.x) * easing;
    group.current.position.y +=
      (targetPosY - group.current.position.y) * easing;
    group.current.position.z +=
      (targetPosZ - group.current.position.z) * easing;

    group.current.rotation.x +=
      (targetRotX - group.current.rotation.x) * easing;
    group.current.rotation.y +=
      (targetRotY - group.current.rotation.y) * easing;
    group.current.rotation.z +=
      (targetRotZ - group.current.rotation.z) * easing;

    const currentScale = targetScale * entranceScale;
    group.current.scale.set(currentScale, currentScale, currentScale);

    if (photoMesh.current && photoMesh.current.material) {
      const mat = photoMesh.current.material as MeshStandardMaterial;
      const targetEmissive = isFocused ? 0.15 : 0;
      mat.emissiveIntensity +=
        (targetEmissive - mat.emissiveIntensity) * easing;
    }
  });

  return (
    <group
      ref={group}
      position={[position[0], position[1] - 0.5, position[2] - 1.0]}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => e.stopPropagation()}
    >
      {/* Outer champagne/ivory beveled wooden frame */}
      <RoundedBox
        args={[1.48, 1.84, 0.04]}
        radius={0.04}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...frameMaterial} />
      </RoundedBox>

      {/* Subtle warm golden mat border */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.36, 1.72]} />
        <meshStandardMaterial {...goldRimMaterial} />
      </mesh>

      {/* Inner archival mat paper */}
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[1.32, 1.68]} />
        <meshStandardMaterial {...matMaterial} />
      </mesh>

      {/* Photograph surface */}
      <mesh ref={photoMesh} position={[0, 0.18, 0.026]} castShadow>
        <planeGeometry args={[1.22, 1.22]} />
        {photoTexture ? (
          <meshStandardMaterial
            map={photoTexture}
            emissive="#f5c276"
            emissiveIntensity={0}
            roughness={0.4}
          />
        ) : (
          <meshStandardMaterial color="#2d1512" roughness={0.4} />
        )}
      </mesh>

      {/* Frame caption text on the lower mat */}
      <group position={[0, -0.62, 0.028]}>
        <Text
          color="#38221c"
          fontSize={0.075}
          maxWidth={1.18}
          textAlign="center"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
          anchorX="center"
          anchorY="middle"
        >
          {memory.title}
        </Text>
      </group>

      {/* Delicate vintage gold corner pins */}
      <mesh position={[-0.66, 0.84, 0.025]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial {...goldPinMaterial} />
      </mesh>
      <mesh position={[0.66, 0.84, 0.025]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial {...goldPinMaterial} />
      </mesh>
      <mesh position={[-0.66, -0.84, 0.025]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial {...goldPinMaterial} />
      </mesh>
      <mesh position={[0.66, -0.84, 0.025]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial {...goldPinMaterial} />
      </mesh>

      {/* Warm focus halo light behind the frame when selected */}
      {isFocused && (
        <pointLight
          position={[0, 0, 0.3]}
          color="#ffdfa0"
          intensity={2.8}
          distance={2.4}
          decay={2}
        />
      )}
    </group>
  );
}
