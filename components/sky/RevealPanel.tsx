"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { RingIllustration } from "./RingIllustration";
import { Counter } from "./Counter";
import { MiniSparkBurst } from "@/components/effects/MiniSparkBurst";

type RevealPanelProps = {
  onContinue: () => void;
};

/** Dacă nu atinge inelul singură, cursul continuă oricum după atât timp. */
const CUE_FALLBACK_MS = 14000;

/**
 * ETAPA 5 — reveal-ul principal: inelul, counter-ul, mesajul de promise
 * și — cel mai important — momentul în care ea atinge inelul de pe ecran.
 * Ăsta e semnalul perfect ca inelul real să apară chiar atunci, în persoană.
 */
export function RevealPanel({ onContinue }: RevealPanelProps) {
  const [cueRevealed, setCueRevealed] = useState(false);
  const firedRef = useRef(false);
  const ringControls = useAnimationControls();

  const revealCue = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    setCueRevealed(true);
    ringControls.start({
      scale: [1, 1.18, 1],
      transition: { duration: 0.6, ease: "easeOut" },
    });
  }, [ringControls]);

  useEffect(() => {
    const t = setTimeout(revealCue, CUE_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [revealCue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <button
          type="button"
          onClick={revealCue}
          aria-label={content.reveal.physicalCue.prompt}
          className="relative rounded-full"
        >
          <motion.div animate={ringControls}>
            <RingIllustration />
          </motion.div>
          {cueRevealed && <MiniSparkBurst count={14} spread={46} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {!cueRevealed && (
          <motion.p
            key="cue-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.35, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 2.2,
                delay: 1.6,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            className="mt-3 font-sans text-xs uppercase tracking-[0.22em] text-gold-500/70"
          >
            {content.reveal.physicalCue.prompt}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="mt-6"
      >
        <Counter />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-8 max-w-md font-serif text-xl italic leading-relaxed text-cream sm:text-2xl"
      >
        {content.reveal.promise}
      </motion.p>

      <AnimatePresence>
        {cueRevealed && (
          <motion.p
            key="cue-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-5 max-w-sm font-serif text-lg italic text-gold-400 sm:text-xl"
          >
            {content.reveal.physicalCue.message}
          </motion.p>
        )}
      </AnimatePresence>

      {cueRevealed && (
        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 rounded-full border border-gold-500/40 px-6 py-2.5 font-sans text-sm tracking-wide text-gold-400 transition-colors hover:bg-gold-500/10"
        >
          Mai am ceva să-ți spun
        </motion.button>
      )}
    </motion.div>
  );
}
