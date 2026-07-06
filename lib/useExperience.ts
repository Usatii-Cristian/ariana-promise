import { useReducer } from "react";
import { Stage } from "./types";

/** Numărul de încercări greșite după care apare butonul "Sari peste". */
export const MAX_ATTEMPTS_BEFORE_SKIP = 3;

export type ExperienceState = {
  stage: Stage;
  /** Ce stele au fost atinse, în ordinea atingerii (indici din content.moments). */
  touchOrder: number[];
  /** Câte răspunsuri greșite s-au dat la lacăt. */
  attempts: number;
};

export type ExperienceAction =
  | { type: "OPEN_MAP" }
  | { type: "TOUCH_STAR"; index: number }
  | { type: "REORGANIZE" }
  | { type: "OPEN_LOCK" }
  | { type: "WRONG_ANSWER" }
  | { type: "UNLOCK" }
  | { type: "OPEN_LETTER" }
  | { type: "RESET" };

const initialState: ExperienceState = {
  stage: Stage.Awaken,
  touchOrder: [],
  attempts: 0,
};

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "OPEN_MAP":
      return { ...state, stage: Stage.Map };

    case "TOUCH_STAR":
      // O stea se poate atinge o singură dată; ordinea se păstrează.
      if (state.touchOrder.includes(action.index)) return state;
      return { ...state, touchOrder: [...state.touchOrder, action.index] };

    case "REORGANIZE":
      return { ...state, stage: Stage.Reorganize };

    case "OPEN_LOCK":
      return { ...state, stage: Stage.Lock };

    case "WRONG_ANSWER":
      return { ...state, attempts: state.attempts + 1 };

    case "UNLOCK":
      return { ...state, stage: Stage.Reveal };

    case "OPEN_LETTER":
      return { ...state, stage: Stage.Letter };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

export function useExperience() {
  return useReducer(experienceReducer, initialState);
}
