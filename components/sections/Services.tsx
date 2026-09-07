"use client";

import React from "react";
import Image from "next/image";
import { FaServer, FaMobileScreen, FaCode, FaNetworkWired } from "react-icons/fa6";
import ScrollReveal from "../animations/ScrollReveal";

const services = [
  {
    title: "Backend Engineering",
    description:
      "Scalable APIs, microservices, and secure system architectures built for high-throughput performance.",
    icon: FaServer,
    img: "/service-backend.png",
    accent: "group-hover:border-blue-500/40",
  },
  {
    title: "Mobile Development",
    description:
      "High-quality Flutter applications built with clean architecture, smooth transitions, and premium UX.",
    icon: FaMobileScreen,
    img: "/service-mobile.png",
    accent: "group-hover:border-violet-500/40",
  },
  {
    title: "API Development",
    description:
      "Secure, highly-available, and well-documented APIs designed for developer experience and seamless integrations.",
    icon: FaCode,
    img: "/service-api.png",
    accent: "group-hover:border-cyan-500/40",
  },
  {
    title: "System Architecture",
    description:
      "Designing resilient, distributed database models and infrastructure workflows that scale with business growth.",
    icon: FaNetworkWired,
    img: "/service-arch.png",
    accent: "group-hover:border-teal-500/40",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#0B0E14] py-32">
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" delay={0.05}>
          <div className="max-w-2xl">
            <span className="section-eyebrow text-primary">Core capabilities</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Tailored engineering{" "}
              <span className="gradient-text">services</span>
            </h2>
            <p className="mt-4 text-gray-400">
              We design, build, and optimize digital products using modern best practices,
              clean architecture, and robust security protocols.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.title} direction="up" delay={i * 0.07} className="h-full">
                <a
                  href="/contact"
                  className={`pro-card group block h-full overflow-hidden p-6 ${s.accent}`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]">
                    <Image
                      src={s.img}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                      <Icon size={22} className="transition duration-300 group-hover:scale-110" />
                    </div>

                    <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.description}</p>

                    <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <span>Get started</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
