import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  OrbitControls,
} from "@react-three/drei";
import {
  AdditiveBlending,
  CanvasTexture,
  Vector3,
  type Mesh,
  type MeshBasicMaterial,
  type PointLight,
  type SpotLight,
} from "three";

import { FloatingParticles } from "./FloatingParticles";
import { FestiveBackground } from "../UI/FestiveBackground";
import { IntroText } from "../UI/IntroText";
import { RevealMessage } from "../UI/RevealMessage";
import { LetterContinueCta } from "../UI/LetterContinueCta";
import { EnvelopeLetter } from "../UI/EnvelopeLetter";
import { MemoryWall } from "../UI/MemoryWall";
import { MemoryWall3D } from "./MemoryWall3D";
import { GiftBox } from "./GiftBox";
import { FlowerSprig } from "./FlowerSprig";

function BoxTopTracker() {
  const worldPoint = useRef(new Vector3());

  useFrame(({ camera, size }) => {
    worldPoint.current.set(0, 0.55, 0.15);
    worldPoint.current.project(camera);

    const screenY = (1 - (worldPoint.current.y * 0.5 + 0.5)) * size.height;
    document.documentElement.style.setProperty(
      "--box-top-px",
      `${Math.max(0, screenY).toFixed(1)}px`,
    );
  });

  return null;
}

// Soft radial gradient texture for the warm magenta/violet and golden glow pool under the circular stage
function useGlowPoolTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "rgba(224, 64, 251, 0.85)");
    grad.addColorStop(0.35, "rgba(171, 71, 188, 0.55)");
    grad.addColorStop(0.65, "rgba(255, 215, 0, 0.2)");
    grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new CanvasTexture(canvas);
    return tex;
  }, []);
}

// Royal purple / violet circular podium with glowing neon magenta edge trim and soft glow
function TablePedestal({ isOpen }: { isOpen: boolean }) {
  const glowPool = useRef<Mesh>(null);
  const glowTexture = useGlowPoolTexture();

  useFrame((_, delta) => {
    if (glowPool.current && glowPool.current.material) {
      const mat = glowPool.current.material as MeshBasicMaterial;
      const targetOpacity = isOpen ? 0.65 : 0.28;
      mat.opacity += (targetOpacity - mat.opacity) * Math.min(delta * 2.5, 1);
    }
  });

  return (
    <group position={[0, -0.86, 0]}>
      {/* Top circular purple stage platter */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.6, 0.16, 64]} />
        <meshStandardMaterial
          color="#38094f"
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Glowing neon magenta edge trim ring matching reference image */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[2.53, 2.53, 0.04, 64]} />
        <meshStandardMaterial
          color="#d500f9"
          emissive="#e040fb"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Feathered warm violet/gold glow pool radiating softly under the platform */}
      <mesh
        ref={glowPool}
        position={[0, 0.082, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.8, 3.8]} />
        <meshBasicMaterial
          map={glowTexture ?? undefined}
          color="#e040fb"
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Podium lower base rim */}
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[2.6, 2.45, 0.1, 64]} />
        <meshStandardMaterial
          color="#1e042b"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function GiftBoxContainer({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <group position={[0, -0.24, 0]}>
      <Float
        speed={0.8}
        rotationIntensity={0.04}
        floatIntensity={0.06}
        floatingRange={[-0.02, 0.02]}
      >
        <GiftBox isOpen={isOpen} onOpen={onOpen} />
      </Float>
    </group>
  );
}

// Interactive Camera Parallax Rig: Smoothly responds to mouse / touch movement
function CameraRig({
  isOpen,
  stage,
}: {
  isOpen: boolean;
  stage: "greeting" | "envelope" | "memories";
}) {
  const currentPos = useRef(new Vector3(0, 0.88, 7.75));
  const currentLookAt = useRef(new Vector3(0, -0.38, 0));

  useFrame((state, delta) => {
    const width = state.size.width;
    const height = state.size.height;
    const isMobile = width < 600;
    const isTablet = width >= 600 && width < 1024;

    let targetZ = 7.75;
    let targetY = 0.64;
    let lookAtY = -0.38;

    if (!isOpen) {
      // 1. Box is closed (Intro)
      if (isMobile) {
        targetZ = 9.2;
        targetY = 1.2;
        lookAtY = 0.1;
      } else if (isTablet) {
        targetZ = 7.4;
        targetY = 0.72;
        lookAtY = -0.32;
      } else {
        targetZ = 7.75;
        targetY = 0.64;
        lookAtY = -0.38;
      }
    } else if (stage === "envelope") {
      // 2. Envelope & Letter reading stage
      if (isMobile) {
        targetZ = 7.8;
        targetY = 1.05;
        lookAtY = 0.48;
      } else if (isTablet) {
        targetZ = 8.2;
        targetY = 0.88;
        lookAtY = 0.42;
      } else {
        targetZ = 8.6;
        targetY = 0.82;
        lookAtY = 0.38;
      }
    } else if (stage === "memories") {
      // 3. 3D Memory Carousel stage (balanced mobile framing showing center + side cards in 3D arc)
      if (isMobile) {
        targetZ = 7.85;
        targetY = 0.50;
        lookAtY = 0.36;
      } else if (isTablet) {
        targetZ = 8.0;
        targetY = 0.46;
        lookAtY = 0.34;
      } else {
        targetZ = 8.4;
        targetY = 0.42;
        lookAtY = 0.32;
      }
    } else {
      // 4. Greeting stage
      if (isMobile) {
        targetZ = 8.2;
        targetY = 0.9;
        lookAtY = -0.15;
      } else if (isTablet) {
        targetZ = 7.5;
        targetY = 0.5;
        lookAtY = -0.52;
      } else {
        targetZ = 7.65;
        targetY = 0.46;
        lookAtY = -0.54;
      }
    }

    if (!isMobile && height < 750) {
      targetZ += 0.35;
      lookAtY -= 0.05;
    }

    // Interactive pointer parallax
    const pX = state.pointer.x;
    const pY = state.pointer.y;

    const maxParallaxX = isMobile ? 0.35 : 0.65;
    const maxParallaxY = isMobile ? 0.25 : 0.45;

    const parallaxX = pX * maxParallaxX;
    const parallaxY = pY * maxParallaxY;

    const desiredX = parallaxX;
    const desiredY = targetY + parallaxY * 0.35;
    const desiredZ = targetZ - Math.abs(parallaxX) * 0.12;

    const desiredLookAtX = parallaxX * 0.18;
    const desiredLookAtY = lookAtY + parallaxY * 0.15;

    const easing = Math.min(delta * 2.2, 1);

    currentPos.current.x += (desiredX - currentPos.current.x) * easing;
    currentPos.current.y += (desiredY - currentPos.current.y) * easing;
    currentPos.current.z += (desiredZ - currentPos.current.z) * easing;

    currentLookAt.current.x += (desiredLookAtX - currentLookAt.current.x) * easing;
    currentLookAt.current.y += (desiredLookAtY - currentLookAt.current.y) * easing;

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current.x, currentLookAt.current.y, 0);
  });

  return null;
}

// Royal purple festive lighting with warm golden highlights and magenta accents
function DynamicLighting({
  isOpen,
  stage,
}: {
  isOpen: boolean;
  stage: "greeting" | "envelope" | "memories";
}) {
  const spotRef = useRef<SpotLight>(null);
  const leftGlowRef = useRef<PointLight>(null);
  const rightGlowRef = useRef<PointLight>(null);
  const rimRef = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (spotRef.current) {
      spotRef.current.position.x = 3.2 + Math.sin(t * 0.35) * 0.35;
      spotRef.current.position.y = 4.8 + Math.cos(t * 0.28) * 0.25;
      spotRef.current.position.z = 3.8 + Math.sin(t * 0.22) * 0.25;
    }

    if (leftGlowRef.current) {
      const flicker1 =
        1.0 +
        Math.sin(t * 9.2) * 0.06 +
        Math.sin(t * 16.4) * 0.04;
      leftGlowRef.current.intensity = 4.0 * flicker1;
    }

    if (rightGlowRef.current) {
      const flicker2 =
        1.0 +
        Math.sin(t * 11.7 + 1.2) * 0.06 +
        Math.sin(t * 18.2) * 0.04;
      rightGlowRef.current.intensity = 3.8 * flicker2;
    }

    if (rimRef.current) {
      rimRef.current.intensity = 3.2 + Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <>
      {/* Soft lavender/violet ambient room illumination */}
      <ambientLight
        intensity={isOpen ? 1.25 : 1.1}
        color="#d1c4e9"
      />

      {/* Key Spotlight casting soft shadows with warm golden champagne glow */}
      <spotLight
        ref={spotRef}
        position={[3.2, 4.8, 3.8]}
        angle={0.48}
        penumbra={0.92}
        intensity={stage === "memories" ? 22 : 20}
        color="#fff4db"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
      />

      {/* Vibrant magenta/pink side accent lights matching the reference theme */}
      <pointLight
        ref={leftGlowRef}
        position={[-3.25, 0.5, 1.2]}
        intensity={3.8}
        color="#e040fb"
        distance={5.8}
        decay={2}
      />
      <pointLight
        ref={rightGlowRef}
        position={[3.25, 0.5, 1.2]}
        intensity={3.6}
        color="#ab47bc"
        distance={5.8}
        decay={2}
      />

      {/* Warm golden rim light defining contours */}
      <pointLight
        ref={rimRef}
        position={[0, 2.8, -2.8]}
        intensity={3.0}
        color="#ffca28"
        distance={6.0}
        decay={2}
      />

      {/* Dedicated soft fill light during envelope stage */}
      {stage === "envelope" && (
        <directionalLight
          position={[0, 2.2, 4.2]}
          intensity={1.0}
          color="#fff6eb"
        />
      )}

      {/* Clean front fill during memories stage */}
      {stage === "memories" && (
        <directionalLight
          position={[0, 1.6, 5.4]}
          intensity={1.1}
          color="#ffffff"
        />
      )}
    </>
  );
}

export function ExperienceScene() {
  const [isOpen, setIsOpen] = useState(false);
  const [revealStage, setRevealStage] = useState<
    "greeting" | "envelope" | "memories"
  >("greeting");
  const [letterFullyOpen, setLetterFullyOpen] = useState(false);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  const handleGreetingContinue = () => {
    setRevealStage("envelope");
    setLetterFullyOpen(false);
  };

  const handleLetterContinue = () => {
    setRevealStage("memories");
  };

  return (
    <>
      {/* Festive Background Overlay — hidden at start (closed box), fades in smoothly after opening */}
      <FestiveBackground isVisible={isOpen} />

      <Canvas
        className="scene-canvas"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
        camera={{ position: [0, 0.88, 6.2], fov: 38 }}
      >
        <color attach="background" args={["#180326"]} />
        {/* Rich atmospheric royal purple background fog */}
        <fog attach="fog" args={["#180326", 5.0, 16.0]} />

        {/* Dynamic moving & flickering lights */}
        <DynamicLighting isOpen={isOpen} stage={revealStage} />

        {/* Scene 1 & 2: Purple circular stage platform, gift box, flowers and in-box 3D Envelope */}
        {(revealStage === "greeting" || revealStage === "envelope") && (
          <>
            <TablePedestal isOpen={isOpen} />
            <GiftBoxContainer isOpen={isOpen} onOpen={handleOpen} />
            <FlowerSprig position={[1.3, -0.55, -0.3]} scale={0.85} />
            <EnvelopeLetter
              isActive={revealStage === "envelope"}
              onFullyOpen={() => setLetterFullyOpen(true)}
            />
            <ContactShadows
              position={[0, -0.77, 0]}
              opacity={0.65}
              scale={3.8}
              blur={2.0}
              far={1.6}
              color="#090011"
            />
          </>
        )}

        {/* Scene 3: 3D Rotating Memory Carousel floating over the purple podium */}
        {revealStage === "memories" && (
          <>
            <TablePedestal isOpen={true} />
            <MemoryWall3D
              isVisible={revealStage === "memories"}
              continuousOffset={carouselOffset}
              onOffsetChange={setCarouselOffset}
            />
            <ContactShadows
              position={[0, -0.77, 0]}
              opacity={0.55}
              scale={3.8}
              blur={2.2}
              far={1.6}
              color="#090011"
            />
          </>
        )}

        {/* Foreground, midground, and background multi-plane particle fields */}
        <FloatingParticles isOpen={isOpen} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />

        <CameraRig isOpen={isOpen} stage={revealStage} />
        <BoxTopTracker />
      </Canvas>

      {/* Intro Overlay Text (visible in closed state) */}
      <IntroText isOpen={isOpen} />

      {/* Panel 3: "Happy Rakhi! ♡" Greeting */}
      <RevealMessage
        isOpen={isOpen}
        isVisible={revealStage === "greeting"}
        onContinue={handleGreetingContinue}
      />

      {/* Bottom prompt fading in after 3D letter settles */}
      <LetterContinueCta
        isVisible={revealStage === "envelope" && letterFullyOpen}
        onContinue={handleLetterContinue}
      />

      {/* 3D Carousel Header & Navigation Controls */}
      <MemoryWall
        isVisible={revealStage === "memories"}
        continuousOffset={carouselOffset}
        onOffsetChange={setCarouselOffset}
      />
    </>
  );
}
