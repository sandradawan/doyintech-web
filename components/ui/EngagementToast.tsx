"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TIPS = [
  {
    title: "Free website audit",
    body: "Send your URL — get 2–3 fixes that block enquiries.",
    href: "/free-audit",
    cta: "Start audit",
  },
  {
    title: "WhatsApp scripts",
    body: "Copy-paste replies for price questions and bookings.",
    href: "/tools/whatsapp-scripts",
    cta: "Get scripts",
  },
  {
    title: "Refer & earn ₦10k",
    body: "Introduce a business that pays deposit — you get credit.",
    href: "/refer",
    cta: "Refer now",
  },
  {
    title: "Landing page ₦100k",
    body: "One page that sells one offer. 50% deposit on Paystack.",
    href: "/hire",
    cta: "View package",
  },
];

export default function EngagementToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const showTimer = window.setTimeout(() => setVisible(true), 12000);
    const rotate = window.setInterval(() => {
      setIndex((i) => (i + 1) % TIPS.length);
      setVisible(true);
    }, 45000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(rotate);
    };
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const hide = window.setTimeout(() => setVisible(false), 8000);
    return () => window.clearTimeout(hide);
  }, [visible, index, dismissed]);

  if (dismissed) return null;
  const tip = TIPS[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, x: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-24 left-4 z-[90] max-w-[280px] md:bottom-6 md:left-6"
        >
          <div className="rounded-2xl border border-white/10 bg-[rgba(22,22,23,0.97)] p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                {tip.title}
              </p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => {
                  setDismissed(true);
                  setVisible(false);
                }}
                className="text-[14px] leading-none text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-[#c7cdd8]">{tip.body}</p>
            <a
              href={tip.href}
              className="mt-3 inline-flex text-[13px] font-semibold text-[#2997ff] hover:underline"
            >
              {tip.cta} →
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
