"use client";

import React from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import ScrollReveal from "../animations/ScrollReveal";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0B0E14] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <ScrollReveal direction="up" delay={0.05}>
              <div>
                <a href="/" className="font-display text-2xl font-bold tracking-tight text-white">
                  Doyin<span className="text-primary">Tech</span>
                </a>
                <p className="mt-4 text-sm text-gray-400 max-w-md leading-relaxed">
                  We engineer premium, scalable backend systems, secure APIs, and high-performance mobile/web applications designed to scale with your business.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <SocialIcon
                    href="https://wa.me/2348085343926"
                    label="WhatsApp"
                    colorClass="text-[#25D366]"
                    glow="rgba(37, 211, 102, 0.45)"
                  >
                    <FaWhatsapp size={18} />
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
              </div>

              <p className="mt-12 text-xs text-gray-500">
                © {year} DoyinTech. All rights reserved.
              </p>
            </ScrollReveal>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <ScrollReveal direction="up" delay={0.1}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <div className="mt-6 flex flex-col gap-3.5 text-sm text-gray-400">
                <a className="hover:text-primary transition duration-200" href="/services">
                  Services
                </a>
                <a className="hover:text-primary transition duration-200" href="/portfolio">
                  Portfolio
                </a>
                <a className="hover:text-primary transition duration-200" href="/about">
                  About
                </a>
                <a className="hover:text-primary transition duration-200" href="/contact">
                  Contact
                </a>
                <a className="hover:text-primary transition duration-200" href="/privacy">
                  Privacy Policy
                </a>
                <a className="hover:text-primary transition duration-200" href="/terms">
                  Terms of Service
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact & CTA */}
          <div className="md:col-span-4">
            <ScrollReveal direction="up" delay={0.15}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Contact details
              </h3>
              <div className="mt-6 flex flex-col gap-3 text-sm text-gray-400">
                <a
                  className="hover:text-primary transition duration-200"
                  href="mailto:doyintechnology@outlook.com"
                >
                  doyintechnology@outlook.com
                </a>
                <a
                  className="hover:text-primary transition duration-200"
                  href="tel:+2348085343926"
                >
                  +234 808 534 3926
                </a>
                <p className="text-gray-500 mt-1">Jos, Nigeria • Available Remote</p>
              </div>

              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-primary/95 transition duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/25"
                >
                  Start a Project
                </a>
              </div>
            </ScrollReveal>
          </div>
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
      className="group relative h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
    >
      <span
        className={[
          "transition-all duration-300 ease-out",
          "group-hover:-translate-y-0.5 group-hover:scale-110",
          colorClass,
        ].join(" ")}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 16px 2px ${glow}`,
        }}
      />
    </a>
  );
}
