"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { trackMetaEvent } from "@/lib/meta/pixel";

export default function WhatsAppButton() {
  const [offset, setOffset] = useState(24);

  useEffect(() => {
    const sync = () => {
      // Sit above the cookie banner while it's showing.
      const cookie = document.documentElement.dataset.cookieBanner === "1";
      setOffset(cookie ? 88 : 24);
    };
    sync();
    window.addEventListener("cookie-accepted", sync);
    const id = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener("cookie-accepted", sync);
      window.clearInterval(id);
    };
  }, []);

  return (
    <a
      href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20discuss%20a%20project."
      onClick={() => trackMetaEvent("Contact", { content_name: "whatsapp_float" })}
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
