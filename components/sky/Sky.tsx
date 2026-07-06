"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { Stage } from "@/lib/types";
import { useMeasure } from "@/hooks/useMeasure";
import { mapPositions, ringPositions } from "@/lib/geometry";
import { Star } from "./Star";
import { ConstellationLines } from "./ConstellationLines";
import { RingOutline } from "./RingOutline";
import { MomentCard } from "./MomentCard";
import { LockPanel } from "./LockPanel";
import { SparkBurst } from "./SparkBurst";
import { RevealPanel } from "./RevealPanel";

type SkyProps = {
  stage: Stage;
  touchOrder: number[];
  attempts: number;
  onTouchStar: (index: number) => void;
  onReorganize: () => void;
  onOpenLock: () => void;
  onWrong: () => void;
  onUnlock: () => void;
  onOpenLetter: () => void;
};

/** Milisecunde de pauză între sub-etapele automate. */
const REORGANIZE_DELAY = 900;
const LOCK_DELAY = 1000;
const UNLOCK_GLOW = 750;

/**
 * Scena persistentă (Etapele 2–5). Aceleași stele traversează etapele,
 * deci morph-ul hartă → inel e continuu ("erau de fapt un inel").
 */
export function Sky({
  stage,
  touchOrder,
  attempts,
  onTouchStar,
  onReorganize,
  onOpenLock,
  onWrong,
  onUnlock,
  onOpenLetter,
}: SkyProps) {
  const { ref, size } = useMeasure<HTMLDivElement>();
  const measured = size.width > 0 && size.height > 0;

  const [activeMoment, setActiveMoment] = useState<number | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const total = content.moments.length;
  const allTouched = touchOrder.length === total;

  const onMap = stage === Stage.Map;
  const inRing = stage !== Stage.Map; // Reorganize / Lock / Reveal
  const positions = measured
    ? inRing
      ? ringPositions(size)
      : mapPositions(size)
    : [];

  // Auto-avans: toate stelele atinse → reorganizează în inel.
  useEffect(() => {
    if (onMap && allTouched) {
      const t = setTimeout(onReorganize, REORGANIZE_DELAY);
      return () => clearTimeout(t);
    }
  }, [onMap, allTouched, onReorganize]);

  // După ce inelul s-a conturat → deschide lacătul.
  useEffect(() => {
    if (stage === Stage.Reorganize) {
      const t = setTimeout(onOpenLock, LOCK_DELAY);
      return () => clearTimeout(t);
    }
  }, [stage, onOpenLock]);

  // Deblocare: scurt glow pe inel, apoi reveal.
  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(onUnlock, UNLOCK_GLOW);
  };

  const handleStarClick = (index: number) => {
    onTouchStar(index);
    setActiveMoment(index);
  };

  return (
    <div ref={ref} className="relative h-dvh w-full overflow-hidden">
      {/* Stelele — dispar la reveal (inelul "explodează" în lumină). */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: stage === Stage.Reveal ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {measured &&
          content.moments.map((m, i) => (
            <Star
              key={i}
              point={positions[i]}
              touched={touchOrder.includes(i)}
              interactive={onMap}
              label={`${m.date}: ${m.title}`}
              onTouch={() => handleStarClick(i)}
            />
          ))}
      </motion.div>

      {/* Liniile constelației (doar pe hartă). */}
      <AnimatePresence>
        {onMap && measured && touchOrder.length >= 2 && (
          <ConstellationLines
            points={mapPositions(size)}
            touchOrder={touchOrder}
            size={size}
          />
        )}
      </AnimatePresence>

      {/* Conturul inelului (reorganizare + lacăt). */}
      <AnimatePresence>
        {measured &&
          (stage === Stage.Reorganize || stage === Stage.Lock) && (
            <motion.div
              key="ring"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RingOutline size={size} glow={unlocking} />
            </motion.div>
          )}
      </AnimatePresence>

      {/* Cărticica momentului activ. */}
      <AnimatePresence>
        {onMap && activeMoment !== null && measured && (
          <MomentCard
            key={activeMoment}
            moment={content.moments[activeMoment]}
            point={mapPositions(size)[activeMoment]}
            size={size}
            onClose={() => setActiveMoment(null)}
          />
        )}
      </AnimatePresence>

      {/* Instrucțiune + progres (doar pe hartă). */}
      <AnimatePresence>
        {onMap && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <span className="font-sans text-sm tracking-wide text-cream/70">
              {content.map.hint}
            </span>
            <span className="font-sans text-xs tabular-nums text-gold-500/80">
              {touchOrder.length}/{total}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Șoaptă în timpul reorganizării. */}
      <AnimatePresence>
        {stage === Stage.Reorganize && (
          <motion.p
            key="reorg-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-serif text-lg italic text-gold-400/90"
          >
            …erau, de fapt, un inel.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Lacătul personal. */}
      <AnimatePresence>
        {stage === Stage.Lock && !unlocking && (
          <LockPanel
            key="lock"
            attempts={attempts}
            onWrong={onWrong}
            onUnlock={handleUnlock}
          />
        )}
      </AnimatePresence>

      {/* Reveal-ul: explozie de lumină + inel + counter + promise. */}
      {stage === Stage.Reveal && (
        <>
          <SparkBurst />
          <RevealPanel onContinue={onOpenLetter} />
        </>
      )}
    </div>
  );
}
