import type { Point } from "./types";
import type { Size } from "@/hooks/useMeasure";
import { content } from "./content";

/** Poziția fiecărui moment pe hartă (Etapa 2), în pixeli. */
export function mapPositions(size: Size): Point[] {
  return content.moments.map((m) => ({
    x: m.x * size.width,
    y: m.y * size.height,
  }));
}

/** Raza inelului în pixeli — se scalează cu latura mică a containerului. */
function ringRadius(size: Size): number {
  return Math.min(size.width, size.height) * 0.34;
}

/** Centrul inelului. */
export function ringCenter(size: Size): Point {
  return { x: size.width / 2, y: size.height / 2 };
}

/**
 * Pozițiile stelelor pe conturul inelului (Etapa 3+).
 * Lăsăm vârful (sus) liber pentru "piatra" simbolică.
 */
export function ringPositions(size: Size, count = content.moments.length): Point[] {
  const c = ringCenter(size);
  const r = ringRadius(size);
  const gap = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    // Pornim de la -60° ca sus (-90°) să rămână liber pentru piatră.
    const deg = -60 + i * gap;
    const rad = (deg * Math.PI) / 180;
    return { x: c.x + r * Math.cos(rad), y: c.y + r * Math.sin(rad) };
  });
}

/** Poziția "pietrei" din vârful inelului. */
export function gemPosition(size: Size): Point {
  const c = ringCenter(size);
  return { x: c.x, y: c.y - ringRadius(size) };
}

export { ringRadius };
