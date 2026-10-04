"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const VISIBLE_MS = 10_000;
const HIDDEN_MS = 20 * 60 * 1000;
const STORAGE_KEY = "dt-welcome-oct-next-show";

/**
 * Full-screen October welcome banner.
 * Shows for 10 seconds (with skip), then returns after 20 minutes.
 */
export default function WelcomeOctoberBanner() {
  const [show, setShow] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let tick: ReturnType<typeof setInterval> | undefined;

    function lockBody(locked: boolean) {
      try {
        document.body.style.overflow = locked ? "hidden" : "";
      } catch {
        /* ignore */
      }
    }

    function startVisibleCycle() {
      setShow(true);
      setSecondsLeft(10);
      lockBody(true);

      tick = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);

      hideTimer = setTimeout(() => {
        if (tick) clearInterval(tick);
        setShow(false);
        lockBody(false);
        try {
          sessionStorage.setItem(STORAGE_KEY, String(Date.now() + HIDDEN_MS));
        } catch {
          /* ignore */
        }
        showTimer = setTimeout(() => startVisibleCycle(), HIDDEN_MS);
      }, VISIBLE_MS);
    }

    let wait = 0;
    try {
      const next = Number(sessionStorage.getItem(STORAGE_KEY) || "0");
      wait = Math.max(0, next - Date.now());
    } catch {
      /* ignore */
    }

    showTimer = setTimeout(() => startVisibleCycle(), wait === 0 ? 200 : wait);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) clearTimeout(showTimer);
      if (tick) clearInterval(tick);
      lockBody(false);
    };
  }, []);

  function skip() {
    setShow(false);
    try {
      document.body.style.overflow = "";
      sessionStorage.setItem(STORAGE_KEY, String(Date.now() + HIDDEN_MS));
    } catch {
      /* ignore */
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to October — DoyinTech"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,140,20,0.18)_0%,_transparent_60%)]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-4 sm:max-w-xl sm:px-6">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <Image
            src="/welcome-october.jpg"
            alt="DoyinTech — Welcome to October. Clarity of mind. New month, fresh energy."
            width={1080}
            height={1350}
            priority
            className="h-auto w-full object-cover"
            sizes="(max-width: 640px) 100vw, 576px"
          />
        </div>

        <p className="mt-5 text-[13px] text-[#a1a1a6]">
          Opening the site in{" "}
          <span className="font-semibold text-[#ff8c14]">{secondsLeft}s</span>
        </p>

        <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#ff8c14] transition-all duration-1000 ease-linear"
            style={{ width: `${((10 - secondsLeft) / 10) * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={skip}
          className="mt-5 rounded-full border border-white/20 bg-white/[0.04] px-6 py-2.5 text-[13px] font-medium text-white/90 transition hover:border-[#ff8c14]/50 hover:bg-[#ff8c14]/10 hover:text-white"
        >
          Enter site now
        </button>
      </div>
    </div>
  );
}
