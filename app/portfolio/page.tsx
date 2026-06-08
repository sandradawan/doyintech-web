"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/ui/Footer";
import ScrollReveal from "@/components/animations/ScrollReveal";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "backend", label: "Backend & APIs" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "web", label: "Web Platforms" },
];

const projects = [
  {
    title: "Fintech API Platform",
    tags: ["API Gateway", "OAuth2", "Redis", "Telemetry"],
    desc: "A highly secure and optimized API platform supporting customizable client tokens, rate-limiting, comprehensive webhook events, and visual usage charts.",
    img: "/port-fintech.png",
    category: "backend",
  },
  {
    title: "Church & Community Portal",
    tags: ["Next.js", "PostgreSQL", "Paystack", "Admin Dashboard"],
    desc: "An all-in-one community system supporting online giving portals, event scheduling, automated newsletters, and secure membership management.",
    img: "/port-church.png",
    category: "web",
  },
  {
    title: "E-commerce Backend Service",
    tags: ["GoLang", "gRPC", "RabbitMQ", "Stripe"],
    desc: "A high-performance microservices engine designed to handle heavy concurrent checkouts, inventory updates, queues, and order status analytics.",
    img: "/port-ecom.png",
    category: "backend",
  },
  {
    title: "Education & Learning App",
    tags: ["Flutter", "Dart", "Firebase", "State Management"],
    desc: "A cross-platform mobile application supporting student learning modules, offline course progress tracking, and push notification reminders.",
    img: "/port-edu.png",
    category: "mobile",
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
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Portfolio</p>
                <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Selected Work
                </h1>
                <p className="mt-5 text-gray-400 max-w-xl leading-relaxed">
                  A detailed snapshot of systems we have architected and deployed. Use the tabs below to explore projects by category.
                </p>
              </div>

              {/* Filtering Selector */}
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

          {/* Grid Cards Container */}
          <motion.div 
            layout 
            className="mt-14 grid md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
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
                    {/* Banner Image */}
                    <div className="relative h-56 overflow-hidden border-b border-white/5">
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover object-top opacity-90 transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-black/25 to-transparent" />
                      
                      {/* Floating tag */}
                      <span className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-300 backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>

                    {/* Content */}
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
                      
                      <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="border-t border-white/5 pt-5 flex items-center justify-between gap-4">
                      <a
                        href="/contact"
                        className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition duration-300 hover:scale-[1.02]"
                      >
                        Request Similar Build
                      </a>
                      <a
                        href="/services"
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary text-gray-300 text-xs font-semibold transition duration-300"
                      >
                        View Services
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
