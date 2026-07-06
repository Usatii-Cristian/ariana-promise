"use client";

import { motion } from "framer-motion";
import type { Point } from "@/lib/types";

type StarProps = {
  point: Point;
  touched: boolean;
  interactive: boolean;
  label: string;
  onTouch: () => void;
};

/**
 * O stea-moment. Se poziționează prin transform (x/y), deci morph-ul
 * hartă → inel e accelerat GPU. Când e atinsă, capătă glow auriu.
 */
export function Star({ point, touched, interactive, label, onTouch }: StarProps) {
  return (
    <motion.div
      className="absolute left-0 top-0"
      initial={false}
      animate={{ x: point.x, y: point.y }}
      transition={{ type: "tween", duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        disabled={!interactive}
        onClick={interactive ? onTouch : undefined}
        aria-label={label}
        aria-pressed={touched}
        className="-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full"
        style={{
          width: 44,
          height: 44,
          cursor: interactive ? "pointer" : "default",
        }}
      >
        {/* Glow */}
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          animate={{
            opacity: touched ? [0.5, 0.85, 0.5] : 0.18,
            scale: touched ? [1, 1.15, 1] : 1,
          }}
          transition={
            touched
              ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
          }
          style={{
            width: touched ? 34 : 18,
            height: touched ? 34 : 18,
            background:
              "radial-gradient(circle, var(--color-gold-400) 0%, rgba(230,200,132,0) 70%)",
          }}
        />
        {/* Miezul stelei */}
        <motion.span
          aria-hidden
          className="relative rounded-full"
          animate={{
            width: touched ? 7 : 5,
            height: touched ? 7 : 5,
            boxShadow: touched
              ? "0 0 10px 2px var(--color-gold-500)"
              : "0 0 4px 1px rgba(246,239,225,0.5)",
          }}
          transition={{ duration: 0.4 }}
          style={{ background: touched ? "var(--color-gold-400)" : "#f6efe1" }}
        />
      </button>
    </motion.div>
  );
}
