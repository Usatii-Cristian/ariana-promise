/** Verifică preferința sistemului pentru mișcare redusă. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Ecran îngust (telefon) — folosit ca să limităm numărul de particule/frecvența efectelor. */
export function isNarrowViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 480;
}
