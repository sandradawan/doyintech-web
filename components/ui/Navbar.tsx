"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PRIMARY_CTA } from "@/lib/cta";
import { NAV_GROUPS, type NavGroup } from "@/lib/site-nav";

/**
 * Four mega menus built from lib/site-nav (shared with the footer). Company pages, blog and
 * legal live in the footer; the primary CTA sits on the right of the bar.
 */

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function groupActive(pathname: string, group: NavGroup) {
  return group.sections.some((s) => s.links.some((item) => linkActive(pathname, item.href)));
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on navigation (adjust state during render instead of in an effect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDesktop(null);
    setOpenMobileGroup(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpenDesktop(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDesktop(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Seller shops (/s/...) carry their own header; ours would look like someone else's shop.
  if (pathname?.startsWith("/s/") || pathname?.startsWith("/pay/")) return null;

  return (
    <header className="theme-dark fixed inset-x-0 top-0 z-[999]">
      <nav ref={navRef} className="glass-navbar h-12 w-full">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-tight text-brand-ink"
            aria-label="DoyinTech Home"
          >
            <span className="relative h-5 w-5 overflow-hidden">
              <Image src="/logo.png" alt="" fill className="object-contain" sizes="20px" />
            </span>
            <span className="hidden sm:inline">DoyinTech</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_GROUPS.map((group) => {
              const isOpen = openDesktop === group.label;
              const active = groupActive(pathname, group);
              return (
                <div
                  key={group.label}
                  className="flex h-12 items-center"
                  onMouseEnter={() => setOpenDesktop(group.label)}
                  onMouseLeave={() => setOpenDesktop((v) => (v === group.label ? null : v))}
                >
                  <button
                    type="button"
                    // Hover already opened it, so a mouse click keeps it open; keyboard (detail 0) toggles.
                    onClick={(e) =>
                      setOpenDesktop((v) => (v === group.label && e.detail === 0 ? null : group.label))
                    }
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                      active || isOpen ? "text-brand-ink" : "text-brand-ink/80 hover:text-brand-ink"
                    }`}
                  >
                    {group.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      className={`opacity-60 transition ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                        className="fixed inset-x-0 top-12 z-50 glass-menu"
                      >
                        <div className="mx-auto flex max-w-[1200px] gap-10 px-6 py-8">
                          <div className="w-56 shrink-0 border-r border-brand-ink/[0.08] pr-8">
                            <p className="t-eyebrow">{group.label}</p>
                            <p className="mt-3 text-[14px] leading-relaxed text-brand-ink/60">{group.intro}</p>
                            <a href={group.href} className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-brand-link hover:underline">
                              {group.cta} <span aria-hidden>→</span>
                            </a>
                          </div>
                          <div
                            className="grid flex-1 gap-8"
                            style={{ gridTemplateColumns: `repeat(${group.sections.length}, minmax(0, 1fr))` }}
                          >
                            {group.sections.map((section) => (
                              <div key={section.title}>
                                <p className="mb-3 px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-ink/40">
                                  {section.title}
                                </p>
                                <ul className="space-y-0.5">
                                  {section.links.map((item) => {
                                    const on = linkActive(pathname, item.href);
                                    return (
                                      <li key={item.href + item.name}>
                                        <a
                                          href={item.href}
                                          className={`block rounded-lg px-3 py-2 transition hover:bg-brand-ink/[0.06] ${on ? "bg-brand-ink/[0.06]" : ""}`}
                                        >
                                          <span className={`block text-[14px] font-medium ${on ? "text-brand-link" : "text-brand-ink"}`}>
                                            {item.name}
                                          </span>
                                          {item.desc && (
                                            <span className="mt-0.5 block text-[12px] leading-snug text-brand-ink/45">{item.desc}</span>
                                          )}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/account"
              className="hidden text-[13px] font-medium text-brand-ink/75 transition hover:text-brand-ink md:inline"
            >
              Sign in
            </Link>
            <Link
              href={PRIMARY_CTA.href}
              className="inline-flex rounded-full bg-brand-accent px-4 py-1.5 text-[13px] font-semibold text-black transition hover:brightness-110"
            >
              {PRIMARY_CTA.short}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-brand-ink lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-4 flex-col gap-1">
                <span
                  className={`h-px w-full bg-brand-ink transition ${
                    mobileMenuOpen ? "translate-y-[2.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-brand-ink transition ${
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
            className="max-h-[calc(100vh-3rem)] glass-menu overflow-y-auto px-4 py-4 lg:hidden"
          >
            <div className="mx-auto flex max-w-lg flex-col gap-1">
              {NAV_GROUPS.map((group) => {
                const expanded = openMobileGroup === group.label;
                return (
                  <div key={group.label} className="border-b border-brand-ink/[0.06]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileGroup((v) => (v === group.label ? null : group.label))
                      }
                      className="flex w-full items-center justify-between px-2 py-3 text-left text-[16px] font-semibold text-brand-ink"
                      aria-expanded={expanded}
                    >
                      {group.label}
                      <span className="text-brand-ink/40">{expanded ? "-" : "+"}</span>
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pb-4 pl-2">
                            {group.sections.map((section) => (
                              <div key={section.title}>
                                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/35">
                                  {section.title}
                                </p>
                                {section.links.map((item) => (
                                  <a
                                    key={item.href + item.name}
                                    href={item.href}
                                    className="block rounded-lg px-3 py-2.5 text-[15px] text-brand-ink/85 hover:bg-brand-ink/5 hover:text-brand-ink"
                                  >
                                    {item.name}
                                  </a>
                                ))}
                              </div>
                            ))}
                            <a href={group.href} className="block px-3 text-[14px] font-semibold text-brand-link">
                              {group.cta} →
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <Link
                href={PRIMARY_CTA.href}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-accent px-5 py-3 text-[15px] font-semibold text-black"
              >
                {PRIMARY_CTA.label}
              </Link>
              <Link
                href="/account"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-brand-ink/20 px-5 py-3 text-[15px] font-semibold text-brand-ink"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
