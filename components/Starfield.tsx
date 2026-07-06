"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number; // fracție 0..1
  y: number;
  r: number; // rază px
  base: number; // opacitate de bază
  amp: number; // amplitudinea sclipirii
  speed: number;
  phase: number;
};

/** Câte stele mici desenăm — plafonat pentru telefoane mid-range. */
const STAR_COUNT = 55;

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.1 + 0.4,
    base: Math.random() * 0.35 + 0.15,
    amp: Math.random() * 0.4 + 0.2,
    speed: Math.random() * 0.0012 + 0.0004,
    phase: Math.random() * Math.PI * 2,
  }));
}

/**
 * Cer de noapte animat: stele mici care sclipesc aleatoriu.
 * Gradientul închis stă pe wrapper (CSS), canvas-ul desenează doar stelele.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>(createStars());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of starsRef.current) {
        const alpha = reduceMotion
          ? s.base + s.amp * 0.5
          : Math.max(0, s.base + s.amp * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 239, 225, ${alpha})`;
        ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
