"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Scene from "../three/Scene";

const slides = [
  {
    title: "Website & Web Applications Development",
    desc: "Production-grade web apps and business websites built for performance, conversion and long-term growth.",
    img: "/services/web.png",
    accent: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.18)",
  },
  {
    title: "High-Performance Backend Engineering",
    desc: "Laravel, PHP, Node.js, MySQL & PostgreSQL systems — secure APIs, microservices and databases that scale.",
    img: "/services/backend.png",
    accent: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.18)",
  },
  {
    title: "Secure API Development & Gateways",
    desc: "Auth, rate limiting, documentation and telemetry so your integrations stay reliable and measurable.",
    img: "/services/api.png",
    accent: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.18)",
  },
  {
    title: "Premium Flutter Mobile Applications",
    desc: "Cross-platform Android and iOS apps with clean architecture and fluid, native-feeling interactions.",
    img: "/services/mobile.png",
    accent: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.18)",
  },
  {
    title: "AI Automation & System Design",
    desc: "Practical AI workflows and scalable infrastructure that remove manual work and support real growth.",
    img: "/services/system.png",
    accent: "text-teal-400",
    glow: "rgba(20, 184, 166, 0.18)",
  },
];

const AUTOPLAY_INTERVAL = 6500;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRaf = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());
  const pausedElapsed = useRef<number>(0);
  const isPaused = useRef<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTime.current = Date.now();
    pausedElapsed.current = 0;
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTime.current = Date.now();
    pausedElapsed.current = 0;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    startTime.current = Date.now();
    setProgress(0);
    isPaused.current = false;

    const tick = () => {
      if (isPaused.current) {
        progressRaf.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTOPLAY_INTERVAL) {
        nextSlide();
      } else {
        progressRaf.current = requestAnimationFrame(tick);
      }
    };

    progressRaf.current = requestAnimationFrame(tick);

    return () => {
      if (progressRaf.current) cancelAnimationFrame(progressRaf.current);
    };
  }, [current, nextSlide, prefersReducedMotion]);

  const handleMouseEnter = () => {
    isPaused.current = true;
    pausedElapsed.current = Date.now() - startTime.current;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
    startTime.current = Date.now() - pausedElapsed.current;
  };

  const slide = slides[current];

  return (
    <section
      className="relative h-[92vh] w-full overflow-hidden bg-[#070A0F]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.38, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        key={`glow-${current}`}
        className="absolute inset-0 z-[1] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${slide.glow}, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0B0E14] z-[1]" />

      <div className="absolute top-1/2 right-[6%] -translate-y-1/2 w-[480px] h-[480px] hidden lg:block z-[2] opacity-70 pointer-events-none">
        <Scene />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 w-full items-center">
          <div className="lg:col-span-8 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: prefersReducedMotion ? 0 : 0.09,
                      delayChildren: prefersReducedMotion ? 0 : 0.12,
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.28 },
                  },
                }}
              >
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-gray-300 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Production-grade engineering for African businesses
                </motion.span>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white"
                >
                  We build{" "}
                  <span
                    className={`${slide.accent} transition-colors duration-500`}
                  >
                    {slide.title.split(" ").slice(0, 1).join(" ")}
                  </span>{" "}
                  {slide.title.split(" ").slice(1).join(" ")}
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="mt-6 text-base sm:text-lg text-gray-300/90 leading-relaxed max-w-2xl"
                >
                  {slide.desc}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="/contact"
                    className="group relative inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] text-center overflow-hidden"
                  >
                    <span className="relative z-10">Start a Project</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </a>

                  <a
                    href="/portfolio"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
                  >
                    View Portfolio
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-3 w-full sm:max-w-lg">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrent(idx);
                  setProgress(0);
                  startTime.current = Date.now();
                  pausedElapsed.current = 0;
                }}
                className="group relative flex-1 py-3 text-left"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden transition-colors group-hover:bg-white/20">
                  {idx === current ? (
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.05 }}
                    />
                  ) : idx < current ? (
                    <div className="h-full w-full bg-white/40 rounded-full" />
                  ) : null}
                </div>
                <span className="mt-2 block text-[10px] font-medium text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider hidden md:block">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-gray-300 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-gray-300 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
              aria-label="Next slide"
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
