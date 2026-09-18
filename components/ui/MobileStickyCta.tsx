"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileStickyCta() {
  const [show, setShow] = useState(false);
  const [pad, setPad] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 380);
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
          className="fixed inset-x-0 z-[95] border-t border-white/10 bg-[rgba(22,22,23,0.96)] p-3 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-lg gap-2">
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20a%20free%20website%20audit%20%2F%20discovery%20call."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-[#25D366] py-3 text-center text-[13px] font-semibold text-white"
            >
              WhatsApp
            </a>
            <a
              href="/hire"
              className="flex-[1.15] rounded-full bg-[#ff8c14] py-3 text-center text-[13px] font-semibold text-black"
            >
              Hire · 50% deposit
            </a>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-white/40">
            Fixed price · Live in days · Paystack accepted
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
