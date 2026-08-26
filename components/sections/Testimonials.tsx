"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const testimonials = [
  {
    quote:
      "DoyinTech delivered our property management and client portal system on time and with excellent quality. The team understood our pension and mortgage workflows deeply.",
    name: "Imperial Villa Property",
    role: "Property Development",
    project: "Portal + Management System",
  },
  {
    quote:
      "Professional, responsive and technically strong. The marketplace platform was built cleanly and has been easy to maintain and extend.",
    name: "DoyinMart Client",
    role: "Software Marketplace",
    project: "DoyinMart",
  },
  {
    quote:
      "From design to deployment, the gaming lounge website was handled with great attention to detail. Booking and tournament features work perfectly for our customers.",
    name: "LegacyPlay",
    role: "Gaming Lounge",
    project: "LegacyPlay Website",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#080A0F] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Client Feedback
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Trusted by founders & teams
            </h2>
            <p className="mt-4 text-gray-400">
              Real results from real projects. Here’s what clients say after working with DoyinTech.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="h-full rounded-2xl border border-white/5 bg-black/30 p-7 flex flex-col"
              >
                <div className="flex gap-1 text-primary mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed flex-1">“{t.quote}”</p>
                <div className="mt-6 pt-5 border-t border-white/5">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role} · {t.project}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
