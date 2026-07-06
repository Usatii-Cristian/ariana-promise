"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate as animateValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { Stage } from "@/lib/types";
import { useMeasure } from "@/hooks/useMeasure";
import { mapPositions, ringCenter, ringPositions } from "@/lib/geometry";
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
const UNLOCK_GLOW = 750;

/** Timpul (ms) în care stelele se adună pe conturul inelului. */
const GATHER_MS = 600;
/** Câte grade "recuperează" învârtirea înainte să se oprească exact în poziție. */
const SPIN_START_DEG = 900;
/** Durata (ms) învârtirii rapide care încetinește treptat până se oprește. */
const SPIN_MS = 1500;
/** Pauză (ms) după ce inelul s-a oprit, înainte să apară lacătul. */
const SETTLE_PAUSE_MS = 500;
/** Total: adunare → învârtire → pauză → lacăt. */
const LOCK_DELAY = GATHER_MS + SPIN_MS + SETTLE_PAUSE_MS;

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
  const [spinning, setSpinning] = useState(false);
  const rotate = useMotionValue(0);

  const total = content.moments.length;
  const allTouched = touchOrder.length === total;

  const onMap = stage === Stage.Map;
  const inRing = stage !== Stage.Map; // Reorganize / Lock / Reveal
  const positions = measured
    ? inRing
      ? ringPositions(size)
      : mapPositions(size)
    : [];
  const center = measured ? ringCenter(size) : { x: 0, y: 0 };

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

  // Stelele se adună întâi pe contur (tween-ul din Star), apoi se învârt
  // rapid în jurul centrului și încetinesc treptat până se opresc exact
  // pe poziția finală — ca o roată care se oprește.
  useEffect(() => {
    if (stage !== Stage.Reorganize) {
      rotate.set(0);
      const reset = setTimeout(() => setSpinning(false), 0);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setSpinning(true), GATHER_MS);
    return () => clearTimeout(t);
  }, [stage, rotate]);

  useEffect(() => {
    if (!spinning) return;
    rotate.set(SPIN_START_DEG);
    const controls = animateValue(rotate, 0, {
      duration: SPIN_MS / 1000,
      ease: [0.14, 0.8, 0.28, 1],
    });
    return () => controls.stop();
  }, [spinning, rotate]);

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
        style={{
          rotate,
          transformOrigin: `${center.x}px ${center.y}px`,
        }}
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

      {/* Conturul inelului — se conturează chiar când stelele se opresc din învârtit. */}
      <AnimatePresence>
        {measured &&
          (stage === Stage.Reorganize || stage === Stage.Lock) && (
            <motion.div
              key="ring"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                stage === Stage.Reorganize
                  ? { duration: 0.5, delay: (GATHER_MS + SPIN_MS - 250) / 1000 }
                  : { duration: 0.4 }
              }
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

      {/* Șoaptă — apare exact când învârtirea se oprește. */}
      <AnimatePresence>
        {stage === Stage.Reorganize && (
          <motion.p
            key="reorg-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: (GATHER_MS + SPIN_MS) / 1000 }}
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
