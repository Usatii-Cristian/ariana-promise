"use client";

import { motion } from "framer-motion";
import { content } from "@/lib/content";
import { RingIllustration } from "./RingIllustration";
import { Counter } from "./Counter";

type RevealPanelProps = {
  onContinue: () => void;
};

/** ETAPA 5 — reveal-ul principal: inelul, counter-ul și mesajul de promise. */
export function RevealPanel({ onContinue }: RevealPanelProps) {
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
      >
        <RingIllustration />
      </motion.div>

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

      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="mt-10 rounded-full border border-gold-500/40 px-6 py-2.5 font-sans text-sm tracking-wide text-gold-400 transition-colors hover:bg-gold-500/10"
      >
        Mai am ceva să-ți spun
      </motion.button>
    </motion.div>
  );
}
