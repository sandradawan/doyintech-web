"use client";

import React from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import ScrollReveal from "../animations/ScrollReveal";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#080A0F]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

      {/* CTA band */}
      <div className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/15 via-white/[0.04] to-transparent p-8 md:flex-row md:items-center md:p-10">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Ready when you are
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Let’s build something that scales
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Websites, apps, APIs, automation, and security — engineered in Nigeria,
                  delivered worldwide.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
                >
                  Start a project
                </a>
                <a
                  href="/tools"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/5"
                >
                  Explore free tools
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ScrollReveal direction="up" delay={0.05}>
              <a href="/" className="font-display text-2xl font-bold tracking-tight text-white">
                Doyin<span className="text-primary">Tech</span>
              </a>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
                Premium backend systems, secure APIs, and high-performance web & mobile
                applications designed to scale with your business.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <SocialIcon
                  href="https://wa.me/2348085343926"
                  label="WhatsApp"
                  colorClass="text-[#25D366]"
                  glow="rgba(37, 211, 102, 0.45)"
                >
                  <FaWhatsapp size={18} />
                </SocialIcon>
                <SocialIcon
                  href="https://www.youtube.com/@doyintechfoundation"
                  label="YouTube"
                  colorClass="text-[#FF0000]"
                  glow="rgba(255, 0, 0, 0.4)"
                >
                  <FaYoutube size={18} />
                </SocialIcon>
                <SocialIcon
                  href="https://facebook.com/doyintechnology"
                  label="Facebook"
                  colorClass="text-[#1877F2]"
                  glow="rgba(24, 119, 242, 0.45)"
                >
                  <FaFacebook size={18} />
                </SocialIcon>
                <SocialIcon
                  href="https://x.com/@doyintechnology"
                  label="Twitter / X"
                  colorClass="text-white"
                  glow="rgba(255, 255, 255, 0.25)"
                >
                  <FaXTwitter size={18} />
                </SocialIcon>
                <SocialIcon
                  href="https://instagram.com/doyintechofficial"
                  label="Instagram"
                  colorClass="text-[#E1306C]"
                  glow="rgba(225, 48, 108, 0.45)"
                >
                  <FaInstagram size={18} />
                </SocialIcon>
                <SocialIcon
                  href="https://www.tiktok.com/@doyintechfoundation"
                  label="TikTok"
                  colorClass="text-white"
                  glow="rgba(255, 255, 255, 0.25)"
                >
                  <FaTiktok size={18} />
                </SocialIcon>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-3">
            <ScrollReveal direction="up" delay={0.1}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Quick links
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
                {[
                  ["/services", "Services"],
                  ["/tools", "Free Tools"],
                  ["/portfolio", "Portfolio"],
                  ["/blog", "Blog"],
                  ["https://doyintechacademy.vercel.app", "Academy", true],
                  ["/company-profile", "Company Profile"],
                  ["/about", "About"],
                  ["/contact", "Contact"],
                  ["/privacy", "Privacy"],
                  ["/terms", "Terms"],
                ].map((item) => {
                  const [href, label, external] = item as [string, string, boolean?];
                  return (
                    <a
                      key={href}
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="w-fit transition hover:text-primary"
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-4">
            <ScrollReveal direction="up" delay={0.15}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Contact
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
                <a className="hover:text-primary" href="mailto:doyintechnology@outlook.com">
                  doyintechnology@outlook.com
                </a>
                <a className="hover:text-primary" href="tel:+2348085343926">
                  +234 808 534 3926
                </a>
                <p className="text-gray-500">Jos, Nigeria · Available remote</p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-8 text-xs text-gray-500 sm:flex-row sm:items-center">
          <p>© {year} DoyinTech. All rights reserved.</p>
          <p className="text-gray-600">Engineered for performance · Built for growth</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
  colorClass,
  glow,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  colorClass: string;
  glow: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
    >
      <span
        className={["transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110", colorClass].join(
          " ",
        )}
      >
        {children}
      </span>
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 18px 2px ${glow}` }}
      />
    </a>
  );
}
