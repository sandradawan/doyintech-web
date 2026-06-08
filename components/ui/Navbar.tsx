"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaXmark } from "react-icons/fa6";

const navItems = [
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[999] transition-all duration-300 px-6 py-4">
      <nav
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          scrolled
            ? "glass-navbar rounded-full px-6 py-2 border border-white/10 shadow-xl max-w-5xl translate-y-2"
            : "bg-transparent px-2 py-3 border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white hover:opacity-90 transition"
          >
            <div className="relative h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="DoyinTech Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span>
              Doyin<span className="text-primary">Tech</span>
            </span>
          </a>

          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavbarIndicator"
                      className="absolute inset-0 rounded-xl bg-white/5 border border-white/5"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right: CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 animate-pulseGlow">
              ⚡ Fast & Secure
            </span>

            <a
              href="/contact"
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white transition duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20"
            >
              Let’s Talk
            </a>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute left-6 right-6 top-24 z-50 rounded-3xl border border-white/10 bg-[#0B0E14]/95 backdrop-blur-xl p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block w-full rounded-xl p-3 text-sm font-semibold uppercase tracking-wider transition ${
                      isActive ? "bg-primary/10 text-primary" : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                <a
                  href="/contact"
                  className="w-full text-center text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl bg-primary text-white transition"
                >
                  Let’s Talk
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
