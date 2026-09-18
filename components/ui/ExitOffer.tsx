"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "doyin_exit_offer_dismissed";
const COOLDOWN_MS = 18 * 60 * 60 * 1000; // 18 hours

function wasDismissedRecently() {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const t = Number(raw);
    return Number.isFinite(t) && Date.now() - t < COOLDOWN_MS;
  } catch {
    return false;
  }
}

export default function ExitOffer() {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (wasDismissedRecently()) return;

    // Arm after user has seen some of the page
    const armTimer = window.setTimeout(() => setArmed(true), 12000);

    // Desktop exit-intent
    const onLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY > 12) return;
      setOpen(true);
    };

    // Mobile / tablet: timed offer after meaningful scroll
    let scrolledEnough = false;
    const onScroll = () => {
      if (window.scrollY > 500) scrolledEnough = true;
    };

    const mobileTimer = window.setTimeout(() => {
      if (window.innerWidth < 768 && scrolledEnough && !wasDismissedRecently()) {
        setOpen(true);
      }
    }, 28000);

    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(armTimer);
      window.clearTimeout(mobileTimer);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [armed]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  const hireHref = "/hire";
  const waHref =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, I saw the Landing Page Starter offer (₦100,000 · deposit ₦50,000). I want to lock a slot."
    );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-offer-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close offer"
            onClick={dismiss}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121214] shadow-2xl"
          >
            <div className="border-b border-[#ff8c14]/20 bg-gradient-to-r from-[#ff8c14]/15 to-transparent px-6 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
                Limited · entry price
              </p>
            </div>
            <div className="px-6 py-6">
              <h2 id="exit-offer-title" className="text-[22px] font-semibold tracking-tight text-white">
                Landing page that sells one offer
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#a1a1a6]">
                Fixed price <span className="font-semibold text-white">₦100,000</span> · deposit{" "}
                <span className="font-semibold text-white">₦50,000</span> via Paystack. Live in about a
                week after content.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[#e8eaed]">
                <li>✓ One high-converting page</li>
                <li>✓ WhatsApp click-to-chat</li>
                <li>✓ Mobile-first + basic SEO</li>
                <li>✓ 1 revision · 5 days support</li>
              </ul>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={hireHref}
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-5 py-3 text-[14px] font-semibold text-black"
                >
                  Pay deposit · lock slot
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-[14px] font-semibold text-white"
                >
                  Ask on WhatsApp first
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="pt-1 text-center text-[12px] text-[#86868b] hover:text-white"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
