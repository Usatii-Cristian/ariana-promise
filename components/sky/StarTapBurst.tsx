"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Point } from "@/lib/types";

const SPARK_COUNT = 8;

type Spark = { dx: number; dy: number; size: number };

function createSparks(): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, i) => {
    const angle = (i / SPARK_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 18 + Math.random() * 16;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: Math.random() * 2 + 2,
    };
  });
}

type StarTapBurstProps = {
  point: Point;
};

/** Mic izbucnet de scântei la atingerea unei stele — satisfacție instant. */
export function StarTapBurst({ point }: StarTapBurstProps) {
  const sparks = useMemo(() => createSparks(), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
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
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
