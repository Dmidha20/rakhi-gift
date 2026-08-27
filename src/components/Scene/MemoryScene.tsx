import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { MEMORIES, type MemoryItem } from "../../data/memories";
import { MemoryFrame } from "./MemoryFrame";

type MemorySceneProps = {
  transitionProgress: number; // 0 to 1
  onSelectMemory?: (id: number | null) => void;
};

export function MemoryScene({
  transitionProgress,
  onSelectMemory,
}: MemorySceneProps) {
  const { size } = useThree();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isMobile = size.width < 600;
  const isTablet = size.width >= 600 && size.width < 1024;

  const handleSelect = (id: number) => {
    const nextId = selectedId === id ? null : id;
    setSelectedId(nextId);
    if (onSelectMemory) onSelectMemory(nextId);
  };

  // Responsive 3D layout coordinates
  const getFrameTransform = (
    index: number,
  ): { pos: [number, number, number]; rot: [number, number, number] } => {
    if (isMobile) {
      // Mobile portrait: comfortable vertical & depth staggering (hero centered)
      const mobileTransforms: Array<{
        pos: [number, number, number];
        rot: [number, number, number];
      }> = [
        { pos: [0, -0.05, 0.1], rot: [0, 0, -0.02] },
        { pos: [1.12, 1.32, -0.9], rot: [0.04, -0.12, 0.05] },
        { pos: [-1.08, -1.32, -0.8], rot: [-0.03, 0.1, -0.04] },
        { pos: [-1.55, 0.75, -2.1], rot: [0.05, 0.15, 0.03] },
        { pos: [1.58, -0.75, -1.9], rot: [-0.04, -0.15, -0.05] },
      ];
      return mobileTransforms[index % mobileTransforms.length];
    }

    if (isTablet) {
      // Tablet view
      const tabletTransforms: Array<{
        pos: [number, number, number];
        rot: [number, number, number];
      }> = [
        { pos: [-1.8, 0.35, -0.4], rot: [0.02, 0.1, -0.03] },
        { pos: [0, 0.1, 0.3], rot: [0, 0, 0] },
        { pos: [1.8, 0.25, -0.5], rot: [0.02, -0.12, 0.04] },
        { pos: [-1.1, -1.15, -1.1], rot: [-0.03, 0.06, -0.02] },
        { pos: [1.15, -1.1, -1.0], rot: [-0.03, -0.06, 0.03] },
      ];
      return tabletTransforms[index % tabletTransforms.length];
    }

    // Desktop wide view: spacious cinematic constellation
    const desktopTransforms: Array<{
      pos: [number, number, number];
      rot: [number, number, number];
    }> = [
      { pos: [-2.65, 0.35, -0.5], rot: [0.02, 0.12, -0.04] },
      { pos: [0, 0.08, 0.35], rot: [0, 0, 0] },
      { pos: [2.65, 0.25, -0.6], rot: [0.02, -0.14, 0.04] },
      { pos: [-1.35, -1.25, -1.2], rot: [-0.04, 0.08, -0.02] },
      { pos: [1.4, -1.2, -1.1], rot: [-0.03, -0.08, 0.03] },
    ];
    return desktopTransforms[index % desktopTransforms.length];
  };

  if (transitionProgress <= 0.01) return null;

  return (
    <group position={[0, -0.15, 0]}>
      {MEMORIES.map((memory: MemoryItem, index: number) => {
        const { pos, rot } = getFrameTransform(index);
        return (
          <MemoryFrame
            key={memory.id}
            memory={memory}
            position={pos}
            rotation={rot}
            isFocused={selectedId === memory.id}
            onSelect={() => handleSelect(memory.id)}
            transitionProgress={transitionProgress}
          />
        );
      })}
    </group>
  );
}
