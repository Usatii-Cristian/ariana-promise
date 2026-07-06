"use client";

import { useRef, useState } from "react";
import { MiniSparkBurst } from "./MiniSparkBurst";
import type { Point } from "@/lib/types";

/** Cât timp (ms) rămâne montat un izbucnet de scântei după o atingere. */
const BURST_MS = 650;

type TapSparkleFieldProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Înfășoară orice conținut și lasă un mic izbucnet de scântei oriunde
 * atingi fundalul — o joacă discretă, pe lângă butoanele din interior.
 */
export function TapSparkleField({ children, className }: TapSparkleFieldProps) {
  const [bursts, setBursts] = useState<{ id: number; point: Point }[]>([]);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const id = nextId.current;
    nextId.current += 1;
    setBursts((prev) => [...prev, { id, point }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, BURST_MS);
  };

  return (
    <div
      ref={containerRef}
      className={`relative${className ? ` ${className}` : ""}`}
      onPointerDown={handlePointerDown}
    >
      {children}
      {bursts.map((b) => (
        <MiniSparkBurst key={b.id} point={b.point} count={7} spread={26} />
      ))}
    </div>
  );
}
