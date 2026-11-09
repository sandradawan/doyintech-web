"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
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
    title: "Website design that brings you customers.",
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

const EASE = [0.22, 1, 0.36, 1] as const;
const rise: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const wordUp: Variants = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.7, ease: EASE } } };
const pop: Variants = { hidden: { opacity: 0, scale: 0.92, y: 10 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

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
      className={`relative isolate flex min-h-[640px] w-full flex-col overflow-hidden bg-brand-deep pt-12 sm:min-h-[700px] lg:h-[min(92vh,880px)] ${playing ? "" : "hero-paused"}`}
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
            <Image src={slide.img} alt="" fill priority={current === 0} sizes="100vw" className="object-cover opacity-95" />
          </div>
          {slide.video && !reduce && (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-95"
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,41,31,0.45)_0%,rgba(6,41,31,0.3)_100%)] sm:bg-[linear-gradient(90deg,rgba(6,41,31,0.6)_0%,rgba(6,41,31,0.25)_55%,rgba(6,41,31,0.05)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#06291f]/90 to-transparent" />

      {/* Copy */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-center px-5 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit={reduce ? undefined : "exit"}
            variants={{ show: { transition: { staggerChildren: 0.09 } }, exit: { opacity: 0, y: -12, transition: { duration: 0.3 } } }}
            className="glass-hero my-12 max-w-[680px] rounded-[28px] p-6 sm:p-9"
            aria-live={playing ? "off" : "polite"}
          >
            <motion.p variants={rise} className="t-eyebrow">{slide.eyebrow}</motion.p>
            {/* Each word slides up out of its own mask */}
            <motion.h1
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="t-display mt-4 font-bold text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
            >
              {slide.title.split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span variants={wordUp} className="inline-block">
                    {word}
                    {" "}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
            <motion.p variants={rise} className="t-lead mt-5 max-w-[560px] font-medium text-white/85">
              {slide.desc}
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
              <motion.span variants={pop} className="inline-flex">
                <Link
                  href={slide.cta.href}
                  className="hero-cta apple-btn relative overflow-hidden bg-[#ff8c14] px-6 font-semibold text-black shadow-[0_8px_30px_rgba(255,140,20,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  {slide.cta.label}
                </Link>
              </motion.span>
              <motion.span variants={pop} className="inline-flex">
                {slide.cta.href !== PRIMARY_CTA.href ? (
                  <Link href={PRIMARY_CTA.href} className="apple-btn apple-btn-secondary transition hover:-translate-y-0.5">
                    {PRIMARY_CTA.label}
                  </Link>
                ) : (
                  <Link href="/case-studies" className="apple-btn apple-btn-secondary transition hover:-translate-y-0.5">
                    See our work
                  </Link>
                )}
              </motion.span>
            </motion.div>
            <motion.p variants={rise} className="mt-5 text-[13px] text-white/60">
              Fixed price · 50% deposit · live in 1–2 weeks
            </motion.p>
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
