"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const VISIBLE_MS = 10_000;
const HIDDEN_MS = 20 * 60 * 1000;
const STORAGE_KEY = "dt-ng-66-next-show";

/**
 * Full-screen Independence Day splash with founder photo.
 * Locks the site for 10 seconds, then unlocks. Returns after 20 min.
 */
export default function IndependenceDayAvatar() {
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
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-[#0a0e17]"
      role="dialog"
      aria-modal="true"
      aria-label="Nigeria Independence Day welcome"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,135,81,0.25)_0%,_transparent_65%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-2">
        <div className="h-full flex-1 bg-[#008751]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#008751]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2">
        <div className="h-full flex-1 bg-[#008751]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#008751]" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center">
        <div className="mb-5 flex h-16 w-28 overflow-hidden rounded-lg border border-white/20 shadow-lg sm:h-20 sm:w-36">
          <div className="h-full flex-1 bg-[#008751]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#008751]" />
        </div>

        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#008751]">
          Independence Day
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[34px]">
          Nigeria at <span className="text-[#008751]">66</span>
        </h1>
        <p className="mt-2 text-[17px] text-[#c7cdd8]">Happy Independence Day!</p>

        <div className="relative mt-7 h-40 w-40 overflow-hidden rounded-full border-4 border-[#008751] shadow-[0_0_40px_rgba(0,135,81,0.45)] sm:h-48 sm:w-48">
          <Image
            src="/founder.png"
            alt="Silas Doyin Jonathan — Founder, DoyinTech"
            fill
            priority
            className="object-cover object-top"
            sizes="192px"
          />
        </div>

        <p className="mt-4 text-[15px] font-semibold text-white">
          Silas Doyin Jonathan
        </p>
        <p className="text-[13px] text-[#a1a1a6]">Founder & CEO · DoyinTech · Jos</p>

        <p className="mt-6 text-[13px] text-[#86868b]">
          Opening the site in{" "}
          <span className="font-semibold text-[#008751]">{secondsLeft}s</span>
        </p>

        <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#008751] transition-all duration-1000 ease-linear"
            style={{ width: `${((10 - secondsLeft) / 10) * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={skip}
          className="mt-6 rounded-full border border-white/20 px-5 py-2 text-[13px] font-medium text-white/80 transition hover:border-white/40 hover:text-white"
        >
          Enter site now
        </button>
      </div>
    </div>
  );
}
