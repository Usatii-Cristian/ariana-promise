"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { content } from "@/lib/content";
import { MAX_ATTEMPTS_BEFORE_SKIP } from "@/lib/useExperience";

type LockPanelProps = {
  attempts: number;
  onWrong: () => void;
  onUnlock: () => void;
};

/** Normalizează pentru comparație: fără majuscule, fără spații redundante. */
function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** ETAPA 4 — lacătul personal: o întrebare pe care doar ea o știe. */
export function LockPanel({ attempts, onWrong, onUnlock }: LockPanelProps) {
  const [value, setValue] = useState("");
  const [wrongVisible, setWrongVisible] = useState(false);
  const controls = useAnimationControls();

  const accepted = content.lock.answers.map(normalize);
  const canSkip = attempts >= MAX_ATTEMPTS_BEFORE_SKIP;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted.includes(normalize(value))) {
      onUnlock();
      return;
    }
    onWrong();
    setWrongVisible(true);
    // Shake blând, fără presiune.
    controls.start({
      x: [0, -7, 7, -5, 5, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <div className="w-full max-w-sm rounded-2xl border border-gold-500/20 bg-night-800/80 p-5 backdrop-blur-md">
        <h2 className="text-center font-serif text-xl leading-snug text-cream sm:text-2xl">
          {content.lock.question}
        </h2>

        <form onSubmit={submit} className="mt-4">
          <motion.input
            animate={controls}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setWrongVisible(false);
            }}
            placeholder={content.lock.placeholder}
            aria-label={content.lock.question}
            autoComplete="off"
            className="w-full rounded-full border border-gold-500/30 bg-night-900/60 px-5 py-3 text-center font-sans text-base text-cream placeholder:text-cream/35 focus:border-gold-500/70 focus:outline-none"
          />

          <button
            type="submit"
            className="mt-3 w-full rounded-full bg-gold-500/90 px-5 py-3 font-sans text-sm font-medium tracking-wide text-night-900 transition-colors hover:bg-gold-400"
          >
            Deschide
          </button>
        </form>

        {/* Mesaj cald, doar încurajare. */}
        <div className="mt-3 h-5 text-center" aria-live="polite">
          {wrongVisible && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-sans text-sm text-gold-400/90"
            >
              {content.lock.encouragement}
            </motion.p>
          )}
        </div>

        {canSkip && (
          <div className="mt-1 text-center">
            <button
              type="button"
              onClick={onUnlock}
              className="font-sans text-xs text-cream/45 underline underline-offset-4 transition-colors hover:text-cream/70"
            >
              {content.lock.skip}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
