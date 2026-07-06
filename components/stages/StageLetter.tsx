"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { content } from "@/lib/content";
import { TapSparkleField } from "@/components/effects/TapSparkleField";

type StageLetterProps = {
  onRestart: () => void;
  onOpenBonus: () => void;
};

/** ETAPA 6 — scrisoarea finală: fundal cald, tipografie serif, spațiere generoasă. */
export function StageLetter({ onRestart, onOpenBonus }: StageLetterProps) {
  const { greeting, paragraphs, signature, restart } = content.letter;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-dvh w-full"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 0%, #f6efe1 0%, #ece0c9 55%, #e3d3b6 100%)",
      }}
    >
      <TapSparkleField className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-7 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif text-3xl italic text-bordo sm:text-4xl"
        >
          {greeting}
        </motion.h2>

        <div className="mt-8 space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.25 }}
              className="font-serif text-xl leading-relaxed text-night-900/85 sm:text-2xl"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 + paragraphs.length * 0.25 }}
          className="mt-10 font-serif text-xl italic text-bordo sm:text-2xl"
        >
          {signature}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + paragraphs.length * 0.25 }}
          className="mt-14 flex flex-wrap gap-3"
        >
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border border-bordo/30 px-6 py-2.5 font-sans text-sm tracking-wide text-bordo transition-colors hover:bg-bordo/5"
          >
            {restart}
          </button>
          <button
            type="button"
            onClick={onOpenBonus}
            className="rounded-full bg-bordo/90 px-6 py-2.5 font-sans text-sm tracking-wide text-cream transition-colors hover:bg-bordo"
          >
            {content.bonusGame.cta}
          </button>
        </motion.div>

        {/* P.S. — o poză-glumă, ca un mic bilet găsit la finalul scrisorii. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 + paragraphs.length * 0.25 }}
          className="mt-16 flex flex-col items-center self-center"
        >
          <div className="w-48 -rotate-2 rounded-lg bg-white p-2 shadow-lg sm:w-56">
            <div className="relative aspect-[3/4] overflow-hidden rounded">
              <Image
                src="/inel-haios.jpg"
                alt="Ariana râzând, arătând jucăuș un «inel» cu mult înainte de cel adevărat"
                fill
                sizes="(max-width: 640px) 12rem, 14rem"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-serif text-xs italic text-night-900/70">
              {content.letter.psCaption}
            </p>
          </div>
        </motion.div>
      </TapSparkleField>
    </motion.div>
  );
}
