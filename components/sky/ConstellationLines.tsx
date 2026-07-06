"use client";

import { motion } from "framer-motion";
import type { Point } from "@/lib/types";
import type { Size } from "@/hooks/useMeasure";

type ConstellationLinesProps = {
  points: Point[];
  /** Indicii stelelor atinse, în ordine. */
  touchOrder: number[];
  size: Size;
};

/**
 * Liniile dintre stelele atinse (2+), desenate progresiv cu pathLength
 * (echivalent strokeDashoffset). Un segment nou se conturează, nu apare instant.
 */
export function ConstellationLines({
  points,
  touchOrder,
  size,
}: ConstellationLinesProps) {
  const segments = touchOrder.slice(1).map((idx, i) => ({
    key: `${touchOrder[i]}-${idx}`,
    from: points[touchOrder[i]],
    to: points[idx],
  }));

  return (
    <motion.svg
      className="pointer-events-none absolute inset-0"
      width={size.width}
      height={size.height}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      aria-hidden
    >
      {segments.map((s) => (
        <motion.line
          key={s.key}
          x1={s.from.x}
          y1={s.from.y}
          x2={s.to.x}
          y2={s.to.y}
          stroke="var(--color-gold-500)"
          strokeWidth={1.2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      ))}
      {/* O mică cometă zboară o singură dată de-a lungul fiecărei linii noi. */}
      {segments.map((s) => (
        <motion.circle
          key={`comet-${s.key}`}
          r={2.6}
          fill="var(--color-gold-400)"
          style={{ filter: "drop-shadow(0 0 4px var(--color-gold-500))" }}
          initial={{ cx: s.from.x, cy: s.from.y, opacity: 0 }}
          animate={{
            cx: [s.from.x, s.to.x],
            cy: [s.from.y, s.to.y],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 0.55, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }}
        />
      ))}
    </motion.svg>
  );
}
