type MemoryTextProps = {
  isVisible: boolean;
};

export function MemoryText({ isVisible }: MemoryTextProps) {
  return (
    <section
      className={`memory-text${isVisible ? " memory-text--visible" : ""}`}
      aria-label="Memories"
    >
      <div className="memory-text__content">
        <p className="memory-text__eyebrow">A Little Keepsake</p>
        <h2 className="memory-text__title">
          Some moments are worth keeping.{" "}
          <span className="memory-text__sparkle">✨</span>
        </h2>
        <p className="memory-text__hint">Tap any keepsake to hold it close</p>
      </div>
    </section>
  );
}
