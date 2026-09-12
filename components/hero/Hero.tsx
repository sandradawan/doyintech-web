"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const slides = [
  {
    title: "Web applications",
    sub: "Built for performance.",
    desc: "Production websites and web apps designed for speed, clarity, and growth.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    tone: "black" as const,
  },
  {
    title: "Backend systems",
    sub: "Secure. Scalable.",
    desc: "Laravel, PHP, Node, and MySQL architectures that stay reliable under load.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    tone: "black" as const,
  },
  {
    title: "Mobile apps",
    sub: "iOS and Android.",
    desc: "Flutter products with clean architecture and a polished user experience.",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
    tone: "black" as const,
  },
  {
    title: "AI automation",
    sub: "Work, simplified.",
    desc: "Practical chatbots and workflows that remove repetitive tasks for your team.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    tone: "black" as const,
  },
];

const INTERVAL = 7000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const reduce = useReducedMotion();

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(next, INTERVAL);
    return () => window.clearInterval(id);
  }, [next, reduce]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-black pt-12">
      <div className="relative mx-auto flex min-h-[78vh] max-w-[980px] flex-col items-center px-6 pb-16 pt-16 text-center sm:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-full"
          >
            <p className="text-[19px] font-semibold tracking-tight text-white sm:text-[21px]">
              {slide.title}
            </p>
            <h1 className="apple-headline mt-2 text-white">{slide.sub}</h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[#a1a1a6] sm:text-[19px]">
              {slide.desc}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a href="/services" className="apple-btn apple-btn-primary">
                Learn more
              </a>
              <a href="/contact" className="apple-btn apple-btn-secondary">
                Get started ›
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative mt-12 aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[28px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 980px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === current ? "bg-white" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
