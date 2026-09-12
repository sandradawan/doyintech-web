"use client";

import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";
import { FEATURED_SERVICES } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="apple-section apple-section-gray">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline text-[#1d1d1f]">Services.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Everything you need to design, build, and scale digital products.
            </p>
            <a href="/services" className="apple-link mt-4 inline-block text-[17px]">
              Explore all services ›
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {FEATURED_SERVICES.slice(0, 4).map((s, i) => (
            <ScrollReveal key={s.slug} direction="up" delay={i * 0.05}>
              <a
                href={s.href}
                className={`apple-card group block h-full overflow-hidden ${
                  i % 2 === 0 ? "apple-card-dark" : ""
                }`}
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-[24px] font-semibold tracking-tight">{s.title}</h3>
                  <p
                    className={`mt-2 text-[15px] leading-relaxed ${
                      i % 2 === 0 ? "text-[#a1a1a6]" : "text-[#6e6e73]"
                    }`}
                  >
                    {s.short}
                  </p>
                  <span className="apple-link mt-4 inline-block text-[14px]">Learn more ›</span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
