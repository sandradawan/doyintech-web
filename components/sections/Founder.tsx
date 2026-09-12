"use client";

import React, { useState } from "react";
import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";

const FOUNDER_VIDEO_ID =
  process.env.NEXT_PUBLIC_FOUNDER_VIDEO_ID || "sx0Yu3ijcTw";

export default function Founder() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
                Founder
              </p>
              <h2 className="mt-2 text-[36px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[44px]">
                Silas Doyin Jonathan
              </h2>
              <p className="mt-2 text-[15px] text-[#2997ff]">
                Founder & Lead Engineer · Jos, Nigeria
              </p>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#a1a1a6]">
                African businesses deserve production-grade software — not fragile prototypes.
                Backend architecture, scalable APIs, Laravel systems, Flutter apps, and practical
                AI automation.
              </p>
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[#a1a1a6]">
                Every project is built to run in production for years: clean code, strong security,
                and clear documentation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/contact" className="apple-btn apple-btn-primary">
                  Start a project
                </a>
                <a href="/portfolio" className="apple-btn apple-btn-secondary">
                  View work ›
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-6 lg:col-span-5 lg:items-end">
            <ScrollReveal direction="up" delay={0.08}>
              <div className="relative h-56 w-56 overflow-hidden rounded-full border border-white/15 sm:h-64 sm:w-64">
                <Image
                  src="/founder.png"
                  alt="Silas Doyin Jonathan — Founder of DoyinTech"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.12}>
              <div className="w-full max-w-sm">
                <p className="mb-2 text-center text-[12px] text-[#a1a1a6] lg:text-right">
                  Watch a quick intro
                </p>
                <div className="relative aspect-video overflow-hidden rounded-[18px] border border-white/10 bg-black">
                  {playing ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                      title="Founder intro"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0"
                      aria-label="Play founder intro"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${FOUNDER_VIDEO_ID}/hqdefault.jpg`}
                        alt=""
                        fill
                        className="object-cover opacity-85"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff0000] text-white">
                          ▶
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
