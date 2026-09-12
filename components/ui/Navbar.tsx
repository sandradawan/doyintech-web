"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "Services", href: "/services" },
  { name: "Tools", href: "/tools" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[999]">
      <nav className="glass-navbar h-12 w-full">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-[#f5f5f7]"
            aria-label="DoyinTech Home"
          >
            <span className="relative h-5 w-5 overflow-hidden">
              <Image src="/logo.png" alt="" fill className="object-contain" sizes="20px" />
            </span>
            <span className="hidden sm:inline">DoyinTech</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-xs transition ${
                    isActive
                      ? "text-white opacity-100"
                      : "text-[#f5f5f7] opacity-80 hover:opacity-100"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://doyintechacademy.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs text-[#f5f5f7] opacity-80 transition hover:opacity-100 lg:inline"
            >
              Academy
            </a>
            <a
              href="/contact"
              className="hidden rounded-full bg-[#0071e3] px-3.5 py-1.5 text-xs text-white transition hover:bg-[#0077ed] sm:inline-flex"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-[#f5f5f7] md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-4 flex-col gap-1">
                <span
                  className={`h-px w-full bg-[#f5f5f7] transition ${
                    mobileMenuOpen ? "translate-y-[2.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-[#f5f5f7] transition ${
                    mobileMenuOpen ? "-translate-y-[2.5px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="border-b border-white/10 bg-[#161617] px-6 py-6 md:hidden"
          >
            <div className="mx-auto flex max-w-lg flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="rounded-xl px-2 py-3 text-[17px] font-semibold text-[#f5f5f7]"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://doyintechacademy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-2 py-3 text-[17px] font-semibold text-[#f5f5f7]"
              >
                Academy
              </a>
              <a
                href="/contact"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0071e3] px-5 py-3 text-[15px] text-white"
              >
                Contact us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
