"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileStickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-[900] border-t border-white/10 bg-[rgba(22,22,23,0.92)] p-3 backdrop-blur-xl md:hidden"
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
