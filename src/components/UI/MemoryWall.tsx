import { CAROUSEL_MEMORIES } from "../../data/memories";

type MemoryWallProps = {
  isVisible: boolean;
  continuousOffset: number;
  onOffsetChange: (offset: number) => void;
};

export function MemoryWall({
  isVisible,
  continuousOffset,
  onOffsetChange,
}: MemoryWallProps) {
  if (!isVisible) return null;

  const total = CAROUSEL_MEMORIES.length;
  const activeDotIndex =
    ((Math.round(continuousOffset) % total) + total) % total;

  // Infinite continuous rotation in single direction without rewinding
  const handlePrev = () => {
    onOffsetChange(Math.round(continuousOffset) - 1);
  };

  const handleNext = () => {
    onOffsetChange(Math.round(continuousOffset) + 1);
  };

  const handleSelectDot = (dotIndex: number) => {
    let diff = dotIndex - activeDotIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    onOffsetChange(Math.round(continuousOffset) + diff);
  };

  return (
    <section
      className="memory-wall memory-wall--carousel"
      aria-label="3D Rotating Memory Carousel"
    >
      {/* Top glowing gold heart & title */}
      <div className="memory-wall__header">
        <div className="memory-wall__heart-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h2 className="memory-wall__title">Some memories, some madness… ❤️</h2>
      </div>

      {/* Bottom swipe instructions & carousel pagination indicator */}
      <div className="memory-wall__footer">
        {/* Helper prompt */}
        <div className="memory-wall__hint-wrapper">
          <p className="memory-wall__hint">
            <span className="memory-wall__hint-arrow">←</span> Drag to explore memories{" "}
            <span className="memory-wall__hint-arrow">→</span>
          </p>
          <div className="memory-wall__drag-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M8 7l-4 4 4 4M16 7l4 4-4 4M4 11h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Carousel Pagination Controls (< • • ● • • >) */}
        <div className="memory-wall__pagination">
          <button
            type="button"
            className="memory-wall__nav-btn"
            onClick={handlePrev}
            aria-label="Previous Memory"
          >
            ‹
          </button>

          <div className="memory-wall__dots">
            {CAROUSEL_MEMORIES.map((card, i) => (
              <button
                key={card.id}
                type="button"
                className={`memory-wall__dot${
                  i === activeDotIndex ? " memory-wall__dot--active" : ""
                }`}
                onClick={() => handleSelectDot(i)}
                aria-label={`Go to memory ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="memory-wall__nav-btn"
            onClick={handleNext}
            aria-label="Next Memory"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
