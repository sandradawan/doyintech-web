"use client";

import Link from "next/link";

const SECTIONS = [
  {
    group: "Sales & hire",
    items: [
      { href: "/hire", title: "Hire / packages" },
      { href: "/pricing", title: "Pricing" },
      { href: "/pricing-quiz", title: "Pricing quiz" },
      { href: "/services", title: "Services" },
      { href: "/contact", title: "Contact" },
      { href: "/support", title: "Support" },
    ],
  },
  {
    group: "Shop",
    items: [
      { href: "/products", title: "Digital products" },
      { href: "/ebooks", title: "Ebooks" },
      { href: "/components", title: "UI components" },
      { href: "/templates", title: "Templates" },
      { href: "/store", title: "App store" },
      { href: "/reports", title: "Report Studio" },
    ],
  },
  {
    group: "Proof & company",
    items: [
      { href: "/portfolio", title: "Portfolio" },
      { href: "/case-studies", title: "Case studies" },
      { href: "/blog", title: "Blog" },
      { href: "/about", title: "About" },
      { href: "/company-profile", title: "Company profile" },
      { href: "/refer", title: "Refer & earn" },
      { href: "/white-label", title: "White-label" },
    ],
  },
  {
    group: "Students",
    items: [
      { href: "/students", title: "Student projects public" },
      { href: "/admin/student-projects", title: "Admin student pipeline" },
    ],
  },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Site</p>
        <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Content & pages</h1>
        <p className="mt-1 text-[13px] text-[#86868b]">Quick access to every public surface.</p>
      </div>
      {SECTIONS.map((s) => (
        <section key={s.group}>
          <h2 className="text-[14px] font-semibold text-white">{s.group}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {s.items.map((i) => (
              <Link key={i.href} href={i.href} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] text-[#e8e8ed] transition hover:border-white/25">
                {i.title}
                <span className="mt-1 block text-[11px] text-[#86868b]">{i.href}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
