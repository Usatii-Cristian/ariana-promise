"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Point } from "@/lib/types";

const DEFAULT_COUNT = 9;
const DEFAULT_SPREAD = 32;

type Spark = { dx: number; dy: number; size: number };

function createSparks(count: number, spread: number): Spark[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const distance = spread * 0.55 + Math.random() * spread * 0.45;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: Math.random() * 2 + 2,
    };
  });
}

type MiniSparkBurstProps = {
  /** Poziție absolută (px) în containerul relativ. Omis = se centrează pe părinte. */
  point?: Point;
  count?: number;
  spread?: number;
};

/**
 * Mic izbucnet de scântei aurii — la atingerea unei stele sau a inelului.
 * Fără poziție, se centrează automat pe elementul părinte (position: relative).
 */
export function MiniSparkBurst({
  point,
  count = DEFAULT_COUNT,
  spread = DEFAULT_SPREAD,
}: MiniSparkBurstProps) {
  const sparks = useMemo(() => createSparks(count, spread), [count, spread]);

  return (
    <div
      aria-hidden
      className={
        point
          ? "pointer-events-none absolute left-0 top-0"
          : "pointer-events-none absolute left-1/2 top-1/2"
      }
      style={point ? { transform: `translate(${point.x}px, ${point.y}px)` } : undefined}
    >
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: "var(--color-gold-400)",
            boxShadow: "0 0 4px 1px var(--color-gold-500)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
