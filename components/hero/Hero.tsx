"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Scene from "../three/Scene";

const slides = [
  {
    title: "Website & Web Applications Development",
    desc: "Building large-scale and small-scale business web applications for digital visibility and edge cutting technology.",
    img: "/services/web.png",
    accent: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    title: "High-Performance Backend Engineering",
    desc: "Scalable APIs, microservices, secure caching, message queues, and professional database query tuning.",
    img: "/services/backend.png",
    accent: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.15)",
  },
  {
    title: "Secure API Development & Gateways",
    desc: "Auth validation, rate limiting, comprehensive swagger docs, usage telemetry, and API analytics integrations.",
    img: "/services/api.png",
    accent: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.15)",
  },
  {
    title: "Premium Flutter Mobile Applications",
    desc: "Cross-platform Android and iOS solutions designed with clean architecture and fluid micro-interactions.",
    img: "/services/mobile.png",
    accent: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.15)",
  },
  {
    title: "Scalable Systems & Infrastructure Design",
    desc: "Architecting fail-safe systems, load balanced workflows, and cloud-native databases designed for real growth.",
    img: "/services/system.png",
    accent: "text-teal-400",
    glow: "rgba(20, 184, 166, 0.15)",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());
  const pausedTime = useRef<number>(0);
  const isPaused = useRef<boolean>(false);

  // Memoize transition handlers to avoid re-renders
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTime.current = Date.now();
    pausedTime.current = 0;
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTime.current = Date.now();
    pausedTime.current = 0;
  }, []);

  // Effect for autoplay timer and progress bar syncing
  useEffect(() => {
    startTime.current = Date.now();
    setProgress(0);
    isPaused.current = false;

    const tick = () => {
      if (isPaused.current) return;
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTOPLAY_INTERVAL) {
        nextSlide();
      } else {
        progressTimer.current = setTimeout(tick, 30);
      }
    };

    progressTimer.current = setTimeout(tick, 30);

    return () => {
      if (progressTimer.current) clearTimeout(progressTimer.current);
    };
  }, [current, nextSlide]);

  const handleMouseEnter = () => {
    isPaused.current = true;
    pausedTime.current = Date.now() - startTime.current;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
    startTime.current = Date.now() - pausedTime.current;
  };

  return (
    <section 
      className="relative h-[92vh] w-full overflow-hidden bg-[#070A0F]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.35, scale: 1.01 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].img}
              alt={slides[current].title}
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modern High-End Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0B0E14] z-1" />

      {/* Floating 3D Ambient Mesh Layer (R3F Canvas) */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[450px] h-[450px] hidden lg:block z-2 opacity-65 pointer-events-none">
        <Scene />
      </div>

      {/* Core Slideshow Content */}
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
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                  },
                  exit: { opacity: 0, y: -8, transition: { duration: 0.3 } },
                }}
              >
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wide text-gray-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Premium Digital Engineering
                </motion.span>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
                  }}
                  className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white"
                >
                  We build <span className={slides[current].accent + " transition-colors duration-500"}>{slides[current].title.split(" ").slice(0, 1).join(" ")}</span>{" "}
                  {slides[current].title.split(" ").slice(1).join(" ")}
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  }}
                  className="mt-6 text-base sm:text-lg text-gray-300/85 leading-relaxed max-w-2xl"
                >
                  {slides[current].desc}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
                  }}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="/contact"
                    className="relative inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-primary text-white font-medium shadow-lg hover:shadow-primary/25 transition duration-300 hover:scale-[1.02] text-center"
                  >
                    Start a Project
                  </a>

                  <a
                    href="/services"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 hover:border-white/30 transition duration-300 text-center"
                  >
                    View Services
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slideshow Progress Bar & Controls (Bottom Right/Center) */}
      <div className="absolute bottom-10 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Progress Indicators */}
          <div className="flex items-center gap-3 w-full sm:max-w-lg">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrent(idx);
                  setProgress(0);
                }}
                className="group relative flex-1 py-3 text-left"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {/* Horizontal Progress Track */}
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden transition-colors group-hover:bg-white/20">
                  {idx === current ? (
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                    />
                  ) : idx < current ? (
                    <div className="h-full w-full bg-white/40" />
                  ) : null}
                </div>
                <span className="mt-2 block text-[10px] font-medium text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider hidden md:block">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Next/Prev Navigation Buttons */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-gray-300 hover:border-white/25 hover:text-white transition duration-200"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-gray-300 hover:border-white/25 hover:text-white transition duration-200"
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
