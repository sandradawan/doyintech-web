"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const faqs = [
  {
    q: "What is your typical project timeline?",
    a: "Most websites and medium-sized applications take 3–8 weeks depending on scope. Complex backend systems or multi-platform apps can take 2–4 months. We always provide a clear timeline after the discovery call.",
  },
  {
    q: "How do you price projects?",
    a: "We work primarily on fixed-scope projects after a clear requirements discussion. For ongoing work we also offer monthly retainers. You’ll always know the investment before we start.",
  },
  {
    q: "Do you provide ongoing support after launch?",
    a: "Yes. We offer maintenance packages that include bug fixes, small improvements, monitoring and priority support. Many clients stay with us long-term.",
  },
  {
    q: "What technologies do you specialise in?",
    a: "Next.js / React, Flutter, Node.js, PostgreSQL, Redis, Docker and modern API design. We focus on clean architecture, security and scalability rather than chasing every new trend.",
  },
  {
    q: "Can you work with existing codebases?",
    a: "Absolutely. We frequently take over, refactor or extend existing projects. We start with a technical audit so everyone understands the current state and the best path forward.",
  },
  {
    q: "Do you work with clients outside Nigeria?",
    a: "Yes. While we are based in Jos, Nigeria, we work with clients across Africa, Europe and North America. Communication is mainly via WhatsApp, email and video calls.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 bg-[#0B0E14]">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Common questions
            </h2>
            <p className="mt-4 text-gray-400">
              Everything you need to know before starting a project with us.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.05}>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-white pr-4">{faq.q}</span>
                  <span className="text-primary text-xl shrink-0">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
