"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StudentSpotlight } from "@/lib/students/spotlights";

const INTERVAL_MS = 10_000;
const GREEN = "#093b1d";
const ORANGE = "#ff8c14";

/** A thank-you slide drawn from the student's photo, name and school, for students without a ready-made banner. */
function DrawnSlide({ s }: { s: StudentSpotlight }) {
  const work = s.work || "their project";
  return (
    <div className="absolute inset-0 grid grid-cols-[44%_1fr] items-center [container-type:inline-size]" style={{ background: GREEN }}>
      <div className="absolute left-[4%] top-[6%] flex items-center gap-[1cqw]">
        <Image src="/logo.png" alt="" width={64} height={64} className="h-[5.5cqw] w-[5.5cqw] object-contain" />
        <span className="font-semibold" style={{ color: ORANGE, fontSize: "2.4cqw" }}>DoyinTech</span>
      </div>
      <div className="flex items-end justify-center pt-[8%]">
        <div className="relative aspect-square w-[78%] overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 0.35cqw ${GREEN}, 0 0 0 0.6cqw ${ORANGE}` }}>
          <Image src={s.photo} alt={s.name || "Student"} fill sizes="(max-width: 1020px) 40vw, 340px" className="object-cover object-top" />
        </div>
      </div>
      <div className="pr-[6%]">
        <p className="flex items-center gap-[1cqw] font-semibold uppercase" style={{ color: ORANGE, fontSize: "1.25cqw", letterSpacing: "0.3em" }}>
          <span className="inline-block h-[0.2cqw] w-[2.6cqw]" style={{ background: ORANGE }} />
          Thank you
        </p>
        <p className="mt-[1.6cqw] font-bold leading-[1.18] text-white" style={{ fontSize: "3.5cqw" }}>
          Thank you for trusting and recommending <span style={{ color: ORANGE }}>DoyinTech</span> for {work}
          {s.school && (
            <>
              {" "}at <span style={{ color: ORANGE }}>{s.school}.</span>
            </>
          )}
          {!s.school && "."}
        </p>
        {s.name && (
          <p className="mt-[1.8cqw] italic text-white/85" style={{ fontSize: "1.9cqw" }}>
            {s.name}
          </p>
        )}
        <p className="mt-[3cqw] border-t border-white/20 pt-[2cqw] font-semibold text-white" style={{ fontSize: "1.6cqw" }}>
          www.doyintech.com <span className="mx-[1.2cqw] text-white/40">·</span> 0808 534 3926
        </p>
      </div>
    </div>
  );
}

/** Slides through the students, one every 10 seconds. Swipe, use the arrows, or tap a dot to move. */
export default function StudentHero({ slides }: { slides: StudentSpotlight[] }) {
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  // Restarts whenever the slide changes, so a manual move also gets a full 10 seconds.
  useEffect(() => {
    if (count < 2) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) setCurrent((c) => (c + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [count, current]);

  if (!count) return null;
  const go = (step: number) => setCurrent((c) => (c + step + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Students we have worked with"
      className="theme-dark relative mt-5 overflow-hidden rounded-[24px] shadow-[0_24px_60px_-28px_rgba(11,42,28,0.55)]"
      style={{ background: GREEN }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== current}
            className="relative aspect-[16/9] w-full shrink-0"
          >
            {s.banner ? (
              <Image
                src={s.banner}
                alt={s.bannerAlt || `Thank you from DoyinTech${s.school ? `, ${s.school}` : ""}`}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="(max-width: 1020px) 100vw, 980px"
                className="object-cover"
              />
            ) : (
              <DrawnSlide s={s} />
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous student"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:left-3 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next student"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:right-3 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 5 7 7-7 7" /></svg>
          </button>
          {count <= 12 && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-0.5 sm:bottom-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Show student ${i + 1}`}
                  aria-current={i === current}
                  className="flex h-8 w-7 items-center justify-center"
                >
                  <span className={`block h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-[#ff8c14]" : "w-1.5 bg-white/55"}`} />
                </button>
              ))}
            </div>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {current + 1} / {count}
          </span>
          {/* Fills over the 10 seconds, so it is clear the next student is coming. */}
          <span key={current} className="student-hero-progress absolute bottom-0 left-0 h-[3px] bg-[#ff8c14]" />
        </>
      )}
    </section>
  );
}
