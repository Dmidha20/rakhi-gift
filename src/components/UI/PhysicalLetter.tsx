export type LetterStep =
  | "envelope-sealed"
  | "envelope-peek"
  | "letter-unfolded";

type PhysicalLetterProps = {
  step: LetterStep;
  isStageActive: boolean;
  onOpenEnvelope: () => void;
  onUnfoldLetter: () => void;
  onContinue: () => void;
};

export function PhysicalLetter({
  step,
  isStageActive,
  onOpenEnvelope,
  onUnfoldLetter,
  onContinue,
}: PhysicalLetterProps) {
  if (!isStageActive) return null;

  return (
    <div className="letter-flow-overlay">
      {/* -------------------------------------------------------------
          Panel 4: Envelope inside the box (Sealed with wax seal)
          ------------------------------------------------------------- */}
      {step === "envelope-sealed" && (
        <button
          type="button"
          className="letter-flow__hint-btn"
          onClick={onOpenEnvelope}
          aria-label="Tap to open the envelope inside the box"
        >
          <span className="letter-flow__hint-icon">✉️</span>
          <span className="letter-flow__hint-text">TAP TO OPEN ENVELOPE</span>
          <span className="letter-flow__hint-arrow">↓</span>
        </button>
      )}

      {/* -------------------------------------------------------------
          Panel 5: Envelope opens, folded letter peeks out
          ------------------------------------------------------------- */}
      {step === "envelope-peek" && (
        <div
          className="letter-peek"
          onClick={onUnfoldLetter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onUnfoldLetter()}
          aria-label="Folded letter peeking out. Tap to read full letter"
        >
          <div className="letter-peek__card">
            <div className="letter-peek__texture" aria-hidden="true" />
            <div className="letter-peek__divider">
              <span className="letter-peek__divider-line" />
              <span className="letter-peek__divider-heart">♡</span>
              <span className="letter-peek__divider-line" />
            </div>

            <p className="letter-peek__quote">
              For my favourite people<br />in the world…
            </p>

            <div className="letter-peek__divider">
              <span className="letter-peek__divider-line" />
              <span className="letter-peek__divider-heart">♡</span>
              <span className="letter-peek__divider-line" />
            </div>

            <div className="letter-peek__cta">
              <span className="letter-peek__cta-label">TAP TO READ LETTER</span>
              <span className="letter-peek__cta-arrow">↓</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          Panel 6: Full personalized message revealed on parchment
          ------------------------------------------------------------- */}
      {step === "letter-unfolded" && (
        <section
          className="letter-full"
          aria-label="Personalized Rakhi Letter"
        >
          <div className="letter-full__parchment">
            {/* Paper grain & deckled edge borders */}
            <div className="letter-full__texture" aria-hidden="true" />
            <div className="letter-full__deckle-edge" aria-hidden="true" />

            {/* Top Burgundy Wax Seal Stamp */}
            <div className="letter-full__seal" aria-hidden="true">
              <span className="letter-full__seal-heart">♥</span>
            </div>

            {/* Content matching Storyboard Panel 6 */}
            <div className="letter-full__content">
              {/* Top divider */}
              <div className="letter-full__divider">
                <span className="letter-full__divider-line" />
                <span className="letter-full__divider-heart letter-full__divider-heart--red">♥</span>
                <span className="letter-full__divider-line" />
              </div>

              {/* Line 1 */}
              <p className="letter-full__line letter-full__line--lead">
                I couldn't handle him alone…{" "}
                <span className="letter-full__emoji">😂</span>
              </p>

              {/* Line 2 */}
              <p className="letter-full__line letter-full__line--bhabhi">
                So we brought Bhabhi in.{" "}
                <span className="letter-full__heart">❤️</span>
              </p>

              {/* Line 3 */}
              <p className="letter-full__line letter-full__line--team">
                And now we're officially a team of three.{" "}
                <span className="letter-full__emoji">🫶</span>
              </p>

              {/* Line 4 */}
              <p className="letter-full__line letter-full__line--decision">
                Best decision ever.{" "}
                <span className="letter-full__emoji">😌😂</span>
              </p>

              {/* Line 5 (Finale Highlight) */}
              <h2 className="letter-full__line letter-full__line--finale">
                Happy First Rakhi Together!{" "}
                <span className="letter-full__emoji">🫶</span>
              </h2>

              {/* Bottom divider */}
              <div className="letter-full__divider letter-full__divider--bottom">
                <span className="letter-full__divider-line" />
                <span className="letter-full__divider-heart">♡</span>
                <span className="letter-full__divider-line" />
              </div>
            </div>
          </div>

          {/* Action button leading to Draggable Memory Wall */}
          <div className="letter-full__cta-wrap">
            <button
              type="button"
              className="letter-full__cta"
              onClick={onContinue}
              aria-label="Continue to memories"
            >
              <span className="letter-full__cta-label">TAP TO CONTINUE</span>
              <span className="letter-full__cta-arrow" aria-hidden="true">
                ︾
              </span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
