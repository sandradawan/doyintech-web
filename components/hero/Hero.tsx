"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { discoveryCallLink } from "@/lib/packages";

const slides = [
  {
    title: "Websites that get clients",
    sub: "Pay for results.",
    desc: "Fixed-price sites with WhatsApp booking — Landing ₦100k · Local business ₦250k. Deposit online today.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Free website audit",
    sub: "Fill your pipeline.",
    desc: "3-minute audit: send your URL, get 2–3 fixes, and a clear next step — DIY or hire us.",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "WhatsApp scripts",
    sub: "Reply like a pro.",
    desc: "Free generator: 5 copy-paste replies for price questions, after-hours, booking, and reviews.",
    img: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Digital products",
    sub: "Sell while you sleep.",
    desc: "Prompt packs, WhatsApp systems, ebooks, and Next.js templates — checkout with Paystack.",
    img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1600&q=80",
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="/hire" className="apple-btn apple-btn-primary">
                Hire — pay deposit
              </a>
              <a href="/free-audit" className="apple-btn apple-btn-secondary">
                Free audit ›
              </a>
              <a
                href="/tools/whatsapp-scripts"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-[15px] font-semibold text-white"
              >
                Free WA scripts
              </a>
            </div>
            <p className="mt-4 text-[13px] text-[#86868b]">
              Or{" "}
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2997ff] hover:underline"
              >
                book a free 15-min call
              </a>
            </p>
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
