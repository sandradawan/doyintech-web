"use client";

import { useEffect, useState } from "react";

/**
 * Nigeria Independence Day — walking human avatar holding the flag.
 * 1960 → 2026 = 66 years. Moves around the viewport; dismissible.
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
    const t = setTimeout(() => setShow(true), 700);
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
      <div className="pointer-events-none fixed inset-0 z-[997] overflow-hidden">
        <div className="ng-float pointer-events-auto absolute">
          <div className="relative flex flex-col items-center">
            {open && (
              <div className="mb-1 max-w-[230px] rounded-2xl border border-white/15 bg-[#0f1419]/95 px-3 py-2.5 shadow-2xl backdrop-blur-md">
                <p className="text-center text-[13px] font-semibold leading-snug text-white">
                  🇳🇬 Nigeria at <span className="text-[#008751]">66</span>
                </p>
                <p className="mt-0.5 text-center text-[12px] leading-snug text-[#c7cdd8]">
                  Happy Independence Day!
                </p>
                <p className="mt-1 text-center text-[10px] text-[#86868b]">
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
              className="relative border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#008751]"
              aria-label="Nigeria Independence Day greeting"
            >
              <svg
                width="88"
                height="120"
                viewBox="0 0 88 120"
                className="ng-bob drop-shadow-lg"
                role="img"
                aria-label="Person holding Nigeria flag"
              >
                <g className="ng-flag-wave">
                  <line
                    x1="62"
                    y1="22"
                    x2="62"
                    y2="58"
                    stroke="#5c4033"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect x="62" y="18" width="8" height="22" fill="#008751" />
                  <rect x="70" y="18" width="8" height="22" fill="#ffffff" />
                  <rect x="78" y="18" width="8" height="22" fill="#008751" />
                  <rect
                    x="62"
                    y="18"
                    width="24"
                    height="22"
                    fill="none"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="0.5"
                  />
                </g>

                <circle cx="36" cy="18" r="11" fill="#c68642" />
                <path
                  d="M25 16c0-8 6-13 11-13s11 5 11 13c-3-2-7-2-11-2s-8 0-11 2z"
                  fill="#1a1a1a"
                />
                <circle cx="32" cy="17" r="1.4" fill="#1a1a1a" />
                <circle cx="40" cy="17" r="1.4" fill="#1a1a1a" />
                <path
                  d="M31 22c1.5 2.5 6.5 2.5 8 0"
                  fill="none"
                  stroke="#5c3317"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                <rect x="33" y="28" width="6" height="5" rx="1" fill="#c68642" />

                <path
                  d="M22 33c0-1 2-3 14-3s14 2 14 3v22c0 2-2 3-4 3H26c-2 0-4-1-4-3V33z"
                  fill="#008751"
                />
                <rect x="34" y="36" width="4" height="18" rx="1" fill="#ffffff" opacity="0.9" />

                <g className="ng-arm-l">
                  <path
                    d="M22 36c-4 4-6 10-5 16"
                    fill="none"
                    stroke="#c68642"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="17" cy="52" r="3.2" fill="#c68642" />
                </g>

                <g>
                  <path
                    d="M50 36c6-2 10-6 12-12"
                    fill="none"
                    stroke="#c68642"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="62" cy="24" r="3.2" fill="#c68642" />
                </g>

                <g className="ng-leg-l">
                  <path
                    d="M30 58c-1 10-2 18-1 28"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <ellipse cx="30" cy="88" rx="6" ry="3" fill="#1a1a1a" />
                </g>
                <g className="ng-leg-r">
                  <path
                    d="M42 58c1 10 2 18 1 28"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <ellipse cx="44" cy="88" rx="6" ry="3" fill="#1a1a1a" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ng-wander {
          0%   { transform: translate(8vw, 68vh); }
          15%  { transform: translate(55vw, 58vh); }
          30%  { transform: translate(72vw, 35vh); }
          45%  { transform: translate(40vw, 16vh); }
          60%  { transform: translate(12vw, 30vh); }
          75%  { transform: translate(48vw, 62vh); }
          90%  { transform: translate(65vw, 72vh); }
          100% { transform: translate(8vw, 68vh); }
        }
        @keyframes ng-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ng-walk-l {
          0%, 100% { transform: rotate(8deg); }
          50% { transform: rotate(-12deg); }
        }
        @keyframes ng-walk-r {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(12deg); }
        }
        @keyframes ng-arm-swing {
          0%, 100% { transform: rotate(6deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes ng-flag {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(3deg); }
        }
        .ng-float {
          animation: ng-wander 32s ease-in-out infinite;
          will-change: transform;
        }
        .ng-bob {
          animation: ng-bob 1.1s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .ng-leg-l {
          transform-origin: 30px 58px;
          animation: ng-walk-l 0.7s ease-in-out infinite;
        }
        .ng-leg-r {
          transform-origin: 42px 58px;
          animation: ng-walk-r 0.7s ease-in-out infinite;
        }
        .ng-arm-l {
          transform-origin: 22px 36px;
          animation: ng-arm-swing 0.7s ease-in-out infinite;
        }
        .ng-flag-wave {
          transform-origin: 62px 24px;
          animation: ng-flag 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ng-float,
          .ng-bob,
          .ng-leg-l,
          .ng-leg-r,
          .ng-arm-l,
          .ng-flag-wave {
            animation: none !important;
          }
          .ng-float {
            transform: translate(12px, calc(100vh - 160px));
          }
        }
      `}</style>
    </>
  );
}
