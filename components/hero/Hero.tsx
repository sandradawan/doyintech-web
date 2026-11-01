"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PRIMARY_CTA } from "@/lib/cta";

type Slide = {
  tab: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { href: string; label: string };
  /** Still image; it pushes in slowly so it moves like footage. Also the video poster. */
  img: string;
  /** Optional short muted loop (mp4 in /public/hero). Plays over the still when set. */
  video?: string;
};

const SLIDES: Slide[] = [
  {
    tab: "Websites",
    eyebrow: "Fixed-price websites",
    title: "Websites that bring you customers.",
    desc: "Landing pages from $65 and local business sites from $161, with WhatsApp booking built in. Pay a 50% deposit and go live in 1–2 weeks.",
    cta: PRIMARY_CTA,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2400&q=80",
  },
  {
    tab: "Care plans",
    eyebrow: "Website care plans",
    title: "Looked after, every month.",
    desc: "Security, backups, updates and monthly improvements, from ₦50,000 a month, so your site keeps working while you run the business.",
    cta: { href: "/care-plans", label: "See care plans" },
    img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=2400&q=80",
  },
  {
    tab: "Free tools",
    eyebrow: "Free business tools",
    title: "Invoices, VAT and payroll, done in minutes.",
    desc: "Invoice in 73 currencies, check VAT for 90+ countries, and work out PAYE and payslips. Free, with no sign-up.",
    cta: { href: "/tools", label: "Open the free tools" },
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2400&q=80",
  },
  {
    tab: "Free audit",
    eyebrow: "Free website audit",
    title: "Find the enquiries you're losing.",
    desc: "Send your web address and get 2–3 specific fixes in your inbox. Do them yourself, or let us handle them.",
    cta: { href: "/free-audit", label: "Get a free audit" },
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=2400&q=80",
  },
];

const INTERVAL = 7000;

export default function Hero() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !paused && !reduce;

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(next, INTERVAL);
    return () => window.clearTimeout(id);
  }, [current, playing, next]);

  const slide = SLIDES[current];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="DoyinTech highlights"
      className={`relative isolate flex min-h-[640px] w-full flex-col overflow-hidden bg-black pt-12 sm:min-h-[700px] lg:h-[min(92vh,880px)] ${playing ? "" : "hero-paused"}`}
      style={{ ["--hero-interval" as string]: `${INTERVAL}ms` }}
    >
      {/* Media */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: "easeInOut" }}
          className="absolute inset-0 -z-20"
        >
          <div className="hero-push absolute inset-0">
            <Image src={slide.img} alt="" fill priority={current === 0} sizes="100vw" className="object-cover" />
          </div>
          {slide.video && !reduce && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={slide.video}
              poster={slide.img}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Legibility: dark left side for the text, fade into the page below */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_45%,rgba(0,0,0,0.2)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black to-transparent" />

      {/* Copy */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-center px-5 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[640px] py-16"
            aria-live={playing ? "off" : "polite"}
          >
            <p className="t-eyebrow">{slide.eyebrow}</p>
            <h1 className="t-display mt-4 text-white">{slide.title}</h1>
            <p className="t-lead mt-5 max-w-[540px]">{slide.desc}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={slide.cta.href} className="apple-btn bg-[#ff8c14] px-6 font-semibold text-black hover:brightness-110">
                {slide.cta.label}
              </Link>
              {slide.cta.href !== PRIMARY_CTA.href ? (
                <Link href={PRIMARY_CTA.href} className="apple-btn apple-btn-secondary">
                  {PRIMARY_CTA.label}
                </Link>
              ) : (
                <Link href="/case-studies" className="apple-btn apple-btn-secondary">
                  See our work
                </Link>
              )}
            </div>
            <p className="mt-5 text-[13px] text-white/55">Fixed price · 50% deposit · live in 1–2 weeks</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide tabs with progress, plus pause control */}
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-8 sm:px-6">
        <div className="flex items-end gap-3">
          <div role="tablist" aria-label="Choose a slide" className="grid flex-1 grid-cols-4 gap-2 sm:gap-4">
            {SLIDES.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                role="tab"
                aria-selected={i === current}
                onClick={() => setCurrent(i)}
                className="group min-h-11 text-left"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/20">
                  {i === current && (
                    <span key={`${current}-${playing}`} className={`absolute inset-0 rounded-full bg-[#ff8c14] ${playing ? "hero-progress" : ""}`} />
                  )}
                  {i < current && <span className="absolute inset-0 rounded-full bg-white/50" />}
                </span>
                <span className={`mt-2.5 hidden text-[13px] font-medium transition sm:block ${i === current ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                  {s.tab}
                </span>
              </button>
            ))}
          </div>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/50 hover:text-white"
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3.5 2v10l8-5z" fill="currentColor" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3.5 2h2.5v10H3.5zM8 2h2.5v10H8z" fill="currentColor" /></svg>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
