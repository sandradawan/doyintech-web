"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

export default function Founder() {
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
                I started DoyinTech with a simple belief: African businesses deserve production-grade software — not fragile prototypes. I specialise in backend architecture, scalable APIs, Laravel/PHP systems, Flutter apps, and practical AI automation that solves real operational problems.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed max-w-xl">
                Every project I take on is treated like it will run in production for years. Clean code, strong security, clear documentation, and systems that can grow with the business.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Backend</p>
                  <p className="mt-2 text-xs text-gray-400">Laravel · Node · APIs</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Mobile</p>
                  <p className="mt-2 text-xs text-gray-400">Flutter Applications</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-white/10 transition duration-300">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">AI & Automation</p>
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
                  href="https://wa.me/2348085343926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl border border-[#25D366]/40 text-[#25D366] text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/10 transition duration-300 text-center"
                >
                  WhatsApp Me
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
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
          </div>
        </div>
      </div>
    </section>
  );
}
