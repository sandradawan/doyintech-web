"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import Footer from "@/components/ui/Footer";
import ScrollReveal from "@/components/animations/ScrollReveal";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "property", label: "Property & Fintech" },
  { id: "web", label: "Web Platforms" },
  { id: "saas", label: "SaaS & Dashboards" },
  { id: "brand", label: "Brand & Creative" },
];

const projects = [
  {
    title: "Imperial Villa Property Website",
    subtitle: "Premium Property Solutions",
    tags: ["Next.js", "Property", "Mortgage", "Marketing"],
    desc: "Official corporate website for ImperialVilla Property Development Ltd. Showcases estates, 25% Equity Mortgage solutions, testimonials and lead generation for premium property clients.",
    img: "/port-ecom.png",
    category: "property",
    liveUrl: "https://www.imperialvillapropertydevelopment.com",
  },
  {
    title: "Imperial Villa Client Portal",
    subtitle: "Secure Client Access",
    tags: ["Auth", "Portal", "Pension", "Dashboard"],
    desc: "Secure client-facing portal for ImperialVilla. Handles sign-in, pension management messaging and 25% equity mortgage client onboarding experience.",
    img: "/port-fintech.png",
    category: "property",
    liveUrl: "https://portal.imperialvillapropertydevelopment.com",
  },
  {
    title: "Imperial Villa Management System",
    subtitle: "Staff & Branch Operations",
    tags: ["Dashboard", "Client Management", "RSA", "Multi-branch"],
    desc: "Internal staff portal and operations system for ImperialVilla Property Development. Manages 1,800+ clients, RSA accounts, fund disbursements across multiple branches and PFA partners.",
    img: "/service-backend.png",
    category: "saas",
    liveUrl: "https://system.imperialvillapropertydevelopment.com",
  },
  {
    title: "IPVL Lobby Dashboard",
    subtitle: "Operations Lobby",
    tags: ["Dashboard", "Real-time", "Operations"],
    desc: "Lobby and operations dashboard for ImperialVilla (IPVL). Provides real-time overview and staff access point for the property & pension facilitation platform.",
    img: "/service-api.png",
    category: "saas",
    liveUrl: "https://ipvl.vercel.app",
  },
  {
    title: "DoyinTech Official Website",
    subtitle: "Engineering Agency Brand",
    tags: ["Next.js 16", "Framer Motion", "Three.js", "Tailwind"],
    desc: "The official DoyinTech website — premium dark UI, animated hero, 3D ambient scene, services, portfolio and contact flows. Built for conversion and brand presence.",
    img: "/services/web.png",
    category: "web",
    liveUrl: "https://doyintech.vercel.app",
  },
  {
    title: "DoyinMart",
    subtitle: "African Software Marketplace",
    tags: ["Next.js", "Marketplace", "E-commerce", "Products"],
    desc: "A modern marketplace platform built for African markets. Features software products, learning systems, logistics tools and design assets with local pricing and ratings.",
    img: "/port-edu.png",
    category: "web",
    liveUrl: "https://doyinsoft.vercel.app",
  },
  {
    title: "LegacyPlay",
    subtitle: "PlayStation Gaming Lounge",
    tags: ["Next.js", "Booking", "Tournaments", "Local Business"],
    desc: "Complete website for LegacyPlay — Abuja’s premium PlayStation gaming lounge. Station booking, tournament listings, pricing, location and WhatsApp integration.",
    img: "/port-church.png",
    category: "web",
    liveUrl: "https://legacyplay.vercel.app",
  },
  {
    title: "JennyGlams",
    subtitle: "Makeup Artistry Brand",
    tags: ["Next.js", "Portfolio", "Booking", "Creative"],
    desc: "Elegant portfolio and booking site for JennyGlams (Jennifer Jesse) — Jos-based makeup artist specialising in bridal, soft glam, editorial and masterclasses.",
    img: "/port-fintech.png",
    category: "brand",
    liveUrl: "https://jennyglams.vercel.app",
  },
  {
    title: "Arqademy CBT Platform",
    subtitle: "Computer-Based Testing",
    tags: ["CBT", "Education", "Exam Platform"],
    desc: "Computer-Based Testing platform under the Arqademy domain. Built for practice exams, student assessment and digital learning workflows.",
    img: "/service-arch.png",
    category: "saas",
    liveUrl: "https://cbt.arqademy.com.ng",
  },
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = projects.filter(
    (p) => activeTab === "all" || p.category === activeTab
  );

  return (
    <>
      <main className="pt-32 pb-24 bg-[#0B0E14] relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Portfolio
                </p>
                <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Selected Work
                </h1>
                <p className="mt-5 text-gray-400 max-w-xl leading-relaxed">
                  Real products and platforms built and shipped. Every card links to the live site.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 border border-white/10 p-1.5 self-start md:self-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition duration-300 ${
                      activeTab === cat.id
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {activeTab === cat.id && (
                      <motion.div
                        layoutId="portfolioTabIndicator"
                        className="absolute inset-0 rounded-lg bg-primary shadow-lg shadow-primary/25"
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
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-black/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                >
                  <div>
                    <div className="relative h-56 overflow-hidden border-b border-white/5">
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover object-top opacity-90 transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-black/25 to-transparent" />
                      <span className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-300 backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/5 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wide">
                        {p.subtitle}
                      </p>

                      <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <div className="border-t border-white/5 pt-5 flex flex-wrap items-center gap-3">
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition duration-300 hover:scale-[1.02]"
                      >
                        Visit Live Site <FaExternalLinkAlt size={11} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
