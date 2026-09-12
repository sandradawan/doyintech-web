"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppButton() {
  const [offset, setOffset] = useState(24);

  useEffect(() => {
    const sync = () => {
      const cookie = document.documentElement.dataset.cookieBanner === "1";
      const sticky =
        window.innerWidth < 768 && window.scrollY > 420;
      // Cookie bar ~56px, mobile sticky ~64px
      let bottom = 24;
      if (cookie) bottom += 64;
      if (sticky) bottom += 62;
      setOffset(bottom);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("cookie-accepted", sync);
    const id = window.setInterval(sync, 400);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("cookie-accepted", sync);
      window.clearInterval(id);
    };
  }, []);

  return (
    <a
      href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20discuss%20a%20project."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{ bottom: offset }}
      className="fixed right-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 sm:right-6 sm:h-14 sm:w-14"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}
