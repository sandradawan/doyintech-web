"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { discoveryCallLink } from "@/lib/packages";

type NavLink = { name: string; href: string; desc?: string };
type NavGroup = { label: string; items: NavLink[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Services",
    items: [
      { name: "All services", href: "/services", desc: "Web, backend, mobile, AI" },
      { name: "Hire / packages", href: "/hire", desc: "Fixed-price deposits" },
      { name: "Pricing quiz", href: "/pricing-quiz", desc: "Which package fits?" },
      { name: "Portfolio", href: "/portfolio", desc: "Live client work" },
      { name: "Case studies", href: "/case-studies", desc: "Results & process" },
      { name: "White-label", href: "/white-label", desc: "Resell our builds" },
    ],
  },
  {
    label: "Shop",
    items: [
      { name: "Products", href: "/products", desc: "Digital packs & bundles" },
      { name: "System Protector Kit", href: "/products", desc: "Phone & WhatsApp hardening" },
      { name: "Follow-up Agent Kit", href: "/products", desc: "Turn quotes into deposits" },
      { name: "Ebooks", href: "/ebooks", desc: "Practical guides" },
      { name: "Components", href: "/components", desc: "Next.js UI kits" },
      { name: "Templates", href: "/templates", desc: "Page templates" },
      { name: "App Store", href: "/store", desc: "Apps & digital goods" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Free tools hub", href: "/tools", desc: "Business & security utilities" },
      { name: "System Protector score", href: "/tools/system-protector", desc: "Phone & WhatsApp hygiene" },
      { name: "WhatsApp scripts", href: "/tools/whatsapp-scripts", desc: "5 free reply scripts" },
      { name: "DoyinOps", href: "/ops", desc: "SME ops workspace" },
      { name: "Free audit", href: "/free-audit", desc: "3-minute digital audit" },
      { name: "Status pack", href: "/status-pack", desc: "Weekly captions to post" },
      { name: "Daily prospecting", href: "/outreach/daily", desc: "20 messages / day tracker" },
      { name: "Ads creatives", href: "/outreach/ads", desc: "Headlines & follow-ups" },
      { name: "Apps & MVPs", href: "/apps", desc: "DoyinShield, Agent, plans" },
    ],
  },
  {
    label: "Company",
    items: [
      { name: "About", href: "/about", desc: "Team & mission" },
      { name: "Blog", href: "/blog", desc: "Updates & videos" },
      { name: "Refer & earn", href: "/refer", desc: "₦10k credit per deposit" },
      { name: "Company profile", href: "/company-profile", desc: "Legal & registration" },
      { name: "Contact", href: "/contact", desc: "Email or book a call" },
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

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDesktop(null);
    setOpenMobileGroup(null);
  }, [pathname]);

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
          <a
            href="/"
            className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-tight text-[#f5f5f7]"
            aria-label="DoyinTech Home"
          >
            <span className="relative h-5 w-5 overflow-hidden">
              <Image src="/logo.png" alt="" fill className="object-contain" sizes="20px" />
            </span>
            <span className="hidden sm:inline">DoyinTech</span>
          </a>

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
                      active || isOpen
                        ? "text-white"
                        : "text-[#f5f5f7]/80 hover:text-white"
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
            <a
              href="/ops/app"
              className="hidden rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-[#ff8c14] md:inline-flex"
            >
              Ops
            </a>
            <a
              href="/hire"
              className="hidden rounded-full bg-[#ff8c14] px-3.5 py-1.5 text-xs font-semibold text-black transition hover:brightness-110 sm:inline-flex"
            >
              Hire
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-[#0071e3] px-3.5 py-1.5 text-xs text-white transition hover:bg-[#0077ed] lg:inline-flex"
            >
              Book a call
            </a>
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
                      <span className="text-white/40">{expanded ? "−" : "+"}</span>
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

              <a
                href="/ops/app"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-[15px] font-semibold text-white"
              >
                Open DoyinOps workspace
              </a>
              <a
                href="/hire"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-5 py-3 text-[15px] font-semibold text-black"
              >
                Hire — fixed price deposit
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white"
              >
                Book free call on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
