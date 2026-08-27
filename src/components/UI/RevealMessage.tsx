import { useEffect, useState } from "react";

type RevealMessageProps = {
  isOpen: boolean;
  isVisible: boolean;
  onContinue?: () => void;
};

export function RevealMessage({
  isOpen,
  isVisible,
  onContinue,
}: RevealMessageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOpen || !isVisible) {
      return;
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [isOpen, isVisible]);

  const show = mounted && isOpen && isVisible;

  if (!isOpen || !isVisible) return null;

  return (
    <section
      className={`reveal-message${show ? " reveal-message--visible" : ""}`}
      aria-label="Happy Rakhi Greeting"
      aria-hidden={!show}
    >
      <div className="reveal-message__content">
        {/* Subtle glowing gold outline heart */}
        <div className="reveal-message__heart-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Top gold diamond divider */}
        <div className="reveal-message__divider" aria-hidden="true">
          <span className="reveal-message__divider-line" />
          <span className="reveal-message__divider-diamond">◆</span>
          <span className="reveal-message__divider-line" />
        </div>

        {/* Calligraphy main title */}
        <h2 className="reveal-message__title">
          <span>Happy Rakhi!</span>{" "}
          <span className="reveal-message__outline-heart" aria-hidden="true">
            ♡
          </span>
        </h2>

        {/* Elegant serif subtitle */}
        <p className="reveal-message__subtitle">
          To the two most special people.
        </p>

        {/* User-driven TAP TO CONTINUE CTA */}
        <button
          type="button"
          className="reveal-message__cta"
          onClick={onContinue}
          aria-label="Continue to envelope"
        >
          <span className="reveal-message__cta-label">TAP TO CONTINUE</span>
          <span className="reveal-message__cta-arrow" aria-hidden="true">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}
