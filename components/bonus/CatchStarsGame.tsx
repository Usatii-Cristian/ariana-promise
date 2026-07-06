"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/lib/content";
import { isNarrowViewport, prefersReducedMotion } from "@/lib/motionPrefs";

type FallingStar = { x: number; y: number; vx: number; vy: number; r: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

function spawnStar(width: number): FallingStar {
  return {
    x: Math.random() * width,
    y: -20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: Math.random() * 0.9 + 1.1,
    r: Math.random() * 4 + 10,
  };
}

type CatchStarsGameProps = {
  onClose: () => void;
};

/**
 * Joc bonus: prinde stelele căzătoare atingându-le înainte să treacă de
 * ecran. Accesibil dintr-un buton de pe scrisoarea finală, independent
 * de fluxul narativ principal.
 */
export function CatchStarsGame({ onClose }: CatchStarsGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<FallingStar[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const target = content.bonusGame.target;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      sizeRef.current = { width: w, height: h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const speedScale = prefersReducedMotion() ? 0.5 : 1;
    const maxConcurrent = isNarrowViewport() ? 3 : 5;

    let spawnTimer: ReturnType<typeof setTimeout>;
    const scheduleSpawn = () => {
      const delay = 550 + Math.random() * 550;
      spawnTimer = setTimeout(() => {
        if (starsRef.current.length < maxConcurrent && scoreRef.current < target) {
          starsRef.current.push(spawnStar(sizeRef.current.width));
        }
        scheduleSpawn();
      }, delay);
    };
    scheduleSpawn();

    const handlePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const stars = starsRef.current;
      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const s = stars[i];
        const dist = Math.hypot(s.x - x, s.y - y);
        if (dist <= s.r + 22) {
          stars.splice(i, 1);
          for (let k = 0; k < 10; k += 1) {
            const angle = (k / 10) * Math.PI * 2;
            sparksRef.current.push({
              x: s.x,
              y: s.y,
              vx: Math.cos(angle) * (Math.random() * 2 + 1),
              vy: Math.sin(angle) * (Math.random() * 2 + 1),
              life: 1,
            });
          }
          scoreRef.current += 1;
          setScore(scoreRef.current);
          if (scoreRef.current >= target) {
            setWon(true);
            starsRef.current = [];
          }
          break;
        }
      }
    };
    canvas.addEventListener("pointerdown", handlePointer);

    let raf = 0;
    const render = () => {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const s = stars[i];
        s.x += s.vx * speedScale;
        s.y += s.vy * speedScale;
        if (s.y - s.r > height) {
          stars.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(246, 239, 225, 0.95)";
        ctx.shadowColor = "rgba(230, 200, 132, 0.9)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 200, 132, ${p.life})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(spawnTimer);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", handlePointer);
    };
  }, [target]);

  const replay = () => {
    starsRef.current = [];
    sparksRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setWon(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50"
      style={{
        background:
          "radial-gradient(120% 100% at 50% -10%, #121a44 0%, #070b1c 45%, #04060f 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label={content.bonusGame.instructions}
        role="img"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold-500/80">
            {content.bonusGame.instructions}
          </p>
          <p className="mt-1 font-serif text-2xl tabular-nums text-cream">
            {score}/{target}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={content.bonusGame.close}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-black/20 text-cream/70 backdrop-blur-sm transition-colors hover:text-cream"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 5l14 14M19 5L5 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-night-900/70 px-6 text-center backdrop-blur-sm"
          >
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-sm font-serif text-2xl italic leading-relaxed text-cream sm:text-3xl"
            >
              {content.bonusGame.successMessage}
            </motion.p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={replay}
                className="rounded-full bg-gold-500/90 px-6 py-2.5 font-sans text-sm font-medium tracking-wide text-night-900 transition-colors hover:bg-gold-400"
              >
                {content.bonusGame.playAgain}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gold-500/40 px-6 py-2.5 font-sans text-sm tracking-wide text-gold-400 transition-colors hover:bg-gold-500/10"
              >
                {content.bonusGame.close}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
