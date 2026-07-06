/** Cele 6 etape ale experienței, în ordine. */
export enum Stage {
  Awaken = "awaken",
  Map = "map",
  Reorganize = "reorganize",
  Lock = "lock",
  Reveal = "reveal",
  Letter = "letter",
}

/** Un punct în pixeli, relativ la containerul cerului. */
export type Point = { x: number; y: number };
