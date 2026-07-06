"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isNarrowViewport } from "@/lib/motionPrefs";

type TwinkleStar = {
  x: number; // fracție 0..1
  y: number;
  r: number; // rază px
  base: number; // opacitate de bază
  amp: number; // amplitudinea sclipirii
  speed: number;
  phase: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  length: number;
};

type DustParticle = { x: number; y: number; life: number; size: number };

const STAR_COUNT = 55;
const SAMPLE_MS = 26; // interval minim între puncte noi de scântei (throttle)

function createStars(): TwinkleStar[] {
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

function spawnMeteor(width: number): Meteor {
  const leftToRight = Math.random() > 0.5;
  const speed = Math.random() * 3 + 5;
  return {
    x: leftToRight ? -40 : width + 40,
    y: Math.random() * 160,
    vx: (leftToRight ? 1 : -1) * speed,
    vy: speed * 0.55,
    life: 1,
    length: Math.random() * 50 + 70,
  };
}

/**
 * Tot fundalul animat al cerului — stele sclipitoare, meteori rari și
 * urma de scântei sub deget — desenate pe UN SINGUR canvas, cu un singur
 * loop de animație. Mai eficient pe telefon decât trei canvas-uri separate
 * (o singură ștergere de ecran pe cadru, în loc de trei).
 */
export function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const reduceMotion = prefersReducedMotion();
    const narrow = isNarrowViewport();

    const stars = createStars();

    const meteors: Meteor[] = [];
    let spawnTimer: ReturnType<typeof setTimeout> | undefined;
    if (!reduceMotion) {
      const maxConcurrent = narrow ? 1 : 2;
      const scheduleSpawn = () => {
        const min = narrow ? 7000 : 4000;
        const max = narrow ? 14000 : 9000;
        const delay = min + Math.random() * (max - min);
        spawnTimer = setTimeout(() => {
          if (meteors.length < maxConcurrent) meteors.push(spawnMeteor(width));
          scheduleSpawn();
        }, delay);
      };
      scheduleSpawn();
    }

    const dust: DustParticle[] = [];
    const maxDust = narrow ? 55 : 110;
    let lastSample = 0;
    const addDust = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSample < SAMPLE_MS) return;
      lastSample = now;
      dust.push({ x, y, life: 1, size: Math.random() * 1.4 + 0.8 });
      if (dust.length > maxDust) dust.splice(0, dust.length - maxDust);
    };
    const onPointerMove = (e: PointerEvent) => addDust(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) addDust(t.clientX, t.clientY);
    };
    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }

    let raf = 0;
    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const alpha = reduceMotion
          ? s.base + s.amp * 0.5
          : Math.max(0, s.base + s.amp * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 239, 225, ${alpha})`;
        ctx.fill();
      }

      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.006;
        if (m.life <= 0 || m.x < -100 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }
        const norm = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / norm) * m.length;
        const tailY = m.y - (m.vy / norm) * m.length;
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(246, 239, 225, ${m.life})`);
        gradient.addColorStop(1, "rgba(246, 239, 225, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      for (let i = dust.length - 1; i >= 0; i -= 1) {
        const p = dust[i];
        p.life -= 0.035;
        if (p.life <= 0) {
          dust.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 200, 132, ${p.life * 0.8})`;
        ctx.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(spawnTimer);
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
