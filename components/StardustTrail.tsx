"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isNarrowViewport } from "@/lib/motionPrefs";

type Particle = { x: number; y: number; life: number; size: number };

/** Interval minim (ms) între două puncte noi — evită supraaglomerarea la swipe rapid. */
const SAMPLE_MS = 26;

/**
 * Urmă de scântei aurii sub deget/mouse pe cerul înstelat — o mică joacă,
 * nu doar o navigare. Canvas cu pointer-events:none, deci nu blochează
 * niciodată atingerea stelelor de dedesubt.
 */
export function StardustTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

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

    const maxParticles = isNarrowViewport() ? 55 : 110;
    const particles: Particle[] = [];
    let lastSample = 0;

    const addPoint = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSample < SAMPLE_MS) return;
      lastSample = now;
      particles.push({ x, y, life: 1, size: Math.random() * 1.4 + 0.8 });
      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }
    };

    const onPointerMove = (e: PointerEvent) => addPoint(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) addPoint(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= 0.035;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 200, 132, ${p.life * 0.8})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
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
