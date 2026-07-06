"use client";

import { motion } from "framer-motion";
import type { Moment } from "@/lib/content";
import type { Point } from "@/lib/types";
import type { Size } from "@/hooks/useMeasure";

type MomentCardProps = {
  moment: Moment;
  point: Point;
  size: Size;
  onClose: () => void;
};

const CARD_WIDTH = 260;

/** Cărticica unui moment: dată + titlu + descriere, ancorată lângă stea. */
export function MomentCard({ moment, point, size, onClose }: MomentCardProps) {
  const width = Math.min(CARD_WIDTH, size.width - 24);
  const left = Math.min(Math.max(point.x - width / 2, 12), size.width - width - 12);

  // Sub stea dacă e în jumătatea de sus, deasupra dacă e în jumătatea de jos.
  const below = point.y < size.height / 2;
  const top = below ? point.y + 26 : point.y - 26;

  return (
    <motion.div
      role="dialog"
      aria-label={`${moment.title}. ${moment.text}`}
      initial={{ opacity: 0, scale: 0.94, y: below ? -6 : 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={onClose}
      className="absolute z-20 cursor-pointer rounded-2xl border border-gold-500/25 bg-night-800/85 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
      style={{
        left,
        top,
        width,
        transform: below ? "none" : "translateY(-100%)",
      }}
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-gold-500/90">
        {moment.date}
      </p>
      <h3 className="mt-1 font-serif text-xl text-cream">{moment.title}</h3>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-cream/75">
        {moment.text}
      </p>
    </motion.div>
  );
}
