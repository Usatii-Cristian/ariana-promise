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
    </motion.svg>
  );
}
