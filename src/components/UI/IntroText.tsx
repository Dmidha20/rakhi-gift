type IntroTextProps = {
  isOpen: boolean;
};

export function IntroText({ isOpen }: IntroTextProps) {
  return (
    <section
      className={`intro-text${isOpen ? " intro-text--hidden" : ""}`}
      aria-label="Introduction"
    >
      <div className="intro-text__content">
        {/* Subtle decorative gold heart outline */}
        <div className="intro-text__heart-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <h1 className="intro-text__title">
          <span>Something I made</span>
          <span className="intro-text__title-sub">
            for you two. <span className="intro-text__red-heart">❤️</span>
          </span>
        </h1>

        <div className="intro-text__cta">
          <p className="intro-text__cta-label">TAP TO BEGIN</p>
          <span className="intro-text__cta-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}
