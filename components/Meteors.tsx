"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isNarrowViewport } from "@/lib/motionPrefs";

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  length: number;
};

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
 * Ploaie discretă de stele căzătoare pe fundal — din când în când, o dungă
 * aurie traversează cerul. Frecvență redusă pe telefon, oprită complet
 * dacă utilizatorul preferă mișcare redusă.
 */
export function Meteors() {
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

    const narrow = isNarrowViewport();
    const maxConcurrent = narrow ? 1 : 2;
    const meteors: Meteor[] = [];

    let spawnTimer: ReturnType<typeof setTimeout>;
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

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
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
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(spawnTimer);
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
