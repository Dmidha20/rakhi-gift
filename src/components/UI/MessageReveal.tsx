import { useEffect, useState } from "react";

type MessageRevealProps = {
  isVisible: boolean;
  onContinue?: () => void;
};

export function MessageReveal({ isVisible, onContinue }: MessageRevealProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    // Gentle delayed entrance
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const show = mounted && isVisible;

  if (!isVisible) return null;

  return (
    <section
      className={`message-reveal${show ? " message-reveal--visible" : ""}`}
      aria-label="Personal Rakhi Message"
      aria-hidden={!show}
    >
      {/* Soft warm golden radiance rising from the bottom */}
      <div className="message-reveal__bottom-glow" aria-hidden="true" />

      <div className="message-reveal__content">
        {/* Subtle gold heart badge at top */}
        <div className="message-reveal__heart-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
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
        <div className="message-reveal__divider message-reveal__divider--top" aria-hidden="true">
          <span className="message-reveal__divider-line" />
          <span className="message-reveal__divider-diamond">◆</span>
          <span className="message-reveal__divider-line" />
        </div>

        {/* Block 1: The Sibling Intro & Bhabhi Highlight */}
        <div className="message-reveal__block message-reveal__block--top">
          <p className="message-reveal__line message-reveal__line--lead">
            I couldn't handle him alone…{" "}
            <span className="message-reveal__emoji">😂</span>
          </p>
          <p className="message-reveal__line message-reveal__line--bhabhi">
            So we brought Bhabhi in.{" "}
            <span className="message-reveal__heart">❤️</span>
          </p>
        </div>

        {/* Middle divider */}
        <div
          className="message-reveal__divider message-reveal__divider--subtle"
          aria-hidden="true"
        >
          <span className="message-reveal__divider-line" />
          <span className="message-reveal__divider-heart">♥</span>
          <span className="message-reveal__divider-line" />
        </div>

        {/* Block 2: The Trio & Decision */}
        <div className="message-reveal__block">
          <p className="message-reveal__line message-reveal__line--team">
            And now we're officially a team of three.{" "}
            <span className="message-reveal__emoji">🫶</span>
          </p>
          <p className="message-reveal__line message-reveal__line--decision">
            Best decision ever.{" "}
            <span className="message-reveal__emoji">😌😂</span>
          </p>
        </div>

        {/* Lower divider */}
        <div
          className="message-reveal__divider message-reveal__divider--subtle"
          aria-hidden="true"
        >
          <span className="message-reveal__divider-line" />
          <span className="message-reveal__divider-heart">♥</span>
          <span className="message-reveal__divider-line" />
        </div>

        {/* Block 3: The Finale Highlight */}
        <div className="message-reveal__block message-reveal__block--finale">
          <h2 className="message-reveal__line message-reveal__line--finale">
            Happy First Rakhi Together!{" "}
            <span className="message-reveal__emoji">🫶</span>
          </h2>
        </div>

        {/* Bottom divider and TAP TO CONTINUE action */}
        <div
          className="message-reveal__divider message-reveal__divider--bottom"
          aria-hidden="true"
        >
          <span className="message-reveal__divider-line" />
          <span className="message-reveal__divider-heart">♥</span>
          <span className="message-reveal__divider-line" />
        </div>

        <button
          type="button"
          className="message-reveal__cta"
          onClick={onContinue}
          aria-label="Continue"
        >
          <span className="message-reveal__cta-label">TAP TO CONTINUE</span>
          <span className="message-reveal__cta-arrow" aria-hidden="true">
            ︾
          </span>
        </button>
      </div>
    </section>
  );
}
