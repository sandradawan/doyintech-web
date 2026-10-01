"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const HIDDEN_MS = 20 * 60 * 1000;
const STORAGE_KEY = "dt-ng-66-next-show";
const ANTHEM_SRC = "/audio/nigeria-anthem.mp3";
/** Safety: if audio never loads/ends, unlock after this */
const MAX_WAIT_MS = 5 * 60 * 1000;

/**
 * Full-screen Independence splash: founder photo + national anthem.
 * Auto-plays anthem; stays until the track finishes (or Skip).
 * Returns again after 20 minutes.
 */
export default function IndependenceDayAvatar() {
  const [show, setShow] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading anthem…");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const closedRef = useRef(false);
  const timersRef = useRef<{
    show?: ReturnType<typeof setTimeout>;
    safety?: ReturnType<typeof setTimeout>;
    raf?: number;
  }>({});

  function lockBody(locked: boolean) {
    try {
      document.body.style.overflow = locked ? "hidden" : "";
    } catch {
      /* ignore */
    }
  }

  function stopAudio() {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
    } catch {
      /* ignore */
    }
    setPlaying(false);
  }

  function finishAndHide() {
    if (closedRef.current) return;
    closedRef.current = true;
    if (timersRef.current.safety) clearTimeout(timersRef.current.safety);
    if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
    stopAudio();
    setShow(false);
    lockBody(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, String(Date.now() + HIDDEN_MS));
    } catch {
      /* ignore */
    }
    // Schedule next appearance
    timersRef.current.show = setTimeout(() => {
      closedRef.current = false;
      startVisibleCycle();
    }, HIDDEN_MS);
  }

  function trackProgress() {
    const a = audioRef.current;
    if (!a || !a.duration || !isFinite(a.duration)) {
      timersRef.current.raf = requestAnimationFrame(trackProgress);
      return;
    }
    const p = Math.min(100, (a.currentTime / a.duration) * 100);
    setProgress(p);
    if (!a.paused && !a.ended) {
      timersRef.current.raf = requestAnimationFrame(trackProgress);
    }
  }

  async function tryPlayAudio() {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0.5;
      if (a.readyState < 2) {
        a.load();
      }
      a.currentTime = 0;
      await a.play();
      setPlaying(true);
      setAudioBlocked(false);
      setStatus("National anthem playing — will open when finished");
      if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
      timersRef.current.raf = requestAnimationFrame(trackProgress);
    } catch {
      setAudioBlocked(true);
      setPlaying(false);
      setStatus("Tap below to play the national anthem");
    }
  }

  function startVisibleCycle() {
    closedRef.current = false;
    setShow(true);
    setProgress(0);
    setAudioBlocked(false);
    setStatus("Starting national anthem…");
    lockBody(true);

    if (timersRef.current.safety) clearTimeout(timersRef.current.safety);
    timersRef.current.safety = setTimeout(() => finishAndHide(), MAX_WAIT_MS);

    void tryPlayAudio();
  }

  useEffect(() => {
    const audio = new Audio(ANTHEM_SRC);
    audio.preload = "auto";
    audio.loop = false;
    audioRef.current = audio;

    const onEnded = () => {
      setProgress(100);
      setStatus("Anthem complete");
      finishAndHide();
    };
    const onError = () => {
      setStatus("Could not load audio — use Skip to enter");
      setAudioBlocked(true);
    };
    const onLoaded = () => {
      // duration known
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("loadedmetadata", onLoaded);

    let wait = 0;
    try {
      const next = Number(sessionStorage.getItem(STORAGE_KEY) || "0");
      wait = Math.max(0, next - Date.now());
    } catch {
      /* ignore */
    }

    timersRef.current.show = setTimeout(
      () => startVisibleCycle(),
      wait === 0 ? 150 : wait
    );

    return () => {
      if (timersRef.current.show) clearTimeout(timersRef.current.show);
      if (timersRef.current.safety) clearTimeout(timersRef.current.safety);
      if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadedmetadata", onLoaded);
      stopAudio();
      lockBody(false);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function skip() {
    finishAndHide();
  }

  async function enableSound() {
    await tryPlayAudio();
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

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {audioBlocked && (
            <button
              type="button"
              onClick={enableSound}
              className="rounded-full bg-[#008751] px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg hover:brightness-110"
            >
              🔊 Tap to play national anthem
            </button>
          )}
          {playing && (
            <span className="rounded-full border border-[#008751]/40 bg-[#008751]/15 px-3 py-1.5 text-[12px] text-[#008751]">
              ♪ Playing full anthem
            </span>
          )}
        </div>

        <p className="mt-5 max-w-xs text-[13px] text-[#86868b]">{status}</p>

        <div className="mt-3 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#008751] transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={skip}
          className="mt-8 rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-[14px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
        >
          Skip — enter site
        </button>
      </div>
    </div>
  );
}
