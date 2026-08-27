type LetterContinueCtaProps = {
  isVisible: boolean;
  onContinue?: () => void;
};

export function LetterContinueCta({ isVisible, onContinue }: LetterContinueCtaProps) {
  return (
    <div className={`letter-cta${isVisible ? " letter-cta--visible" : ""}`}>
      <button
        type="button"
        className="letter-cta__button"
        onClick={onContinue}
        aria-label="Continue"
      >
        <span className="letter-cta__label">TAP TO CONTINUE</span>
        <span className="letter-cta__arrow" aria-hidden="true">︾</span>
      </button>
    </div>
  );
}