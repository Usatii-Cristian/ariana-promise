"use client";

/**
 * Ilustrație SVG a unui inel, desenată în cod (nu poză): bandă aurie
 * stilizată + o piatră fațetată. Simplă și rafinată.
 */
export function RingIllustration({ size = 132 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Un inel auriu cu o piatră"
      className="drop-shadow-[0_0_18px_rgba(230,200,132,0.55)]"
    >
      <defs>
        <linearGradient id="band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3e3bd" />
          <stop offset="50%" stopColor="#d4ad5c" />
          <stop offset="100%" stopColor="#f3e3bd" />
        </linearGradient>
        <radialGradient id="gem" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#fbf3dd" />
          <stop offset="60%" stopColor="#e6c884" />
          <stop offset="100%" stopColor="#c99a45" />
        </radialGradient>
      </defs>

      {/* Banda inelului */}
      <circle
        cx="60"
        cy="72"
        r="34"
        fill="none"
        stroke="url(#band)"
        strokeWidth="7"
      />
      <circle
        cx="60"
        cy="72"
        r="34"
        fill="none"
        stroke="#fff8e7"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* Montura pietrei */}
      <path
        d="M50 34 L60 22 L70 34 L60 44 Z"
        fill="url(#gem)"
        stroke="#c99a45"
        strokeWidth="1"
      />
      {/* Fațete */}
      <path
        d="M60 22 L60 44 M50 34 L70 34"
        stroke="#fff8e7"
        strokeOpacity="0.7"
        strokeWidth="0.8"
      />
      {/* Sclipire */}
      <circle cx="56" cy="30" r="1.6" fill="#fffbef" />
    </svg>
  );
}
