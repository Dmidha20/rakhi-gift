import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";

type EnvelopeLetterProps = {
  isActive: boolean; // true once this stage should render/animate
  onFullyOpen: () => void; // called once when letter reaches reading position
};

type Stage = "closed" | "flap-open" | "letter-out";

const envelopeBodyMaterial = {
  color: "#f5ecdf",
  roughness: 0.62,
  metalness: 0.02,
};
const envelopeFlapMaterial = {
  color: "#ebe0d0",
  roughness: 0.62,
  metalness: 0.02,
};
const heartSealMaterial = {
  color: "#7a1424",
  roughness: 0.32,
  metalness: 0.18,
};

// Generates the 2D canvas containing the high-contrast personalized message
function createLetterCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 2200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 1. Crisp Bright Ivory Parchment Base
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Soft Vintage Parchment Edge Radiance
  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.45,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.8,
  );
  vignette.addColorStop(0, "rgba(255, 253, 248, 0)");
  vignette.addColorStop(0.85, "rgba(235, 215, 185, 0.12)");
  vignette.addColorStop(1, "rgba(180, 140, 90, 0.24)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. Outer Decorative Gold Foil Border
  ctx.strokeStyle = "#c59a45";
  ctx.lineWidth = 8;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // 4. Inner Fine Gold Accent Border
  ctx.strokeStyle = "rgba(197, 154, 69, 0.45)";
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

  // 5. Deep Burgundy Wax-Heart Icon at Top
  ctx.fillStyle = "#8d1b2e";
  ctx.font = "700 95px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥", canvas.width / 2, 210);

  // 6. Top Gold Diamond Divider
  ctx.strokeStyle = "#c59a45";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 320, 260);
  ctx.lineTo(canvas.width / 2 - 60, 260);
  ctx.moveTo(canvas.width / 2 + 60, 260);
  ctx.lineTo(canvas.width / 2 + 320, 260);
  ctx.stroke();

  ctx.fillStyle = "#c59a45";
  ctx.font = "700 32px Georgia, serif";
  ctx.fillText("◆", canvas.width / 2, 268);

  // 7. Bold High-Contrast Typography
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Line 1
  ctx.font = 'italic 700 78px "Playfair Display", Georgia, serif';
  ctx.fillStyle = "#1e0b06";
  ctx.fillText("I couldn't handle him alone… 😂", canvas.width / 2, 490);

  // Line 2
  ctx.fillText("So we brought Bhabhi in. ❤️", canvas.width / 2, 730);

  // Line 3
  ctx.fillText(
    "And now we're officially a team of three. 🫶",
    canvas.width / 2,
    970,
  );

  // Line 4
  ctx.fillText("Best decision ever. 😌😂", canvas.width / 2, 1210);

  // Line 5: Golden/Burgundy Finale Highlight
  ctx.font = 'italic 800 96px "Playfair Display", Georgia, serif';
  ctx.fillStyle = "#8d1b2e";
  ctx.fillText("Happy First Rakhi Together! 🫶", canvas.width / 2, 1530);

  // 8. Bottom Gold Diamond Divider
  ctx.strokeStyle = "#c59a45";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 320, 1690);
  ctx.lineTo(canvas.width / 2 - 60, 1690);
  ctx.moveTo(canvas.width / 2 + 60, 1690);
  ctx.lineTo(canvas.width / 2 + 320, 1690);
  ctx.stroke();

  ctx.fillStyle = "#c59a45";
  ctx.font = "700 32px Georgia, serif";
  ctx.fillText("◆", canvas.width / 2, 1698);

  // 9. Bottom Small Accent Heart
  ctx.fillStyle = "#8d1b2e";
  ctx.font = "700 65px Georgia, serif";
  ctx.fillText("♥", canvas.width / 2, 1820);

  return canvas;
}

// Synchronous high-resolution CanvasTexture ensuring immediate availability on first render
function useLetterTexture() {
  const texture = useMemo(() => {
    const canvas = createLetterCanvas();
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    let cancelled = false;
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled && texture) {
          const newCanvas = createLetterCanvas();
          texture.image = newCanvas;
          texture.needsUpdate = true;
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [texture]);

  return texture;
}

function Envelope({ flapOpen }: { flapOpen: boolean }) {
  const flapHinge = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!flapHinge.current) return;
    const targetAngle = flapOpen ? -Math.PI * 0.88 : 0;
    const currentAngle = flapHinge.current.rotation.x;
    flapHinge.current.rotation.x +=
      (targetAngle - currentAngle) * Math.min(delta * 4.2, 1);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Back & Main Pocket Body */}
      <RoundedBox
        args={[1.48, 0.04, 0.98]}
        radius={0.02}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...envelopeBodyMaterial} />
      </RoundedBox>

      {/* Front pocket diagonal fold */}
      <mesh position={[0, 0.022, 0.01]} rotation={[-Math.PI / 2.6, 0, 0]}>
        <planeGeometry args={[1.44, 0.58]} />
        <meshStandardMaterial {...envelopeFlapMaterial} side={DoubleSide} />
      </mesh>

      {/* Top flap, hinged at the back edge */}
      <group ref={flapHinge} position={[0, 0.022, -0.47]}>
        <mesh
          position={[0, 0, 0.34]}
          rotation={[Math.PI / 2.4, 0, 0]}
          castShadow
        >
          <planeGeometry args={[1.44, 0.68]} />
          <meshStandardMaterial {...envelopeFlapMaterial} side={DoubleSide} />
        </mesh>

        {/* Wax-style heart seal on the flap tip */}
        {!flapOpen && (
          <mesh
            position={[0, 0.015, 0.58]}
            rotation={[Math.PI / 2.4, 0, 0]}
            castShadow
          >
            <circleGeometry args={[0.085, 24]} />
            <meshStandardMaterial {...heartSealMaterial} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Letter({ stage }: { stage: Stage }) {
  const group = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const texture = useLetterTexture();

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as MeshBasicMaterial;
      mat.map = texture;
      mat.needsUpdate = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const easing = Math.min(delta * 2.8, 1);

    const isOut = stage === "letter-out";

    const targetY = isOut ? 1.05 : 0.02;
    const targetZ = isOut ? 1.35 : 0.01;
    const targetRotX = isOut ? -0.04 : 0;
    const targetScale = isOut ? 1.25 : 0.82;

    group.current.position.y += (targetY - group.current.position.y) * easing;
    group.current.position.z += (targetZ - group.current.position.z) * easing;
    group.current.rotation.x +=
      (targetRotX - group.current.rotation.x) * easing;

    const currentScale = group.current.scale.x;
    const nextScale = currentScale + (targetScale - currentScale) * easing;
    group.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={group} position={[0, 0.02, 0.01]} scale={[0.82, 0.82, 0.82]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[1.45, 2.0]} />
        <meshBasicMaterial
          key={texture.id}
          map={texture}
          toneMapped={false}
          fog={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function EnvelopeLetter({ isActive, onFullyOpen }: EnvelopeLetterProps) {
  const [stage, setStage] = useState<Stage>("closed");
  const [prevActive, setPrevActive] = useState(isActive);
  const lastClickRef = useRef(0);
  const containerRef = useRef<Group>(null);

  if (prevActive !== isActive) {
    setPrevActive(isActive);
    if (!isActive) {
      setStage("closed");
    }
  }

  // When letter-out is reached, wait for settle animation then trigger continue CTA
  useEffect(() => {
    if (stage === "letter-out") {
      const timer = setTimeout(onFullyOpen, 1050); // matches settle animation
      return () => clearTimeout(timer);
    }
  }, [stage, onFullyOpen]);

  // User click handler: tap 1 = flap opens, tap 2 = letter slides out
  const handleHitClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickRef.current < 250) return;
    lastClickRef.current = now;

    setStage((prev) => {
      return prev === "closed"
        ? "flap-open"
        : prev === "flap-open"
          ? "letter-out"
          : prev;
    });
  };

  useFrame((_, delta) => {
    if (!containerRef.current) return;
    // Smooth natural floating elevation when active
    const targetY = isActive ? 0.42 : -0.1;
    const currentY = containerRef.current.position.y;
    containerRef.current.position.y +=
      (targetY - currentY) * Math.min(delta * 3.5, 1);
  });

  if (!isActive) return null;

  return (
    <group ref={containerRef} position={[0, -0.1, 0.08]} rotation={[-0.14, 0, 0]}>
      {/* 
        Dedicated Invisible Hit Target Collider for 100% reliable tap handling:
        Tap 1: Opens the flap
        Tap 2: Pulls the letter out
      */}
      <mesh
        position={[
          0,
          stage === "letter-out" ? 1.05 : 0.2,
          stage === "letter-out" ? 1.35 : 0.2,
        ]}
        onClick={handleHitClick}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <boxGeometry args={[2.2, stage === "letter-out" ? 2.8 : 1.6, 0.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Visual meshes */}
      <Envelope flapOpen={stage !== "closed"} />
      <Letter stage={stage} />
    </group>
  );
}
