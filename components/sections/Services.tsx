"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaServer, FaMobileScreen, FaCode, FaNetworkWired } from "react-icons/fa6";
import ScrollReveal from "../animations/ScrollReveal";

const services = [
  {
    title: "Backend Engineering",
    description: "Scalable APIs, microservices, and secure system architectures built for high-throughput performance.",
    icon: FaServer,
    img: "/service-backend.png",
    color: "from-blue-600/20 to-indigo-600/5",
    borderGlow: "group-hover:border-blue-500/50",
  },
  {
    title: "Mobile Development",
    description: "High-quality Flutter applications built with clean architecture, smooth transitions, and premium UX.",
    icon: FaMobileScreen,
    img: "/service-mobile.png",
    color: "from-violet-600/20 to-purple-600/5",
    borderGlow: "group-hover:border-violet-500/50",
  },
  {
    title: "API Development",
    description: "Secure, highly-available, and well-documented APIs designed for developer experience and seamless integrations.",
    icon: FaCode,
    img: "/service-api.png",
    color: "from-cyan-600/20 to-blue-600/5",
    borderGlow: "group-hover:border-cyan-500/50",
  },
  {
    title: "System Architecture",
    description: "Designing resilient, distributed database models and infrastructure workflows that scale with business growth.",
    icon: FaNetworkWired,
    img: "/service-arch.png",
    color: "from-teal-600/20 to-emerald-600/5",
    borderGlow: "group-hover:border-teal-500/50",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-32 bg-[#0B0E14] overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Core Capabilities
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Tailored Engineering Services
            </h2>
            <p className="mt-4 text-gray-400">
              We design, build, and optimize digital products using modern best practices, clean architecture, and robust security protocols.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <ScrollReveal
                key={s.title}
                direction="up"
                delay={i * 0.08}
                className="h-full"
              >
                <a
                  href="/contact"
                  className={`group block h-full relative rounded-2xl border border-white/5 bg-gradient-to-b ${s.color} p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 ${s.borderGlow}`}
                >
                  {/* Absolute Card Image Overlay on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Icon & Title */}
                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white group-hover:bg-primary group-hover:text-white transition duration-300">
                      <Icon size={22} className="group-hover:scale-110 transition duration-300" />
                    </div>

                    <h3 className="mt-6 font-display text-xl font-bold text-white tracking-tight">
                      {s.title}
                    </h3>
                    
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-primary">
                      <span className="group-hover:underline">Get started</span>
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
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
