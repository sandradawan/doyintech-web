"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PRIMARY_CTA } from "@/lib/cta";

type NavLink = { name: string; href: string; desc?: string };
type NavGroup = { label: string; items: NavLink[] };

/**
 * Four menus, each link leading somewhere you can buy or start. Company pages, blog and
 * internal tools live in the footer; the primary CTA sits on the right of the bar.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Websites",
    items: [
      { name: "Packages & pricing", href: "/hire", desc: "Fixed price · 50% deposit" },
      { name: "By industry", href: "/websites", desc: "Schools, clinics, churches, hotels…" },
      { name: "What a website costs", href: "/website-cost-nigeria", desc: "2026 price guide + calculator" },
      { name: "Website care plans", href: "/care-plans", desc: "Monthly security & updates" },
      { name: "Our work", href: "/case-studies", desc: "Case studies & results" },
      { name: "Free website audit", href: "/free-audit", desc: "2–3 fixes in your inbox" },
    ],
  },
  {
    label: "Shop",
    items: [
      { name: "Free online shop", href: "/stores", desc: "Sell on WhatsApp with one link" },
      { name: "Business kits", href: "/products", desc: "Scripts, trackers & playbooks" },
      { name: "Ebooks", href: "/ebooks", desc: "Practical guides" },
      { name: "Report Studio", href: "/reports", desc: "Social & brand presence reports" },
      { name: "Code: components & templates", href: "/components", desc: "Next.js UI kits" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "DoyinTech Pro", href: "/pro", desc: "Every premium tool, one membership" },
      { name: "Invoice & receipt generator", href: "/tools/invoice-generator-nigeria", desc: "Free naira invoices as PDF" },
      { name: "PAYE calculator 2026", href: "/tools/paye-calculator-nigeria", desc: "New tax bands & take-home pay" },
      { name: "Small company tax checker", href: "/tools/small-company-tax-checker", desc: "Do you pay 0% company tax?" },
      { name: "Freelancer tax calculator", href: "/tools/freelancer-tax-calculator-nigeria", desc: "File by 31 March 2027" },
      { name: "E-invoicing deadlines", href: "/e-invoicing-nigeria", desc: "Small businesses: July 2027" },
      { name: "All tools", href: "/tools", desc: "Free business & website tools" },
      { name: "DoyinOps", href: "/ops", desc: "Clients, deals & invoices" },
    ],
  },
  {
    label: "Students",
    items: [
      { name: "Student tools", href: "/students", desc: "Outlines, citations, analysis" },
      { name: "Project support", href: "/students/projects", desc: "Guided research support" },
    ],
  },
];

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function groupActive(pathname: string, group: NavGroup) {
  return group.items.some((item) => linkActive(pathname, item.href));
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

  return (
    <header className="fixed inset-x-0 top-0 z-[999]">
      <nav ref={navRef} className="glass-navbar h-12 w-full">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-tight text-[#f5f5f7]"
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
                  className="relative"
                  onMouseEnter={() => setOpenDesktop(group.label)}
                  onMouseLeave={() => setOpenDesktop((v) => (v === group.label ? null : v))}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDesktop((v) => (v === group.label ? null : group.label))
                    }
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                      active || isOpen ? "text-white" : "text-[#f5f5f7]/80 hover:text-white"
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
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2"
                      >
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121214]/95 p-2 shadow-2xl backdrop-blur-xl">
                          {group.items.map((item) => {
                            const on = linkActive(pathname, item.href);
                            return (
                              <a
                                key={item.href + item.name}
                                href={item.href}
                                className={`block rounded-xl px-3 py-2.5 transition hover:bg-white/5 ${
                                  on ? "bg-white/[0.06]" : ""
                                }`}
                              >
                                <span
                                  className={`block text-[13px] font-medium ${
                                    on ? "text-[#ff8c14]" : "text-white"
                                  }`}
                                >
                                  {item.name}
                                </span>
                                {item.desc && (
                                  <span className="mt-0.5 block text-[11px] text-white/40">
                                    {item.desc}
                                  </span>
                                )}
                              </a>
                            );
                          })}
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
              className="hidden text-xs font-medium text-[#f5f5f7]/70 transition hover:text-white md:inline"
            >
              Sign in
            </Link>
            <Link
              href={PRIMARY_CTA.href}
              className="inline-flex rounded-full bg-[#ff8c14] px-3.5 py-1.5 text-xs font-semibold text-black transition hover:brightness-110"
            >
              {PRIMARY_CTA.short}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-[#f5f5f7] lg:hidden"
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
            className="max-h-[calc(100vh-3rem)] overflow-y-auto border-b border-white/10 bg-[#161617] px-4 py-4 lg:hidden"
          >
            <div className="mx-auto flex max-w-lg flex-col gap-1">
              {NAV_GROUPS.map((group) => {
                const expanded = openMobileGroup === group.label;
                return (
                  <div key={group.label} className="border-b border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileGroup((v) => (v === group.label ? null : group.label))
                      }
                      className="flex w-full items-center justify-between px-2 py-3 text-left text-[16px] font-semibold text-[#f5f5f7]"
                      aria-expanded={expanded}
                    >
                      {group.label}
                      <span className="text-white/40">{expanded ? "-" : "+"}</span>
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-0.5 pb-3 pl-2">
                            {group.items.map((item) => (
                              <a
                                key={item.href + item.name}
                                href={item.href}
                                className="block rounded-lg px-3 py-2.5 text-[15px] text-white/80 hover:bg-white/5 hover:text-white"
                              >
                                {item.name}
                                {item.desc && (
                                  <span className="mt-0.5 block text-[12px] font-normal text-white/35">
                                    {item.desc}
                                  </span>
                                )}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <Link
                href={PRIMARY_CTA.href}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-5 py-3 text-[15px] font-semibold text-black"
              >
                {PRIMARY_CTA.label}
              </Link>
              <Link
                href="/account"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-[15px] font-semibold text-white"
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
