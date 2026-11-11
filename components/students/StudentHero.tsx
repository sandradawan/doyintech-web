"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { StudentSpotlight } from "@/lib/students/spotlights";

const INTERVAL_MS = 10_000;

/** Slides through the thank-you banners, one every 10 seconds. Pauses while hovered or focused. */
export default function StudentHero({ slides }: { slides: StudentSpotlight[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count, current]);

  if (!count) return null;
  const go = (step: number) => setCurrent((c) => (c + step + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Students we have worked with"
      className="theme-dark relative mt-5 overflow-hidden rounded-[24px] bg-[#0a3d1f] shadow-[0_24px_60px_-28px_rgba(11,42,28,0.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] w-full">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== current}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.banner}
              alt={s.bannerAlt}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="(max-width: 1020px) 100vw, 980px"
              className="object-cover"
            />
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
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1 sm:bottom-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Show student ${i + 1}`}
                aria-current={i === current}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span className={`block h-1.5 rounded-full transition-all ${i === current ? "w-7 bg-[#ff8c14]" : "w-1.5 bg-white/55"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
