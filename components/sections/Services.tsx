"use client";

import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";
import { FEATURED_SERVICES } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#0B0E14] py-32">
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="section-eyebrow text-primary">Core capabilities</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                Services built for{" "}
                <span className="gradient-text">real results</span>
              </h2>
              <p className="mt-4 text-gray-400">
                Web, mobile, backend, AI, and security — engineered with clean architecture
                and delivered with clear communication.
              </p>
            </div>
            <a
              href="/services"
              className="shrink-0 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-primary/40 hover:text-primary"
            >
              View all services →
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} direction="up" delay={i * 0.06} className="h-full">
              <a href={s.href} className="pro-card group flex h-full flex-col overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-black/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Learn more
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
