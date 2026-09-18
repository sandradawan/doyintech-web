"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const faqs = [
  {
    q: "How much do I pay upfront?",
    a: "For fixed-price websites: 50% deposit to start, balance before final handoff. Digital products are full payment via Paystack with instant download. No long contracts for entry packages.",
  },
  {
    q: "What if I’m not happy with the result?",
    a: "We work in structured feedback rounds. You see drafts early. Balance is only due when you’re ready for launch. Care plans keep small fixes covered after go-live.",
  },
  {
    q: "Can I pay with Naira / Paystack / transfer?",
    a: "Yes. Deposits and digital products accept Paystack (card, bank, USSD). WhatsApp transfer is also fine for services — we’ll send account details after scope is clear.",
  },
  {
    q: "How fast can a simple site go live?",
    a: "Landing Page Starter: about 5–10 days after content + deposit. Local Business Website: typically 7–14 days. Growth packages take 2–4 weeks depending on pages and content readiness.",
  },
  {
    q: "Do you only work with big companies?",
    a: "No. Most clients are coaches, salons, property agents, clinics, freelancers, and local shops who need a site that gets WhatsApp enquiries — not a vanity brochure.",
  },
  {
    q: "What is your typical project timeline?",
    a: "Most websites and medium-sized applications take 1–8 weeks depending on scope. Complex systems can take 2–4 months. You get a clear timeline after a short discovery call.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes — optional Monthly Care Plans cover security updates, backups, small content changes, and priority WhatsApp support so your site stays fast and secure.",
  },
  {
    q: "Can you work with an existing website or codebase?",
    a: "Yes. We audit, fix, redesign, or extend existing projects. You’ll get a clear plan and fixed price before any paid work begins.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[680px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline">Questions before you buy.</h2>
            <p className="apple-subhead mt-3">
              Price, deposit, timeline, and risk — answered clearly.
            </p>
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
                  <span className="pr-4 text-[16px] font-medium text-[#f5f5f7]">
                    {faq.q}
                  </span>
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

        <ScrollReveal direction="up" delay={0.15}>
          <div className="mt-10 text-center">
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20have%20a%20question%20before%20buying%20%2F%20hiring."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Ask on WhatsApp — free
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
