export function FestiveBackground({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`festive-bg${isVisible ? " festive-bg--visible" : ""}`}
      aria-hidden="true"
    >
      {/* 1. Upper Center Traditional Floral / Leaf Petal Fan Motif */}
      <div className="festive-bg__petal-motif">
        <svg
          viewBox="0 0 600 450"
          className="festive-bg__petal-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.32" fill="#9c27b0">
            {/* Center top petals */}
            <path d="M300 40 C300 40 285 100 300 150 C315 100 300 40 300 40Z" />
            <path d="M300 90 C300 90 280 150 300 200 C320 150 300 90 300 90Z" />
            <path d="M300 140 C300 140 275 200 300 250 C325 200 300 140 300 140Z" />

            {/* Angled radiating petals (left side) */}
            <path d="M260 55 C260 55 240 110 265 160 C285 115 260 55 260 55Z" transform="rotate(-15 260 110)" />
            <path d="M220 80 C220 80 195 130 225 180 C250 135 220 80 220 80Z" transform="rotate(-30 220 130)" />
            <path d="M185 120 C185 120 155 165 190 210 C215 170 185 120 185 120Z" transform="rotate(-45 185 165)" />
            <path d="M160 170 C160 170 125 210 165 250 C190 215 160 170 160 170Z" transform="rotate(-60 160 210)" />
            <path d="M145 230 C145 230 105 265 150 300 C175 270 145 230 145 230Z" transform="rotate(-75 145 265)" />

            {/* Angled radiating petals (right side) */}
            <path d="M340 55 C340 55 360 110 335 160 C315 115 340 55 340 55Z" transform="rotate(15 340 110)" />
            <path d="M380 80 C380 80 405 130 375 180 C350 135 380 80 380 80Z" transform="rotate(30 380 130)" />
            <path d="M415 120 C415 120 445 165 410 210 C385 170 415 120 415 120Z" transform="rotate(45 415 165)" />
            <path d="M440 170 C440 170 475 210 435 250 C410 215 440 170 440 170Z" transform="rotate(60 440 210)" />
            <path d="M455 230 C455 230 495 265 450 300 C425 270 455 230 455 230Z" transform="rotate(75 455 265)" />

            {/* Second outer tier petals */}
            <path d="M275 110 C275 110 250 170 280 220 C305 175 275 110 275 110Z" />
            <path d="M325 110 C325 110 350 170 320 220 C295 175 325 110 325 110Z" />
            <path d="M245 155 C245 155 215 210 250 260 C280 215 245 155 245 155Z" />
            <path d="M355 155 C355 155 385 210 350 260 C320 215 355 155 355 155Z" />
            <path d="M220 210 C220 210 185 260 225 305 C255 265 220 210 220 210Z" />
            <path d="M380 210 C380 210 415 260 375 305 C345 265 380 210 380 210Z" />
          </g>
        </svg>
      </div>

      {/* 2. Left Hanging Golden Rakhi Ornament */}
      <div className="festive-bg__hanging festive-bg__hanging--left">
        <svg
          viewBox="0 0 160 520"
          className="festive-bg__hanging-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradL" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffee88" />
              <stop offset="35%" stopColor="#f5c242" />
              <stop offset="70%" stopColor="#c79124" />
              <stop offset="100%" stopColor="#fff099" />
            </linearGradient>
            <radialGradient id="goldGlowL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4081" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#e040fb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7b1fa2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing magenta/pink accent flare */}
          <circle cx="80" cy="180" r="70" fill="url(#goldGlowL)" />

          {/* Left dotted bead string */}
          <line x1="25" y1="0" x2="25" y2="290" stroke="url(#goldGradL)" strokeWidth="1.5" strokeDasharray="3 4" />
          <g transform="translate(25, 290)">
            <polygon points="0,0 -8,12 0,24 8,12" fill="url(#goldGradL)" />
            <polygon points="0,28 -10,42 0,56 10,42" fill="url(#goldGradL)" />
          </g>

          {/* Right dotted bead string */}
          <line x1="135" y1="0" x2="135" y2="290" stroke="url(#goldGradL)" strokeWidth="1.5" strokeDasharray="3 4" />
          <g transform="translate(135, 290)">
            <polygon points="0,0 -8,12 0,24 8,12" fill="url(#goldGradL)" />
            <polygon points="0,28 -10,42 0,56 10,42" fill="url(#goldGradL)" />
          </g>

          {/* Main vertical center thread */}
          <line x1="80" y1="0" x2="80" y2="520" stroke="url(#goldGradL)" strokeWidth="2.5" />

          {/* Top beads */}
          <circle cx="80" cy="20" r="5.5" fill="url(#goldGradL)" />
          <circle cx="80" cy="80" r="6" fill="url(#goldGradL)" />

          {/* Central Rakhi Medallion */}
          <g transform="translate(80, 180)">
            <circle cx="0" cy="0" r="54" stroke="url(#goldGradL)" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="0" cy="0" r="48" stroke="url(#goldGradL)" strokeWidth="3" />

            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30})`}>
                <ellipse cx="0" cy="-30" rx="4.5" ry="11" fill="url(#goldGradL)" />
              </g>
            ))}

            <circle cx="0" cy="0" r="18" stroke="url(#goldGradL)" strokeWidth="3" />
            <circle cx="0" cy="0" r="10" fill="url(#goldGradL)" />
          </g>

          {/* Lower beads along hanging thread */}
          <circle cx="80" cy="275" r="6" fill="url(#goldGradL)" />
          <circle cx="80" cy="340" r="6.5" fill="url(#goldGradL)" />
          <circle cx="80" cy="405" r="5.5" fill="url(#goldGradL)" />
        </svg>
      </div>

      {/* 3. Right Hanging Golden Rakhi Ornament */}
      <div className="festive-bg__hanging festive-bg__hanging--right">
        <svg
          viewBox="0 0 160 520"
          className="festive-bg__hanging-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradR" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffee88" />
              <stop offset="35%" stopColor="#f5c242" />
              <stop offset="70%" stopColor="#c79124" />
              <stop offset="100%" stopColor="#fff099" />
            </linearGradient>
            <radialGradient id="goldGlowR" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4081" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#e040fb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7b1fa2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing magenta/pink accent flare */}
          <circle cx="80" cy="180" r="70" fill="url(#goldGlowR)" />

          {/* Left dotted bead string */}
          <line x1="25" y1="0" x2="25" y2="290" stroke="url(#goldGradR)" strokeWidth="1.5" strokeDasharray="3 4" />
          <g transform="translate(25, 290)">
            <polygon points="0,0 -8,12 0,24 8,12" fill="url(#goldGradR)" />
            <polygon points="0,28 -10,42 0,56 10,42" fill="url(#goldGradR)" />
          </g>

          {/* Right dotted bead string */}
          <line x1="135" y1="0" x2="135" y2="290" stroke="url(#goldGradR)" strokeWidth="1.5" strokeDasharray="3 4" />
          <g transform="translate(135, 290)">
            <polygon points="0,0 -8,12 0,24 8,12" fill="url(#goldGradR)" />
            <polygon points="0,28 -10,42 0,56 10,42" fill="url(#goldGradR)" />
          </g>

          {/* Main vertical center thread */}
          <line x1="80" y1="0" x2="80" y2="520" stroke="url(#goldGradR)" strokeWidth="2.5" />

          {/* Top beads */}
          <circle cx="80" cy="20" r="5.5" fill="url(#goldGradR)" />
          <circle cx="80" cy="80" r="6" fill="url(#goldGradR)" />

          {/* Central Rakhi Medallion */}
          <g transform="translate(80, 180)">
            <circle cx="0" cy="0" r="54" stroke="url(#goldGradR)" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="0" cy="0" r="48" stroke="url(#goldGradR)" strokeWidth="3" />

            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30})`}>
                <ellipse cx="0" cy="-30" rx="4.5" ry="11" fill="url(#goldGradR)" />
              </g>
            ))}

            <circle cx="0" cy="0" r="18" stroke="url(#goldGradR)" strokeWidth="3" />
            <circle cx="0" cy="0" r="10" fill="url(#goldGradR)" />
          </g>

          {/* Lower beads */}
          <circle cx="80" cy="275" r="6" fill="url(#goldGradR)" />
          <circle cx="80" cy="340" r="6.5" fill="url(#goldGradR)" />
          <circle cx="80" cy="405" r="5.5" fill="url(#goldGradR)" />
        </svg>
      </div>
    </div>
  );
}
