"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { Typewriter } from "@/components/Typewriter";
import { TapSparkleField } from "@/components/effects/TapSparkleField";

type StageAwakenProps = {
  onOpen: () => void;
};

const LINE_STAGGER = 0.35; // secunde între versuri

/**
 * ETAPA 1 — cerul se trezește: versurile din „Luceafărul" apar vers-cu-vers,
 * apoi puntea către Ariana se scrie literă-cu-literă, urmată de butonul pulsant.
 */
export function StageAwaken({ onOpen }: StageAwakenProps) {
  const { poem, attribution, bridge, cta } = content.awaken;
  const [showBridge, setShowBridge] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const poemMs = reduce ? 250 : poem.length * LINE_STAGGER * 1000 + 700;
    const t = setTimeout(() => setShowBridge(true), poemMs);
    return () => clearTimeout(t);
  }, [poem.length]);

  return (
    <TapSparkleField className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {/* Poemul — fiecare vers apare pe cer. */}
      <div className="max-w-md">
        {poem.map((line, i) =>
          line === "" ? (
            <div key={i} aria-hidden className="h-3 sm:h-4" />
          ) : (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * LINE_STAGGER }}
              className="font-serif text-base italic leading-relaxed text-cream/90 sm:text-lg"
            >
              {line}
            </motion.p>
          ),
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: poem.length * LINE_STAGGER }}
          className="mt-3 font-sans text-xs tracking-wide text-gold-500/70"
        >
          {attribution}
        </motion.p>
      </div>

      {/* Puntea personalizată către Ariana. */}
      <p className="mt-8 min-h-[3.5rem] max-w-lg font-serif text-lg leading-relaxed text-cream sm:text-2xl">
        {showBridge && (
          <Typewriter
            text={bridge}
            startDelay={100}
            onDone={() => setShowCta(true)}
          />
        )}
      </p>

      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, y: 8 }}
        animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: showCta ? "auto" : "none" }}
        className="group relative mt-10 rounded-full border border-gold-500/40 bg-gold-500/5 px-8 py-3 font-sans text-sm tracking-wide text-gold-400 backdrop-blur-sm transition-colors hover:bg-gold-500/15"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-gold-500/20 blur-md"
          animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {cta}
      </motion.button>
    </TapSparkleField>
  );
}
