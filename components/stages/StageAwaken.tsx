"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { content } from "@/lib/content";
import { Typewriter } from "@/components/Typewriter";

type StageAwakenProps = {
  onOpen: () => void;
};

/** ETAPA 1 — cerul se trezește: text scris literă-cu-literă + buton pulsant. */
export function StageAwaken({ onOpen }: StageAwakenProps) {
  const [showCta, setShowCta] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl font-serif text-2xl leading-relaxed text-cream sm:text-3xl md:text-4xl"
      >
        <Typewriter
          text={content.awaken.intro}
          onDone={() => setShowCta(true)}
        />
      </motion.p>

      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, y: 8 }}
        animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: showCta ? "auto" : "none" }}
        className="group relative mt-12 rounded-full border border-gold-500/40 bg-gold-500/5 px-8 py-3 font-sans text-sm tracking-wide text-gold-400 backdrop-blur-sm transition-colors hover:bg-gold-500/15"
      >
        {/* Halou pulsant discret în spatele butonului. */}
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-gold-500/20 blur-md"
          animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {content.awaken.cta}
      </motion.button>
    </div>
  );
}
