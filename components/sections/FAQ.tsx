"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const faqs = [
  {
    q: "What is your typical project timeline?",
    a: "Most websites and medium-sized applications take 3–8 weeks depending on scope. Complex systems can take 2–4 months. You’ll get a clear timeline after discovery.",
  },
  {
    q: "How do you price projects?",
    a: "Primarily fixed-scope after requirements are clear. Monthly retainers are available for ongoing work. You’ll know the investment before we start.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes — maintenance packages cover fixes, small improvements, monitoring, and priority support.",
  },
  {
    q: "What technologies do you specialise in?",
    a: "Next.js, React, Flutter, Laravel, PHP, Node.js, MySQL, PostgreSQL, and practical AI automation — focused on security and scale.",
  },
  {
    q: "Can you work with existing codebases?",
    a: "Yes. We audit, refactor, or extend existing projects with a clear plan before changes begin.",
  },
  {
    q: "Do you work with clients outside Nigeria?",
    a: "Yes. Based in Jos, Nigeria, we work across Africa, Europe, and North America via WhatsApp, email, and video calls.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[680px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline">Questions.</h2>
            <p className="apple-subhead mt-3">Everything before you start a project.</p>
          </div>
        </ScrollReveal>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.q} direction="up" delay={i * 0.04}>
              <div className="apple-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="pr-4 text-[16px] font-medium text-[#f5f5f7]">{faq.q}</span>
                  <span className="shrink-0 text-[20px] text-[#2997ff]">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-[#a1a1a6]">
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
