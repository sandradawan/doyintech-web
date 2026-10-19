"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Particle = { x: number; y: number; vx: number; vy: number; life: number };
type Obstacle = { x: number; y: number; w: number; h: number; type: "glitch" | "lag" };
type Coin = { x: number; y: number; r: number; taken: boolean };

/** Fully client-side endless runner. Works offline after load. Optional /audio/game-bg.mp3 */
export default function SignalRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const musicNodesRef = useRef<{ stop: () => void } | null>(null);
  const mp3Ref = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [musicOn, setMusicOn] = useState(true);
  const [offline, setOffline] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    try {
      const b = localStorage.getItem("dt_signal_best");
      if (b) setBest(Number(b) || 0);
    } catch {
      /* ignore */
    }
    const up = () => setOffline(!navigator.onLine);
    up();
    window.addEventListener("online", up);
    window.addEventListener("offline", up);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", up);
    };
  }, []);

  const stopMusic = useCallback(() => {
    musicNodesRef.current?.stop();
    musicNodesRef.current = null;
    if (mp3Ref.current) {
      mp3Ref.current.pause();
      mp3Ref.current.currentTime = 0;
    }
  }, []);

  const startMusic = useCallback(async () => {
    stopMusic();
    if (!musicOn) return;

    try {
      const audio = new Audio("/audio/game-bg.mp3");
      audio.loop = true;
      audio.volume = 0.35;
      await audio.play();
      mp3Ref.current = audio;
      return;
    } catch {
      /* fall through to synth */
    }

    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      if (ctx.state === "suspended") await ctx.resume();

      const master = ctx.createGain();
      master.gain.value = 0.08;
      master.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.value = 110;
      osc2.frequency.value = 164.81;
      lfo.frequency.value = 0.15;
      lfoGain.gain.value = 8;
      g1.gain.value = 0.5;
      g2.gain.value = 0.25;

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      osc1.connect(g1);
      osc2.connect(g2);
      g1.connect(master);
      g2.connect(master);

      osc1.start();
      osc2.start();
      lfo.start();

      const pulse = ctx.createOscillator();
      const pulseGain = ctx.createGain();
      pulse.type = "sine";
      pulse.frequency.value = 55;
      pulseGain.gain.value = 0;
      pulse.connect(pulseGain);
      pulseGain.connect(master);
      pulse.start();

      let t = ctx.currentTime;
      const schedule = () => {
        if (!musicNodesRef.current) return;
        const now = ctx.currentTime;
        while (t < now + 2) {
          pulseGain.gain.cancelScheduledValues(t);
          pulseGain.gain.setValueAtTime(0, t);
          pulseGain.gain.linearRampToValueAtTime(0.2, t + 0.05);
          pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          t += 2;
        }
        window.setTimeout(schedule, 1500);
      };
      schedule();

      musicNodesRef.current = {
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
            lfo.stop();
            pulse.stop();
            void ctx.close();
          } catch {
            /* ignore */
          }
        },
      };
    } catch {
      /* no audio */
    }
  }, [musicOn, stopMusic]);

  useEffect(() => {
    return () => {
      stopMusic();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stopMusic]);

  const startGame = useCallback(async () => {
    setStarted(true);
    setPlaying(true);
    setGameOver(false);
    setScore(0);
    await startMusic();

    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxRaw = canvasEl.getContext("2d");
    if (!ctxRaw) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const W = canvas.width;
    const H = canvas.height;
    const ground = H - 48;

    let playerY = ground - 36;
    let playerVy = 0;
    let jumping = false;
    let speed = 4;
    let distance = 0;
    let frame = 0;
    let alive = true;
    const obstacles: Obstacle[] = [];
    const coins: Coin[] = [];
    const particles: Particle[] = [];
    let localScore = 0;

    function spawn() {
      const gap = 180 + Math.random() * 120;
      const lastX = obstacles.length ? obstacles[obstacles.length - 1].x : W;
      const x = Math.max(W + 40, lastX + gap);
      const h = 28 + Math.random() * 40;
      obstacles.push({
        x,
        y: ground - h,
        w: 22 + Math.random() * 18,
        h,
        type: Math.random() > 0.5 ? "glitch" : "lag",
      });
      if (Math.random() > 0.4) {
        coins.push({
          x: x + 40 + Math.random() * 60,
          y: ground - 70 - Math.random() * 50,
          r: 8,
          taken: false,
        });
      }
    }

    function jump() {
      if (!jumping && alive) {
        playerVy = -11.5;
        jumping = true;
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onPointer = () => jump();
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointer);

    function drawBg() {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0a0f1a");
      g.addColorStop(0.5, "#0f172a");
      g.addColorStop(1, "#020617");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97 + frame * 0.2) % W;
        const sy = (i * 53) % (H * 0.55);
        ctx.fillRect(sx, sy, 2, 2);
      }

      ctx.strokeStyle = "rgba(56,189,248,0.15)";
      ctx.lineWidth = 1;
      const scroll = (frame * speed * 0.5) % 40;
      for (let x = -40; x < W + 40; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x - scroll, ground);
        ctx.lineTo(x - scroll + 20, H);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.fillRect(0, ground, W, H - ground);
      ctx.strokeStyle = "rgba(34,211,238,0.4)";
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(W, ground);
      ctx.stroke();
    }

    function loop() {
      if (!alive) return;
      frame++;
      distance += speed;
      speed = 4 + Math.min(6, distance / 2000);

      playerVy += 0.55;
      playerY += playerVy;
      if (playerY >= ground - 36) {
        playerY = ground - 36;
        playerVy = 0;
        jumping = false;
      }

      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < W - 160) {
        spawn();
      }

      for (const o of obstacles) o.x -= speed;
      for (const c of coins) c.x -= speed;

      while (obstacles.length && obstacles[0].x + obstacles[0].w < 0) obstacles.shift();
      while (coins.length && coins[0].x < -20) coins.shift();

      const px = 64;
      const pw = 28;
      const ph = 36;

      for (const o of obstacles) {
        if (px < o.x + o.w && px + pw > o.x && playerY < o.y + o.h && playerY + ph > o.y) {
          alive = false;
          setPlaying(false);
          setGameOver(true);
          setScore(localScore);
          setBest((b) => {
            const n = Math.max(b, localScore);
            try {
              localStorage.setItem("dt_signal_best", String(n));
            } catch {
              /* ignore */
            }
            return n;
          });
          stopMusic();
          break;
        }
      }

      for (const c of coins) {
        if (c.taken) continue;
        if (
          px < c.x + c.r &&
          px + pw > c.x - c.r &&
          playerY < c.y + c.r &&
          playerY + ph > c.y - c.r
        ) {
          c.taken = true;
          localScore += 25;
          setScore(localScore);
          for (let i = 0; i < 8; i++) {
            particles.push({
              x: c.x,
              y: c.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 20,
            });
          }
        }
      }

      if (frame % 15 === 0) {
        localScore += 1;
        setScore(localScore);
      }

      drawBg();

      for (const o of obstacles) {
        ctx.fillStyle = o.type === "glitch" ? "#f43f5e" : "#a855f7";
        ctx.shadowColor = o.type === "glitch" ? "#f43f5e" : "#a855f7";
        ctx.shadowBlur = 12;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.shadowBlur = 0;
      }

      for (const c of coins) {
        if (c.taken) continue;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = "rgba(34,211,238," + p.life / 20 + ")";
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(i, 1);
      }

      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(px, playerY, pw, ph);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(px + 8, playerY + 10, 6, 6);
      ctx.fillRect(px + 18, playerY + 10, 6, 6);

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 14px system-ui,sans-serif";
      ctx.fillText("Packets " + localScore, 16, 28);
      ctx.fillText("Best " + Math.max(best, localScore), 16, 48);

      if (alive) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        window.removeEventListener("keydown", onKey);
        canvas.removeEventListener("pointerdown", onPointer);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [best, startMusic, stopMusic]);

  return (
    <div className="space-y-4">
      {offline ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          You appear offline — this game still runs in your browser. Keep playing until the network returns.
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          When the network is slow or drops, stay here and play. Fully local — no server needed after load.
        </p>
      )}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-cyan-500/10">
        <canvas
          ref={canvasRef}
          width={720}
          height={360}
          className="block h-auto w-full touch-none"
          aria-label="Signal Runner game canvas"
        />
        {!started || gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 px-6 text-center backdrop-blur-sm">
            <p className="font-display text-2xl font-bold text-white md:text-3xl">
              {gameOver ? "Signal lost" : "Signal Runner"}
            </p>
            <p className="mt-2 max-w-md text-sm text-gray-300">
              {gameOver
                ? "You collected " + score + " packets. Tap to reconnect and try again."
                : "Tap or press Space to jump. Dodge lag spikes and glitches. Collect cyan packets."}
            </p>
            {gameOver ? <p className="mt-1 text-xs text-gray-400">Best: {best}</p> : null}
            <button
              type="button"
              onClick={() => void startGame()}
              className="mt-5 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400"
            >
              {gameOver ? "Play again" : "Start game"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
          onClick={() => {
            setMusicOn((m) => {
              const next = !m;
              if (!next) stopMusic();
              else if (playing) void startMusic();
              return next;
            });
          }}
        >
          Music: {musicOn ? "On" : "Off"}
        </button>
        <span className="text-xs text-gray-500">Optional custom track: public/audio/game-bg.mp3</span>
        <Link href="/tools" className="text-xs text-primary hover:underline">
          Back to tools
        </Link>
      </div>
    </div>
  );
}
