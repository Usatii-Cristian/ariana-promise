"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Stage } from "@/lib/types";
import { useExperience } from "@/lib/useExperience";
import { NightSky } from "./NightSky";
import { SoundToggle } from "./SoundToggle";
import { StageAwaken } from "./stages/StageAwaken";
import { StageLetter } from "./stages/StageLetter";
import { Sky } from "./sky/Sky";
import { CatchStarsGame } from "./bonus/CatchStarsGame";

/** Cele trei „priveliști” de nivel înalt (Sky înglobează etapele 2–5). */
type View = "awaken" | "sky" | "letter";

function viewFor(stage: Stage): View {
  if (stage === Stage.Awaken) return "awaken";
  if (stage === Stage.Letter) return "letter";
  return "sky";
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

/** Tranziția din Etapa 1 (Luceafărul): se estompează spre exterior, ca și cum ai trece prin ea. */
const awakenExit = {
  initial: { opacity: 0, scale: 1.03 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.08 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** Cerul intră ca și cum ai pluti spre stele. */
const skyEnter = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** Milisecunde cât rămâne vizibil flash-ul auriu la trecerea spre cer. */
const FLASH_MS = 750;

/** Orchestratorul întregii experiențe „Constelația Noastră”. */
export function Experience() {
  const [state, dispatch] = useExperience();
  const [flash, setFlash] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);
  const view = viewFor(state.stage);
  const onSky = view === "sky";

  // O scânteie aurie marchează trecerea din poem spre harta stelelor.
  const openMap = () => {
    setFlash(true);
    dispatch({ type: "OPEN_MAP" });
    setTimeout(() => setFlash(false), FLASH_MS);
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Cerul de noapte: gradient bleumarin → negru, doar în afara scrisorii. */}
      {view !== "letter" && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 -z-10"
            style={{
              background:
                "radial-gradient(120% 100% at 50% -10%, #121a44 0%, #070b1c 45%, #04060f 100%)",
            }}
          />
          <NightSky />
          <SoundToggle />
        </>
      )}

      <AnimatePresence>
        {view === "awaken" && (
          <motion.div key="awaken" {...awakenExit} className="absolute inset-0">
            <StageAwaken onOpen={openMap} />
          </motion.div>
        )}

        {onSky && (
          <motion.div key="sky" {...skyEnter} className="absolute inset-0">
            <Sky
              stage={state.stage}
              touchOrder={state.touchOrder}
              attempts={state.attempts}
              onTouchStar={(index) => dispatch({ type: "TOUCH_STAR", index })}
              onReorganize={() => dispatch({ type: "REORGANIZE" })}
              onOpenLock={() => dispatch({ type: "OPEN_LOCK" })}
              onWrong={() => dispatch({ type: "WRONG_ANSWER" })}
              onUnlock={() => dispatch({ type: "UNLOCK" })}
              onOpenLetter={() => dispatch({ type: "OPEN_LETTER" })}
            />
          </motion.div>
        )}

        {view === "letter" && (
          <motion.div key="letter" {...fade} className="absolute inset-0 overflow-y-auto">
            <StageLetter
              onRestart={() => dispatch({ type: "RESET" })}
              onOpenBonus={() => setBonusOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Joc bonus, deschis din scrisoare. */}
      <AnimatePresence>
        {bonusOpen && <CatchStarsGame onClose={() => setBonusOpen(false)} />}
      </AnimatePresence>

      {/* Scânteia care marchează trecerea din poem spre harta stelelor. */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_MS / 1000, times: [0, 0.3, 1], ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(243,227,189,0.85) 0%, rgba(230,200,132,0.2) 40%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
