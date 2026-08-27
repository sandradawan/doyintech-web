"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

// Set NEXT_PUBLIC_FOUNDER_VIDEO_ID in Vercel to your intro video/short ID
// Example: sx0Yu3ijcTw (from @doyintechfoundation)
const FOUNDER_VIDEO_ID =
  process.env.NEXT_PUBLIC_FOUNDER_VIDEO_ID || "sx0Yu3ijcTw";

export default function Founder() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-32 bg-[#0B0E14] overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.05}>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Meet the Founder
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Silas Doyin Jonathan
              </h2>
              <p className="mt-2 text-primary font-medium text-sm uppercase tracking-wide">
                Founder & Lead Engineer · Jos, Nigeria
              </p>

              <p className="mt-6 text-gray-400 leading-relaxed max-w-xl">
                I started DoyinTech with a simple belief: African businesses
                deserve production-grade software — not fragile prototypes. I
                specialise in backend architecture, scalable APIs, Laravel/PHP
                systems, Flutter apps, and practical AI automation that solves
                real operational problems.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed max-w-xl">
                Every project I take on is treated like it will run in production
                for years. Clean code, strong security, clear documentation, and
                systems that can grow with the business.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    Backend
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Laravel · Node · APIs</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    Mobile
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Flutter Applications</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    AI & Automation
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Workflows that save time</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-primary/10 hover:shadow-primary/25 text-center"
                >
                  Start a Project
                </a>
                <a
                  href="/portfolio"
                  className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-white transition duration-300 text-center"
                >
                  View Work
                </a>
                <a
                  href="https://wa.me/2348085343926?text=Hi%20Silas%2C%20I%27d%20like%20to%20book%20a%20discovery%20call%20with%20DoyinTech."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl border border-[#25D366]/40 text-[#25D366] text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/10 transition duration-300 text-center"
                >
                  Book a Call
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6">
            <ScrollReveal direction="up" delay={0.15}>
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 shrink-0">
                <div className="absolute inset-0 rounded-full animate-pulseGlow blur-[12px] bg-orange-500/35" />
                <div className="absolute inset-[8px] rounded-full animate-pulseGlow blur-[20px] bg-orange-400/25" />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full rounded-full border border-white/15 bg-[#121826] overflow-hidden"
                >
                  <div className="absolute inset-[6px] rounded-full overflow-hidden bg-black/40">
                    <Image
                      src="/founder.png"
                      alt="Silas Doyin Jonathan — Founder of DoyinTech"
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                </motion.div>

                <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                  <span className="rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-200 backdrop-blur-md shadow-lg">
                    Available for new projects
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Founder intro video */}
            <ScrollReveal direction="up" delay={0.25}>
              <div className="w-full max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 text-center lg:text-right">
                  Watch a quick intro
                </p>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-xl shadow-black/40">
                  {playing ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                      title="Silas Doyin Jonathan — Founder intro"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 w-full h-full group"
                      aria-label="Play founder intro video"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${FOUNDER_VIDEO_ID}/hqdefault.jpg`}
                        alt="Founder intro video thumbnail"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/45 transition">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40 group-hover:scale-110 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6 ml-0.5"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${FOUNDER_VIDEO_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-center lg:text-right text-xs text-primary hover:underline"
                >
                  Open on YouTube →
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
