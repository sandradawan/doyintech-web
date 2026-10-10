"use client";

import { discoveryCallLink } from "@/lib/packages";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Students",
      links: [
        ["/students", "All student tools"],
        ["/students/studio", "AI Project Studio"],
        ["/students/analyzer", "Questionnaire analyzer"],
        ["/students/citations", "Citation formatter"],
        ["/students/cover-letter", "Cover letter AI"],
        ["/students/projects", "Research project portal"],
        ["/students/projects/track", "Track a project"],
        ["/tools/cv-builder", "CV builder"],
      ],
    },
    {
      title: "Shop",
      links: [
        ["/products", "Digital products"],
        ["/ebooks", "Ebooks"],
        ["/components", "UI components"],
        ["/templates", "Page templates"],
        ["/store", "App store"],
      ],
    },
    {
      title: "Tools & apps",
      links: [
        ["/solve", "SME Solve hub"],
        ["/bills", "Airtime, data & RRR"],
        ["/tools", "All free tools"],
        ["/tools/system-protector", "System Protector"],
        ["/apps", "Apps & MVPs"],
        ["/ops", "DoyinOps"],
        ["/free-audit", "Free website audit"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/hire", "Hire — fixed price"],
        ["/services", "Services"],
        ["/about", "About"],
        ["/contact", "Contact"],
        ["/blog", "Blog"],
        ["/privacy", "Privacy"],
        ["/terms", "Terms"],
      ],
    },
  ];

  const socials = [
    {
      label: "YouTube",
      href: "https://www.youtube.com/@doyintechfoundation",
    },
    { label: "X", href: "https://x.com/doyintechnology" },
    { label: "Instagram", href: "https://instagram.com/doyintechofficial" },
    { label: "TikTok", href: "https://www.tiktok.com/@doyintechfoundation" },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-black text-[13px] text-[#a1a1a6]">
      <div className="mx-auto max-w-[1020px] px-5 py-12 sm:px-6 sm:py-14">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[rgba(29,29,31,0.65)] px-6 py-12 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-12 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(41,151,255,0.45), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="section-eyebrow mb-3">Next step</p>
            <h2 className="font-display text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[36px] md:text-[40px]">
              Sell this month. Build systems next.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[#a1a1a6] sm:text-[17px]">
              Run DoyinOps free, book a fixed-price website, open student research tools, or buy a pack and use it today.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/students"
                className="inline-flex items-center justify-center rounded-full border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-6 py-3 text-[14px] font-semibold text-[#ff8c14] transition hover:bg-[#ff8c14]/20"
              >
                Student tools
              </a>
              <a
                href="/ops/app"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-[14px] font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.08]"
              >
                Open DoyinOps
              </a>
              <a
                href="/hire"
                className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-[#ffa03a] hover:shadow-[0_8px_28px_rgba(255,140,20,0.35)]"
              >
                Hire — fixed price
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#2ee06e] hover:shadow-[0_8px_28px_rgba(37,211,102,0.3)]"
              >
                Book free call
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f5f5f7]">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(([href, label]) => (
                  <li key={href + label}>
                    <a href={href} className="footer-link text-[13px]">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 divider-soft" />
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-[13px] leading-relaxed">
              WhatsApp{" "}
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-link"
              >
                +234 808 534 3926
              </a>
            </p>
            <p className="text-[13px]">
              <a href="mailto:hello@doyintech.com" className="apple-link">
                hello@doyintech.com
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link text-[13px]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.08] pt-6 text-[12px] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {year} DoyinTech. All rights reserved.</p>
          <p>Jos, Nigeria · www.doyintech.com</p>
        </div>
      </div>
    </footer>
  );
}
