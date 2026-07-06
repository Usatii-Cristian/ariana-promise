"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Stage } from "@/lib/types";
import { useExperience } from "@/lib/useExperience";
import { Starfield } from "./Starfield";
import { SoundToggle } from "./SoundToggle";
import { StageAwaken } from "./stages/StageAwaken";
import { StageLetter } from "./stages/StageLetter";
import { Sky } from "./sky/Sky";

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

/** Orchestratorul întregii experiențe „Constelația Noastră”. */
export function Experience() {
  const [state, dispatch] = useExperience();
  const view = viewFor(state.stage);
  const onSky = view === "sky";

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
          <Starfield />
          <SoundToggle />
        </>
      )}

      <AnimatePresence>
        {view === "awaken" && (
          <motion.div key="awaken" {...fade} className="absolute inset-0">
            <StageAwaken onOpen={() => dispatch({ type: "OPEN_MAP" })} />
          </motion.div>
        )}

        {onSky && (
          <motion.div key="sky" {...fade} className="absolute inset-0">
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
            <StageLetter onRestart={() => dispatch({ type: "RESET" })} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
