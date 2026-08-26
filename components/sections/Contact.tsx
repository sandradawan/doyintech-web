"use client";

import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 bg-[#0B0E14] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" delay={0.05} blur>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-md p-10 md:p-14 overflow-hidden relative">
            {/* Subtle top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Founder availability badge */}
            <div className="inline-flex items-center gap-3.5 mb-7 px-4 py-2 rounded-full border border-white/8 bg-white/5 backdrop-blur-sm">
              <div className="relative h-9 w-9 rounded-full border border-white/15 overflow-hidden shrink-0">
                <Image
                  src="/founder.png"
                  alt="Silas Doyin Jonathan"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Silas D. Jonathan
                </span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for projects
                </span>
              </div>
            </div>

            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Let’s build something{" "}
              <span className="text-primary">that scales</span>.
            </h3>
            <p className="mt-4 text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed">
              Tell me what you’re building — I’ll help you plan, architect, and
              ship it with premium quality and clean engineering.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:doyintechnology@outlook.com"
                className="group relative inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] text-center overflow-hidden"
              >
                <span className="relative z-10">Email DoyinTech</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                View Services
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
