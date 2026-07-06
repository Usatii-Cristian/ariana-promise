"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";

type Diff = { days: number; hours: number; minutes: number };

/** Timp total împreună: zile totale + orele și minutele din ziua curentă. */
function computeDiff(start: Date, now: Date): Diff {
  const totalSeconds = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
  };
}

const startDate = new Date(
  content.reveal.startDate.year,
  content.reveal.startDate.month - 1,
  content.reveal.startDate.day,
);

/** Counter live: de cât timp sunteți împreună. */
export function Counter() {
  // Evită mismatch de hidratare: calculăm întâi pe client.
  const [diff, setDiff] = useState<Diff | null>(null);

  useEffect(() => {
    const tick = () => setDiff(computeDiff(startDate, new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tiles: { value: number; label: string }[] = diff
    ? [
        { value: diff.days, label: "zile" },
        { value: diff.hours, label: "ore" },
        { value: diff.minutes, label: "minute" },
      ]
    : [];

  return (
    <div>
      <p className="text-center font-sans text-xs uppercase tracking-[0.25em] text-gold-500/80">
        {content.reveal.counterLabel}
      </p>
      <div
        className="mt-3 flex items-start justify-center gap-3 sm:gap-5"
        aria-live="off"
      >
        {tiles.map((t) => (
          <div key={t.label} className="flex flex-col items-center">
            <span className="font-serif text-3xl tabular-nums text-cream sm:text-4xl">
              {t.value}
            </span>
            <span className="mt-0.5 font-sans text-[10px] uppercase tracking-widest text-cream/55">
              {t.label}
            </span>
          </div>
        ))}
        {!diff && (
          <span className="font-serif text-2xl text-cream/40">…</span>
        )}
      </div>
    </div>
  );
}
