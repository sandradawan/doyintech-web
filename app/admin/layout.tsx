import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "CRM — DoyinTech",
};

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/students", label: "Student projects" },
  { href: "/admin/orders", label: "Orders & sales" },
  { href: "/admin/analytics", label: "Social analytics" },
  { href: "/store/admin", label: "Store admin" },
  { href: "/ops/app", label: "DoyinOps workspace" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f5f5f7]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 border-r border-white/10 bg-[#111113] lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-4 py-6">
            <Link href="/admin" className="px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
                DoyinTech
              </p>
              <p className="mt-0.5 font-display text-[18px] font-semibold text-white">
                CRM
              </p>
            </Link>
            <nav className="mt-8 flex flex-1 flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#a1a1a6] transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-2 border-t border-white/10 pt-4 px-2">
              <Link
                href="/"
                className="block text-[12px] text-[#86868b] hover:text-white"
              >
                ← Public site
              </Link>
              <p className="text-[11px] text-[#555]">
                Auth: ADMIN_LEADS_SECRET
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0b]/90 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3 overflow-x-auto px-4 py-3">
              <span className="shrink-0 text-[12px] font-semibold text-[#ff8c14]">
                CRM
              </span>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[12px] text-[#a1a1a6] hover:border-white/25 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
