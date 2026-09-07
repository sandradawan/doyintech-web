"use client";

import Image from "next/image";
import Footer from "@/components/ui/Footer";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { SERVICES } from "@/lib/services";

export default function ServicesPage() {
  return (
    <>
      <main className="relative overflow-hidden bg-[#0B0E14] pb-24 pt-32">
        <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Full service catalog
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                Everything we build for{" "}
                <span className="gradient-text">modern businesses</span>
              </h1>
              <p className="mt-5 max-w-2xl leading-relaxed text-gray-400">
                From websites and mobile apps to backends, AI automation, and security —
                DoyinTech delivers production systems with clean architecture and clear
                communication. Photography below is real stock photography (Unsplash),
                not AI-generated art.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.slug} direction="up" delay={i * 0.05} className="h-full">
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="pro-card group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-200 backdrop-blur-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold tracking-tight text-white">
                      {s.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary/90">{s.short}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
                      {s.desc}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {s.featured ? "Core service" : "Available"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition group-hover:translate-x-0.5">
                        Get started →
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.08}>
            <div className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/30 to-indigo-950/15 p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <h2 className="font-display text-2xl font-bold text-white">
                    Not sure which service you need?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    Book a short discovery call. We’ll map your goals to the right stack,
                    timeline, and budget — no jargon, no pressure.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                  >
                    Talk to DoyinTech
                  </a>
                  <a
                    href="/portfolio"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/5"
                  >
                    View portfolio
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
