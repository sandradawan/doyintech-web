"use client";

import { useEffect, useState } from "react";

/**
 * Nigeria Independence Day floating avatar (Oct 1).
 * 1960 → 2026 = 66 years.
 * Moves around the viewport; dismissible (sessionStorage).
 */
export default function IndependenceDayAvatar() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("dt-ng-66-dismissed") === "1") return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      sessionStorage.setItem("dt-ng-66-dismissed", "1");
    } catch {
      /* ignore */
    }
  }

  if (!show) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[997] overflow-hidden"
        aria-hidden={!open}
      >
        <div className="ng-float pointer-events-auto absolute">
          <div className="relative flex flex-col items-center">
            {open && (
              <div className="mb-2 max-w-[220px] rounded-2xl border border-white/15 bg-[#0f1419]/95 px-3 py-2.5 shadow-2xl backdrop-blur-md">
                <p className="text-center text-[13px] font-semibold leading-snug text-white">
                  🇳🇬 Nigeria at <span className="text-[#008751]">66</span>
                </p>
                <p className="mt-0.5 text-center text-[12px] leading-snug text-[#c7cdd8]">
                  Happy Independence Day!
                </p>
                <p className="mt-1.5 text-center text-[10px] text-[#86868b]">
                  From DoyinTech · Jos
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-2 w-full rounded-full bg-[#008751] py-1.5 text-[11px] font-semibold text-white hover:brightness-110"
                >
                  Celebrate · close
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ng-bob relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 shadow-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#008751]"
              aria-label="Nigeria Independence Day greeting"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-[#008751]" />
                <span className="absolute inset-y-0 left-1/3 w-1/3 bg-white" />
                <span className="absolute inset-y-0 right-0 w-1/3 bg-[#008751]" />
              </span>
              <span className="relative text-xl drop-shadow" aria-hidden>
                😊
              </span>
              <span className="ng-pulse absolute inset-0 rounded-full border-2 border-[#008751]/50" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ng-wander {
          0% { transform: translate(12vw, 70vh); }
          20% { transform: translate(70vw, 55vh); }
          40% { transform: translate(55vw, 18vh); }
          60% { transform: translate(18vw, 28vh); }
          80% { transform: translate(62vw, 72vh); }
          100% { transform: translate(12vw, 70vh); }
        }
        @keyframes ng-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ng-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .ng-float {
          animation: ng-wander 28s ease-in-out infinite;
          will-change: transform;
        }
        .ng-bob {
          animation: ng-bob 2.2s ease-in-out infinite;
        }
        .ng-pulse {
          animation: ng-pulse 2s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ng-float,
          .ng-bob,
          .ng-pulse {
            animation: none !important;
          }
          .ng-float {
            transform: translate(16px, calc(100vh - 140px));
          }
        }
      `}</style>
    </>
  );
}
