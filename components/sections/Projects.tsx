"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const categories = [
  { id: "all", label: "All" },
  { id: "property", label: "Property" },
  { id: "web", label: "Web" },
  { id: "saas", label: "SaaS" },
];

const shot = (url: string) =>
  `https://image.thum.io/get/width/900/crop/560/noanimate/${url}`;

const projects = [
  {
    title: "Imperial Villa Property",
    subtitle: "Corporate website + mortgage solutions",
    tags: ["Next.js", "Property", "Mortgage"],
    img: shot("https://www.imperialvillapropertydevelopment.com"),
    category: "property",
    liveUrl: "https://www.imperialvillapropertydevelopment.com",
  },
  {
    title: "Imperial Villa System",
    subtitle: "Staff portal · client management",
    tags: ["Dashboard", "Multi-branch"],
    img: shot("https://system.imperialvillapropertydevelopment.com"),
    category: "saas",
    liveUrl: "https://system.imperialvillapropertydevelopment.com",
  },
  {
    title: "DoyinMart",
    subtitle: "African software marketplace",
    tags: ["Next.js", "Marketplace"],
    img: shot("https://doyinsoft.vercel.app"),
    category: "web",
    liveUrl: "https://doyinsoft.vercel.app",
  },
  {
    title: "LegacyPlay",
    subtitle: "PlayStation gaming lounge",
    tags: ["Next.js", "Booking"],
    img: shot("https://legacyplay.vercel.app"),
    category: "web",
    liveUrl: "https://legacyplay.vercel.app",
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = projects.filter(
    (p) => activeTab === "all" || p.category === activeTab
  );

  return (
    <section id="projects" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline">Selected work.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-xl">
              Live platforms — screenshots from real production sites.
            </p>
            <a href="/portfolio" className="apple-link mt-4 inline-block text-[17px]">
              Full portfolio ›
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-full px-4 py-2 text-[13px] transition ${
                activeTab === cat.id
                  ? "bg-white text-black"
                  : "bg-white/10 text-[#f5f5f7] hover:bg-white/15"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.a
                layout
                key={p.title}
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="apple-card group block overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={p.img}
                    alt={`Screenshot of ${p.title}`}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[20px] font-semibold tracking-tight text-[#f5f5f7]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#a1a1a6]">{p.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-[#a1a1a6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="apple-link mt-4 inline-block text-[14px]">Visit site ›</span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
