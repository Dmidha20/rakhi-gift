import { useEffect, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
} from "three";
import {
  CAROUSEL_MEMORIES,
  type CarouselMemoryData,
} from "../../data/memories";

// Generates high-res, dominant-photo Polaroid textures with pure sRGB color & crystal-clear clarity
function usePolaroidTexture(card: CarouselMemoryData) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    function draw(imageObj?: HTMLImageElement, fontReady = false) {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Enable high-quality antialiasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Crisp Cream Polaroid Card Background
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle warm outer edge border
      ctx.strokeStyle = "rgba(180, 140, 95, 0.25)";
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // 2. Large Dominant Photo Area (fills 96% width & 82% height)
      const photoX = 24;
      const photoY = 24;
      const photoW = canvas.width - 48; // 1152px (96% width)
      const photoH = 1180; // 1180px (82% height)

      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();

      if (imageObj && imageObj.complete && imageObj.naturalWidth > 0) {
        // Smart aspect-ratio cover fit: fills the entire photo box edge-to-edge
        const imgW = imageObj.naturalWidth;
        const imgH = imageObj.naturalHeight;
        const imgRatio = imgW / imgH;
        const targetRatio = photoW / photoH;

        let sx = 0;
        let sy = 0;
        let sWidth = imgW;
        let sHeight = imgH;

        if (imgRatio > targetRatio) {
          // Landscape photo (e.g. 3:2): crop left/right evenly with center focus
          sWidth = imgH * targetRatio;
          sx = (imgW - sWidth) / 2;
          sHeight = imgH;
          sy = 0;
        } else {
          // Portrait photo (e.g. 3:4): bias crop slightly toward top (20%) so faces/heads are never cut off
          sHeight = imgW / targetRatio;
          sy = Math.max(0, (imgH - sHeight) * 0.2);
          sWidth = imgW;
          sx = 0;
        }

        // Draw pure original photograph without any dark haze or overlays
        ctx.drawImage(
          imageObj,
          sx,
          sy,
          sWidth,
          sHeight,
          photoX,
          photoY,
          photoW,
          photoH,
        );
      } else {
        // Warm fallback gradient while image loads
        const bg = ctx.createLinearGradient(
          photoX,
          photoY,
          photoX + photoW,
          photoY + photoH,
        );
        bg.addColorStop(0, "#4a1810");
        bg.addColorStop(0.5, "#7a2e22");
        bg.addColorStop(1, "#c2633e");
        ctx.fillStyle = bg;
        ctx.fillRect(photoX, photoY, photoW, photoH);
      }

      // Crisp inner photo border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(photoX, photoY, photoW, photoH);
      ctx.restore();

      // 3. Compact, Centered, Bold Italic Caption Typography
      const fontSize = 58;
      const font = fontReady
        ? `italic 700 ${fontSize}px "Playfair Display", Georgia, serif`
        : `italic 700 ${fontSize}px Georgia, serif`;
      ctx.font = font;
      ctx.fillStyle = "#180602";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const captionCenterY =
        photoY + photoH + (canvas.height - (photoY + photoH)) / 2;
      ctx.fillText(
        card.caption,
        canvas.width / 2,
        captionCenterY,
        canvas.width - 60,
      );

      const tex = new CanvasTexture(canvas);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      tex.minFilter = LinearMipmapLinearFilter;
      tex.magFilter = LinearFilter;
      tex.needsUpdate = true;
      setTexture(tex);
    }

    img.onload = () => {
      draw(img, true);
    };

    img.onerror = () => {
      draw(undefined, true);
    };

    img.src = card.imageSrc;

    if (img.complete) {
      draw(img, true);
    } else {
      draw(undefined, false);
    }

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled && img.complete) draw(img, true);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [card]);

  return texture;
}

// 3D Carousel Card Mesh with physical RoundedBox body + crystal-clear front plane UV mapping
function CarouselCard3D({
  card,
  index,
  totalCount,
  offsetRef,
  onClick,
  isMobile,
}: {
  card: CarouselMemoryData;
  index: number;
  totalCount: number;
  offsetRef: React.MutableRefObject<number>;
  onClick: () => void;
  isMobile: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const frontMeshRef = useRef<Mesh>(null);
  const backMeshRef = useRef<Mesh>(null);
  const texture = usePolaroidTexture(card);

  const currentPos = useRef(new Vector3(0, 0, -10));
  const currentRot = useRef(new Vector3(0, 0, 0));
  const currentScale = useRef(0.01);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Continuous circular angle offset along the 3D cylinder
    const curOffset = offsetRef.current;
    let deltaIndex =
      (((index - curOffset) % totalCount) + totalCount) % totalCount;
    if (deltaIndex > totalCount / 2) deltaIndex -= totalCount;

    const absDelta = Math.abs(deltaIndex);

    // Cylindrical arc parameters tuned so adjacent side cards are clearly visible
    const stepAngle = isMobile ? 0.38 : 0.36; // radians per card
    const radius = isMobile ? 4.9 : 5.8;      // radius of the arc
    const theta = deltaIndex * stepAngle;

    // Center focal elevation & arc coordinates
    const targetX = Math.sin(theta) * radius;
    const targetY = 0.5 - (1 - Math.cos(theta)) * 0.25;
    const targetZ = Math.cos(theta) * radius - radius + 0.35;

    // Inward facing Y-rotation along cylinder
    const targetRotY = -theta * 1.10;
    const targetRotZ = -deltaIndex * 0.02;
    const targetRotX = 0.03;

    // Balanced scale: Center card is prominent while side cards are comfortably visible in 3D arc
    const baseScale = isMobile ? 1.18 : 1.22;
    const scaleFactor = Math.max(0.78, 1 - absDelta * 0.15);
    const targetScaleVal = baseScale * scaleFactor;

    // Opacity: Visible across 3-5 cards, fades out smoothly when curving behind
    const maxVisibleDelta = isMobile ? 2.4 : 2.6;
    const targetOpacity = Math.max(
      0,
      Math.min(1, (maxVisibleDelta - absDelta) / 0.8),
    );

    // Smooth spring/lerp easing
    const easing = Math.min(delta * 9.5, 1);
    currentPos.current.x += (targetX - currentPos.current.x) * easing;
    currentPos.current.y += (targetY - currentPos.current.y) * easing;
    currentPos.current.z += (targetZ - currentPos.current.z) * easing;

    currentRot.current.x += (targetRotX - currentRot.current.x) * easing;
    currentRot.current.y += (targetRotY - currentRot.current.y) * easing;
    currentRot.current.z += (targetRotZ - currentRot.current.z) * easing;

    currentScale.current += (targetScaleVal - currentScale.current) * easing;

    groupRef.current.position.copy(currentPos.current);
    groupRef.current.rotation.set(
      currentRot.current.x,
      currentRot.current.y,
      currentRot.current.z,
    );
    groupRef.current.scale.set(
      currentScale.current,
      currentScale.current,
      currentScale.current,
    );

    const brightness = Math.max(0.72, 1 - absDelta * 0.12);

    if (frontMeshRef.current && frontMeshRef.current.material) {
      const mat = frontMeshRef.current.material as MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * easing;
      mat.transparent = mat.opacity < 0.98;
      mat.color.setRGB(brightness, brightness, brightness);
    }

    if (backMeshRef.current && backMeshRef.current.material) {
      const mat = backMeshRef.current.material as MeshStandardMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * easing;
      mat.transparent = mat.opacity < 0.98;
      mat.color.setRGB(brightness, brightness, brightness);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 1. 3D Rounded Polaroid Card Body */}
      <RoundedBox
        ref={backMeshRef}
        args={[1.48, 1.76, 0.024]}
        radius={0.025}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#faf7f2"
          roughness={0.45}
          metalness={0.02}
        />
      </RoundedBox>

      {/* 2. Front Face Quad with exact 1:1 UV Mapping & Uncompromised Sharpness */}
      <mesh ref={frontMeshRef} position={[0, 0, 0.013]} receiveShadow>
        <planeGeometry args={[1.45, 1.725]} />
        <meshBasicMaterial
          map={texture ?? undefined}
          toneMapped={false}
          fog={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function MemoryWall3D({
  isVisible,
  continuousOffset,
  onOffsetChange,
}: {
  isVisible: boolean;
  continuousOffset: number;
  onOffsetChange?: (offset: number) => void;
}) {
  const { size } = useThree();
  const isMobile = size.width < 600;

  const currentOffset = useRef(continuousOffset);
  const targetOffset = useRef(continuousOffset);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const dragVelocity = useRef(0);
  const lastPointerX = useRef(0);

  // Sync external offset if updated from HUD controls
  useEffect(() => {
    targetOffset.current = continuousOffset;
  }, [continuousOffset]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = targetOffset.current;
    lastPointerX.current = e.clientX;
    dragVelocity.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const dx = e.clientX - dragStartX.current;
    const sensitivity = isMobile ? 0.0036 : 0.0022;
    targetOffset.current = dragStartOffset.current - dx * sensitivity;

    dragVelocity.current =
      -(e.clientX - lastPointerX.current) * sensitivity * 12;
    lastPointerX.current = e.clientX;
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Apply throw momentum and snap to nearest integer card
    targetOffset.current += dragVelocity.current * 0.15;
    targetOffset.current = Math.round(targetOffset.current);

    onOffsetChange?.(targetOffset.current);
  };

  useFrame((_, delta) => {
    // Smooth spring/lerp easing to target offset
    const easing = Math.min(delta * (isDragging.current ? 18 : 6.5), 1);
    currentOffset.current +=
      (targetOffset.current - currentOffset.current) * easing;
  });

  if (!isVisible) return null;

  return (
    <group
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Invisible hit catcher for smooth drag across the canvas */}
      <mesh position={[0, 0.4, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 3D Carousel Cards along the horizontal cylindrical curve */}
      {CAROUSEL_MEMORIES.map((card, i) => (
        <CarouselCard3D
          key={card.id}
          card={card}
          index={i}
          totalCount={CAROUSEL_MEMORIES.length}
          offsetRef={currentOffset}
          onClick={() => {
            const total = CAROUSEL_MEMORIES.length;
            const cur = currentOffset.current;
            let delta = (((i - cur) % total) + total) % total;
            if (delta > total / 2) delta -= total;
            targetOffset.current = Math.round(cur + delta);
            onOffsetChange?.(targetOffset.current);
          }}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}
