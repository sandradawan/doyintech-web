"use client";

import Image from "next/image";
import Footer from "@/components/ui/Footer";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { SERVICES } from "@/lib/services";

export default function ServicesPage() {
  return (
    <>
      <main className="bg-[#f5f5f7] pb-20 pt-20">
        <div className="mx-auto max-w-[980px] px-6">
          <ScrollReveal direction="up">
            <div className="text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6e6e73]">
                Services
              </p>
              <h1 className="apple-headline mt-3 text-[#1d1d1f]">What we build.</h1>
              <p className="apple-subhead mx-auto mt-4 max-w-2xl">
                From websites and mobile apps to backends, AI, networking, and security —
                production systems with clear communication.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.slug} direction="up" delay={i * 0.03} className="h-full">
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="apple-card group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 480px"
                      priority={i < 2}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] text-[#6e6e73]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
                      {s.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#6e6e73]">
                      {s.desc}
                    </p>
                    <span className="apple-link mt-5 text-[14px]">Learn more ›</span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.05}>
            <div className="mt-16 rounded-[28px] bg-black px-8 py-14 text-center text-white sm:px-12">
              <h2 className="text-[32px] font-semibold tracking-tight sm:text-[40px]">
                Not sure where to start?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#a1a1a6]">
                Book a short discovery call. We’ll map goals to stack, timeline, and budget.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="/contact" className="apple-btn apple-btn-primary">
                  Talk to DoyinTech
                </a>
                <a href="/portfolio" className="apple-btn apple-btn-secondary">
                  View portfolio ›
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
