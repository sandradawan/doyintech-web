"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "property", label: "Property & Fintech" },
  { id: "web", label: "Web Platforms" },
  { id: "saas", label: "SaaS & Dashboards" },
];

const projects = [
  {
    title: "Imperial Villa Property",
    subtitle: "Corporate Website + Mortgage Solutions",
    tags: ["Next.js", "Property", "25% Equity Mortgage"],
    img: "/port-ecom.png",
    category: "property",
    liveUrl: "https://www.imperialvillapropertydevelopment.com",
  },
  {
    title: "Imperial Villa System",
    subtitle: "Staff Portal • Client Management",
    tags: ["Dashboard", "Multi-branch", "RSA Accounts"],
    img: "/service-backend.png",
    category: "saas",
    liveUrl: "https://system.imperialvillapropertydevelopment.com",
  },
  {
    title: "DoyinMart",
    subtitle: "African Software Marketplace",
    tags: ["Next.js", "Marketplace", "E-commerce"],
    img: "/port-edu.png",
    category: "web",
    liveUrl: "https://doyinsoft.vercel.app",
  },
  {
    title: "LegacyPlay",
    subtitle: "PlayStation Gaming Lounge",
    tags: ["Next.js", "Booking", "Tournaments"],
    img: "/port-church.png",
    category: "web",
    liveUrl: "https://legacyplay.vercel.app",
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = projects.filter(
    (p) => activeTab === "all" || p.category === activeTab
  );

  return (
    <section id="projects" className="py-32 bg-[#080A0F] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Selected Work
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Engineered Solutions
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl">
                Real platforms and systems shipped for clients and brands. Every project links to the live site.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 border border-white/10 p-1.5 self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition duration-300 ${
                    activeTab === cat.id ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {activeTab === cat.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-lg bg-primary shadow-lg shadow-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <motion.div layout className="mt-14 grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.div
                layout
                key={p.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-white/10 bg-black/30 overflow-hidden hover:border-primary/60 transition-all duration-300"
              >
                <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-black/35 to-transparent" />
                  <span className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-300 backdrop-blur-md">
                    {p.category}
                  </span>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/10">
                  <h3 className="font-display text-xl font-bold text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wide">
                    {p.subtitle}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-md border border-white/5 bg-white/5 text-gray-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1"
                    >
                      <span>Visit Live Site</span>
                      <span>→</span>
                    </a>
                    <a
                      href="/portfolio"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Full Portfolio
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
