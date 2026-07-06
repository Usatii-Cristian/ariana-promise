"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  /** Milisecunde între litere. */
  speed?: number;
  /** Întârziere înainte de a începe. */
  startDelay?: number;
  className?: string;
  /** Apelat când textul s-a scris complet. */
  onDone?: () => void;
};

/** Scrie un text literă-cu-literă. Respectă prefers-reduced-motion. */
export function Typewriter({
  text,
  speed = 45,
  startDelay = 300,
  className,
  onDone,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Afișează tot instant, dar în afara corpului effect-ului.
      const id = setTimeout(() => {
        setCount(text.length);
        onDone?.();
      }, 0);
      return () => clearTimeout(id);
    }

    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // Rulează o singură dată per text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const done = count >= text.length;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {!done && (
        <span
          aria-hidden
          className="ml-0.5 inline-block w-px animate-pulse align-middle"
          style={{ borderLeft: "2px solid var(--color-gold-500)", height: "1em" }}
        />
      )}
    </span>
  );
}
