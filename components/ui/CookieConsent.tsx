"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    document.documentElement.dataset.cookieOk = "1";
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    document.documentElement.dataset.cookieOk = "1";
    window.dispatchEvent(new Event("cookie-accepted"));
    setVisible(false);
  };

  useEffect(() => {
    document.documentElement.dataset.cookieBanner = visible ? "1" : "0";
  }, [visible]);

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
          <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/12 bg-[#1d1d1f]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:max-w-2xl">
            <p className="flex-1 text-[12px] leading-snug text-[#f5f5f7] sm:text-[13px]">
              Essential cookies only.{" "}
              <a href="/privacy" className="text-[#2997ff] hover:underline">
                Privacy
              </a>
            </p>
            <button
              type="button"
              onClick={accept}
              className="shrink-0 rounded-full bg-[#0071e3] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#0077ed]"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
