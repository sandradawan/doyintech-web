"use client";

import { discoveryCallLink } from "@/lib/packages";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Explore",
      links: [
        ["/services", "Services"],
        ["/pricing", "Pricing"],
        ["/tools", "Free Tools"],
        ["/portfolio", "Portfolio"],
        ["/blog", "Blog"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/about", "About"],
        ["/company-profile", "Company Profile"],
        ["/contact", "Contact"],
        ["https://doyintechacademy.vercel.app", "Academy"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["/privacy", "Privacy Policy"],
        ["/terms", "Terms of Use"],
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-black text-[12px] text-[#a1a1a6]">
      <div className="mx-auto max-w-[980px] px-6 py-10">
        <div className="rounded-[28px] bg-[#1d1d1f] px-8 py-12 text-center text-[#f5f5f7] sm:px-12">
          <h2 className="text-[32px] font-semibold tracking-tight sm:text-[40px]">
            Ready to start?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#a1a1a6]">
            Pick a package or book a free 15-minute discovery call on WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Book free call
            </a>
            <a href="/pricing" className="apple-btn apple-btn-secondary">
              View pricing ›
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-semibold text-[#f5f5f7]">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[#a1a1a6] hover:text-[#f5f5f7] hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p>
            WhatsApp{" "}
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="apple-link">
              +234 808 534 3926
            </a>
            {" "}·{" "}
            <a href="mailto:doyintechnology@outlook.com" className="apple-link">
              doyintechnology@outlook.com
            </a>
          </p>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-[12px] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#a1a1a6]">Copyright © {year} DoyinTech. All rights reserved.</p>
            <p className="flex flex-wrap gap-3 text-[#a1a1a6]">
              <a href="/privacy" className="hover:text-[#f5f5f7] hover:underline">
                Privacy Policy
              </a>
              <span className="text-white/20">|</span>
              <a href="/terms" className="hover:text-[#f5f5f7] hover:underline">
                Terms of Use
              </a>
              <span className="text-white/20">|</span>
              <span>Jos, Nigeria</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
