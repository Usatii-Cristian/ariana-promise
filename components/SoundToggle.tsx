"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";

/**
 * Muzică ambientală discretă, generată în browser cu Web Audio API
 * (fără fișier audio extern): câteva oscilatoare ușor dezacordate,
 * filtrate jos, cu un LFO lent pe volum pentru mișcare.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ master: GainNode; stop: () => void } | null>(null);

  const start = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.connect(master);
    master.connect(ctx.destination);

    // Acord cald (A2, E3, A3) ușor dezacordat.
    const freqs = [110, 164.81, 220];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f + (i - 1) * 0.4;
      osc.connect(filter);
      osc.start();
      return osc;
    });

    // LFO lent pe volum pentru „respirație”.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    nodesRef.current = {
      master,
      stop: () => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      },
    };
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    // Fade-out lin, apoi oprește oscilatoarele.
    nodes.master.gain.cancelScheduledValues(ctx.currentTime);
    nodes.master.gain.setValueAtTime(nodes.master.gain.value, ctx.currentTime);
    nodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    const toStop = nodes.stop;
    nodesRef.current = null;
    setTimeout(toStop, 900);
  };

  const toggle = () => {
    if (on) stop();
    else start();
    setOn((v) => !v);
  };

  // Curăță la demontare.
  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? content.audio.off : content.audio.on}
      className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-black/20 text-cream/70 backdrop-blur-sm transition-colors hover:text-cream"
    >
      {on ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9v6h4l5 4V5L8 9H4z"
            fill="currentColor"
          />
          <path
            d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path
            d="M16 9l5 6M21 9l-5 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
