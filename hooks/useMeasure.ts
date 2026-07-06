import { useLayoutEffect, useRef, useState } from "react";

export type Size = { width: number; height: number };

/**
 * Măsoară dimensiunea unui element și o actualizează la resize.
 * Folosit pentru a poziționa stelele în pixeli (transform GPU-friendly),
 * indiferent de mărimea ecranului.
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (w: number, h: number) => {
      setSize((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h },
      );
    };

    update(el.clientWidth, el.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, size } as const;
}
