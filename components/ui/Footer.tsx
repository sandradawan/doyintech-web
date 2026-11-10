"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";
import { PRIMARY_CTA } from "@/lib/cta";
import { COMPANY_SECTION, LEGAL_LINKS, NAV_GROUPS, type NavSection } from "@/lib/site-nav";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

type Column = { label: string; sections: NavSection[] };

// Same structure as the navbar menus, plus company pages; each column is a dropdown on phones.
const COLUMNS: Column[] = [
  ...NAV_GROUPS.map((g) => ({ label: g.label, sections: g.sections })),
  { label: COMPANY_SECTION.title, sections: [{ ...COMPANY_SECTION, title: "" }] },
];

const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@doyintechfoundation" },
  { label: "X", href: "https://x.com/doyintechnology" },
  { label: "Instagram", href: "https://instagram.com/doyintechofficial" },
  { label: "TikTok", href: "https://www.tiktok.com/@doyintechfoundation" },
];

function FooterColumn({ col }: { col: Column }) {
  const [open, setOpen] = useState(false);
  const id = `footer-${col.label.toLowerCase()}`;
  return (
    <div className="border-b border-brand-ink/[0.08] lg:border-0">
      <h2 className="lg:mb-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-12 w-full items-center justify-between text-left text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-ink lg:pointer-events-none lg:min-h-0"
        >
          {col.label}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`text-brand-ink/50 transition lg:hidden ${open ? "rotate-180" : ""}`}>
            <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div id={id} className={`${open ? "block" : "hidden"} space-y-6 pb-6 lg:block lg:pb-0`}>
        {col.sections.map((s) => (
          <div key={s.title || col.label}>
            {s.title && <p className="mb-2.5 text-[12px] font-medium text-brand-ink/40">{s.title}</p>}
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.href + l.name}>
                  <a href={l.href} className="footer-link py-1.5 text-[15px] leading-snug lg:py-0 lg:text-[14px]">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-dark panel-glow border-t border-white/[0.08] bg-black text-[14px] text-brand-muted">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* Brand, contact and newsletter */}
        <div className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 text-[20px] font-semibold tracking-tight text-brand-ink">
              <span className="relative h-7 w-7 overflow-hidden">
                <Image src="/logo.png" alt="" fill className="object-contain" sizes="28px" />
              </span>
              DoyinTech
            </Link>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed">
              Fixed-price websites, online shops and free business tools for small businesses in Nigeria and around the world.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={PRIMARY_CTA.href} className="apple-btn bg-brand-accent text-black hover:brightness-110">
                {PRIMARY_CTA.label}
              </Link>
              <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="apple-btn apple-btn-secondary">
                Chat on WhatsApp
              </a>
            </div>
            <dl className="mt-6 grid gap-1.5 text-[14px] sm:grid-cols-2">
              <div>
                <dt className="sr-only">WhatsApp</dt>
                <dd>
                  <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="footer-link">+234 808 534 3926</a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a href="mailto:hello@doyintech.com" className="footer-link">hello@doyintech.com</a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:pt-1">
            <NewsletterSignup />
          </div>
        </div>

        {/* Link sections */}
        <nav aria-label="Footer" className="grid border-t border-brand-ink/[0.08] pt-2 lg:grid-cols-6 lg:gap-6 lg:py-12">
          {COLUMNS.map((col) => (
            <FooterColumn key={col.label} col={col} />
          ))}
        </nav>

        {/* Legal bar */}
        <div className="flex flex-col gap-4 border-t border-brand-ink/[0.08] py-6 text-[13px] md:flex-row md:items-center md:justify-between">
          <p>© {year} DoyinTech · Jos, Nigeria</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer-link">{l.name}</a>
              </li>
            ))}
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="footer-link">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
