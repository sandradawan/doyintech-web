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
    initials: "IV",
  },
  {
    quote:
      "Professional, responsive and technically strong. The marketplace platform was built cleanly and has been easy to maintain and extend.",
    name: "DoyinMart Client",
    role: "Software Marketplace",
    project: "DoyinMart",
    initials: "DM",
  },
  {
    quote:
      "From design to deployment, the gaming lounge website was handled with great attention to detail. Booking and tournament features work perfectly for our customers.",
    name: "LegacyPlay",
    role: "Gaming Lounge",
    project: "LegacyPlay Website",
    initials: "LP",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#080A0F] py-28">
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[520px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up">
          <div className="max-w-2xl">
            <span className="section-eyebrow text-primary">Client feedback</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Trusted by founders{" "}
              <span className="gradient-text">& teams</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Real results from real projects. Here’s what clients say after working with
              DoyinTech.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} direction="up" delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="pro-card flex h-full flex-col p-7"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, idx) => (
                      <svg
                        key={idx}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-4xl leading-none text-white/10">“</span>
                </div>

                <p className="flex-1 text-[15px] leading-relaxed text-gray-300">
                  {t.quote}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-xs font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">
                      {t.role} · {t.project}
                    </p>
                  </div>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
