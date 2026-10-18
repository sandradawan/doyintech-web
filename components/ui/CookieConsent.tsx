"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Consent:
 * - essential → site works; no Meta Pixel / ads cookies
 * - all → analytics + advertising (Meta Pixel may load)
 * Legacy "true" is treated as all (prior Accept).
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("cookie-consent");
      if (v === "all" || v === "true" || v === "essential") {
        document.documentElement.dataset.cookieOk = v === "essential" ? "0" : "1";
        return;
      }
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.cookieBanner = visible ? "1" : "0";
  }, [visible]);

  function save(choice: "essential" | "all") {
    try {
      localStorage.setItem("cookie-consent", choice);
      document.documentElement.dataset.cookieOk = choice === "all" ? "1" : "0";
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("cookie-accepted", { detail: { choice } })
    );
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-[110] p-3 sm:p-4 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-xl rounded-2xl border border-white/12 bg-[#1d1d1f]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:max-w-2xl">
            <p className="text-[12px] leading-snug text-[#f5f5f7] sm:text-[13px]">
              We use essential cookies for the site to work. With your OK, we also use analytics and
              advertising cookies (including Meta Pixel) to measure campaigns and improve the site.{" "}
              <Link href="/privacy" className="text-[#2997ff] hover:underline">
                Privacy
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => save("essential")}
                className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-medium text-[#f5f5f7] hover:bg-white/10"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() => save("all")}
                className="rounded-full bg-[#0071e3] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#0077ed]"
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
