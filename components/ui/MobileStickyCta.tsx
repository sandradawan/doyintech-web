"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileStickyCta() {
  const [show, setShow] = useState(false);
  const [pad, setPad] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 420);
      setPad(document.documentElement.dataset.cookieBanner === "1" ? 56 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("cookie-accepted", onScroll);
    const id = window.setInterval(onScroll, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cookie-accepted", onScroll);
      window.clearInterval(id);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ bottom: pad }}
          className="fixed inset-x-0 z-[95] border-t border-white/10 bg-[rgba(22,22,23,0.94)] p-3 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-lg gap-2">
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-white/15 py-3 text-center text-[13px] font-medium text-[#f5f5f7]"
            >
              WhatsApp
            </a>
            <a
              href="/contact"
              className="flex-[1.2] rounded-full bg-[#0071e3] py-3 text-center text-[13px] font-medium text-white"
            >
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
