"use client";

import { useEffect, useState } from "react";

const VISIBLE_MS = 10_000;
const HIDDEN_MS = 20 * 60 * 1000;
const STORAGE_KEY = "dt-ng-66-next-show";

/** Large static avatar top-left: 10s visible, 20 min hidden, then back. */
export default function IndependenceDayAvatar() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let showTimer: ReturnType<typeof setTimeout> | undefined;

    function startVisibleCycle() {
      setShow(true);
      setOpen(true);
      hideTimer = setTimeout(() => {
        setShow(false);
        const again = Date.now() + HIDDEN_MS;
        try {
          sessionStorage.setItem(STORAGE_KEY, String(again));
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

    showTimer = setTimeout(() => startVisibleCycle(), wait === 0 ? 500 : wait);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  function dismiss() {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, String(Date.now() + HIDDEN_MS));
    } catch {
      /* ignore */
    }
  }

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[997] overflow-hidden">
      <div className="pointer-events-auto absolute left-3 top-16 sm:left-5 sm:top-20">
        <div className="relative flex flex-col items-start">
          {open && (
            <div className="mb-2 max-w-[260px] rounded-2xl border border-white/15 bg-[#0f1419]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
              <p className="text-[15px] font-semibold leading-snug text-white">
                🇳🇬 Nigeria at <span className="text-[#008751]">66</span>
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[#c7cdd8]">
                Happy Independence Day!
              </p>
              <p className="mt-1.5 text-[11px] text-[#86868b]">From DoyinTech · Jos</p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-2.5 w-full rounded-full bg-[#008751] py-2 text-[12px] font-semibold text-white hover:brightness-110"
              >
                Celebrate · close
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#008751]"
            aria-label="Nigeria Independence Day greeting"
          >
            <svg
              width="160"
              height="220"
              viewBox="0 0 120 160"
              className="drop-shadow-xl"
              role="img"
              aria-label="Person holding Nigeria flag"
            >
              <g>
                <line
                  x1="78"
                  y1="8"
                  x2="78"
                  y2="72"
                  stroke="#5c4033"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <rect x="78" y="6" width="14" height="42" fill="#008751" />
                <rect x="92" y="6" width="14" height="42" fill="#ffffff" />
                <rect x="106" y="6" width="14" height="42" fill="#008751" />
                <rect
                  x="78"
                  y="6"
                  width="42"
                  height="42"
                  fill="none"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="0.8"
                />
              </g>
              <circle cx="48" cy="28" r="16" fill="#c68642" />
              <path
                d="M32 26c0-12 9-19 16-19s16 7 16 19c-4-3-10-3-16-3s-12 0-16 3z"
                fill="#1a1a1a"
              />
              <circle cx="42" cy="27" r="2" fill="#1a1a1a" />
              <circle cx="54" cy="27" r="2" fill="#1a1a1a" />
              <path
                d="M40 34c2.5 3.5 11 3.5 13.5 0"
                fill="none"
                stroke="#5c3317"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <rect x="44" y="42" width="8" height="8" rx="1.5" fill="#c68642" />
              <path
                d="M28 50c0-2 3-5 20-5s20 3 20 5v32c0 3-3 5-6 5H34c-3 0-6-2-6-5V50z"
                fill="#008751"
              />
              <rect x="45" y="54" width="6" height="26" rx="1.5" fill="#ffffff" opacity="0.95" />
              <path
                d="M28 54c-6 6-9 14-7 22"
                fill="none"
                stroke="#c68642"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="21" cy="77" r="4.5" fill="#c68642" />
              <path
                d="M68 54c8-4 12-10 14-18"
                fill="none"
                stroke="#c68642"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="78" cy="36" r="4.5" fill="#c68642" />
              <path
                d="M40 87c-1 14-2 26-1 40"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <ellipse cx="40" cy="130" rx="9" ry="4.5" fill="#1a1a1a" />
              <path
                d="M56 87c1 14 2 26 1 40"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <ellipse cx="58" cy="130" rx="9" ry="4.5" fill="#1a1a1a" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
