"use client";

import { discoveryCallLink } from "@/lib/packages";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export default function Footer() {
  const year = new Date().getFullYear();

  // Mirrors the navbar menus, plus company/legal pages that don't need top-level space.
  const cols = [
    {
      title: "Websites",
      links: [
        ["/hire", "Packages & pricing"],
        ["/care-plans", "Website care plans"],
        ["/case-studies", "Our work"],
        ["/services", "Services"],
        ["/white-label", "White-label for agencies"],
        ["/free-audit", "Free website audit"],
      ],
    },
    {
      title: "Shop",
      links: [
        ["/products", "Business kits"],
        ["/ebooks", "Ebooks"],
        ["/reports", "Report Studio"],
        ["/components", "UI components"],
        ["/templates", "Page templates"],
      ],
    },
    {
      title: "Tools",
      links: [
        ["/pro", "DoyinTech Pro"],
        ["/tools", "All tools"],
        ["/ops", "DoyinOps"],
        ["/students", "Student tools"],
        ["/students/projects", "Student project support"],
        ["/account", "Your account"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/about", "About"],
        ["/contact", "Contact"],
        ["/blog", "Blog"],
        ["/refer", "Refer & earn"],
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-8">
          <NewsletterSignup />
        </div>
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
