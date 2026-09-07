"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaXmark } from "react-icons/fa6";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className="fixed inset-x-0 top-0 z-[999] px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.nav
        initial={false}
        animate={{
          maxWidth: scrolled ? 920 : 1280,
          borderRadius: scrolled ? 999 : 20,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`mx-auto border transition-colors duration-500 ${
          scrolled || mobileMenuOpen
            ? "glass-navbar border-white/10 shadow-2xl shadow-black/40"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
          <a
            href="/"
            className="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white sm:text-xl"
          >
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 transition group-hover:border-primary/40">
              <Image
                src="/logo.png"
                alt="DoyinTech Logo"
                fill
                className="object-contain p-0.5"
                sizes="32px"
              />
            </span>
            <span>
              Doyin<span className="text-primary">Tech</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition duration-300 ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://doyintechacademy.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/12 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/25 hover:text-white xl:inline-flex"
            >
              Academy
            </a>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20book%20a%20discovery%20call."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/12 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/25 hover:text-white lg:inline-flex"
            >
              Book a Call
            </a>
            <a
              href="/contact"
              className="hidden rounded-full bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 hover:shadow-primary/40 sm:inline-flex"
            >
              Let’s Talk
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition hover:border-white/20 hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 mx-auto mt-3 max-w-lg rounded-3xl border border-white/10 bg-[#0B0E14]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map((item, i) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className={`rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-wider transition ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </motion.a>
                  );
                })}
                <a
                  href="https://doyintechacademy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-white/5"
                >
                  Academy
                </a>
                <div className="mt-3 grid gap-2 border-t border-white/10 pt-4">
                  <a
                    href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20book%20a%20discovery%20call."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/15 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Book a Call
                  </a>
                  <a
                    href="/contact"
                    className="rounded-2xl bg-primary py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Let’s Talk
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
