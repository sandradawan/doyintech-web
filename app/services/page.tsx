"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaServer,
  FaCode,
  FaMobileScreen,
  FaNetworkWired,
} from "react-icons/fa6";
import Footer from "@/components/ui/Footer";
import ScrollReveal from "@/components/animations/ScrollReveal";

const services = [
  {
    title: "Web App Development",
    desc: "Crafting beautiful, responsive, and high-performance websites and web applications tailored for digital visibility and business automation.",
    img: "/services/web.png",
    icon: FaLaptopCode,
    color: "from-blue-600/20 to-indigo-600/5",
    accent: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    title: "Backend Engineering",
    desc: "Designing scalable backend architectures, microservices, caches, message queues, databases, and high-throughput server systems.",
    img: "/services/backend.png",
    icon: FaServer,
    color: "from-indigo-600/20 to-purple-600/5",
    accent: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.15)",
  },
  {
    title: "API Development & Integration",
    desc: "Building highly secure, authenticated, and self-documented REST/gRPC API channels, complete with rate-limiting and developer portals.",
    img: "/services/api.png",
    icon: FaCode,
    color: "from-cyan-600/20 to-blue-600/5",
    accent: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.15)",
  },
  {
    title: "Mobile App Development",
    desc: "Delivering cross-platform Flutter mobile applications for iOS & Android, focusing on rich animations, offline caching, and native performance.",
    img: "/services/mobile.png",
    icon: FaMobileScreen,
    color: "from-violet-600/20 to-purple-600/5",
    accent: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.15)",
  },
  {
    title: "System Design & Consulting",
    desc: "Architecting cloud deployments, logical data flows, server scaling, redundancy checks, and high-level tech planning for growing companies.",
    img: "/services/system.png",
    icon: FaNetworkWired,
    color: "from-teal-600/20 to-emerald-600/5",
    accent: "text-teal-400",
    glow: "rgba(20, 184, 166, 0.15)",
  },
];

export default function ServicesPage() {
  return (
    <>
      <main className="pt-32 pb-24 bg-[#0B0E14] relative overflow-hidden">
        {/* Glow bubbles */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" delay={0.05}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
              <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                What DoyinTech Delivers
              </h1>
              <p className="mt-5 text-gray-400 max-w-2xl leading-relaxed">
                We bridge the gap between complex business ideas and stable, scalable technology. Our key focus is clean architecture and fast delivery.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid Layout */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-white/5 bg-black/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/45"
                  >
                    {/* Background glow highlights */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle 250px at top right, ${s.glow}, transparent)`,
                      }}
                    />

                    <div>
                      {/* Card Banner Image */}
                      <div className="relative h-48 overflow-hidden border-b border-white/5">
                        <Image
                          src={s.img}
                          alt={s.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        
                        {/* Floating Icon Badge */}
                        <div className="absolute bottom-4 left-6 flex h-11 w-11 items-center justify-center rounded-xl bg-black/60 border border-white/10 text-white backdrop-blur-md">
                          <Icon size={18} />
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-display text-xl font-bold text-white tracking-tight">
                            {s.title}
                          </h3>
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Service
                          </span>
                        </div>

                        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Call to action */}
                    <div className="p-6 pt-0 mt-auto">
                      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Request scope</span>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition group-hover:translate-x-0.5">
                          <span>Get Started</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Bottom CTA Block */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/20 to-indigo-950/10 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              {/* Blur accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <h2 className="font-display text-2xl font-bold text-white">Have a project in mind?</h2>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                  Let’s schedule a brief architecture call. We will discuss your technology requirements, potential bottlenecks, and estimate the project timeline.
                </p>
              </div>

              <a
                href="/contact"
                className="relative z-10 shrink-0 px-6 py-3.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:scale-[1.02]"
              >
                Contact DoyinTech
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
