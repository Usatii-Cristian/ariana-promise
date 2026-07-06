"use client";

import { motion } from "framer-motion";
import type { Size } from "@/hooks/useMeasure";
import { gemPosition, ringCenter, ringRadius } from "@/lib/geometry";

type RingOutlineProps = {
  size: Size;
  /** Intensifică strălucirea (la deblocare). */
  glow?: boolean;
};

/** Conturul auriu de inel cu piatră, spre care se aranjează stelele. */
export function RingOutline({ size, glow = false }: RingOutlineProps) {
  const c = ringCenter(size);
  const r = ringRadius(size);
  const gem = gemPosition(size);

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size.width}
      height={size.height}
      aria-hidden
    >
      <motion.circle
        cx={c.x}
        cy={c.y}
        r={r}
        fill="none"
        stroke="var(--color-gold-500)"
        strokeWidth={glow ? 2.4 : 1.4}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: glow ? [0.7, 1, 0.7] : [0.45, 0.7, 0.45],
        }}
        transition={{
          pathLength: { duration: 0.55, ease: "easeInOut" },
          opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          filter: glow
            ? "drop-shadow(0 0 10px var(--color-gold-500))"
            : "drop-shadow(0 0 3px rgba(230,200,132,0.4))",
        }}
      />
      {/* Piatra din vârf. */}
      <motion.path
        d={`M ${gem.x} ${gem.y - 8} L ${gem.x + 7} ${gem.y} L ${gem.x} ${gem.y + 8} L ${gem.x - 7} ${gem.y} Z`}
        fill="var(--color-gold-400)"
        stroke="var(--color-gold-600)"
        strokeWidth={1}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: glow ? [1, 1.18, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          scale: glow
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5, delay: 0.3 },
        }}
        style={{
          transformOrigin: `${gem.x}px ${gem.y}px`,
          filter: "drop-shadow(0 0 6px var(--color-gold-500))",
        }}
      />
    </svg>
  );
}
