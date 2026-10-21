"use client";

import Link from "next/link";

const TOOLS = [
  { href: "/reports", title: "AI Report Studio", desc: "Multi-platform audits & PDF delivery" },
  { href: "/tools", title: "Free tools hub", desc: "Business & security utilities" },
  { href: "/tools/system-protector", title: "System Protector", desc: "Phone & WhatsApp hygiene score" },
  { href: "/tools/whatsapp-scripts", title: "WhatsApp scripts", desc: "Reply templates" },
  { href: "/free-audit", title: "Free audit", desc: "3-minute digital audit lead magnet" },
  { href: "/status-pack", title: "Status pack", desc: "Weekly captions" },
  { href: "/outreach", title: "Outreach console", desc: "Prospecting & ads creatives" },
  { href: "/outreach/daily", title: "Daily prospecting", desc: "20 messages / day tracker" },
];

export default function AdminToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Products</p>
        <h1 className="mt-1 font-display text-[24px] font-semibold text-white">AI & tools</h1>
        <p className="mt-1 text-[13px] text-[#86868b]">Jump to live product surfaces. Lead capture still flows into Leads.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} target="_blank" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff8c14]/40">
            <p className="text-[14px] font-semibold text-white">{t.title}</p>
            <p className="mt-1.5 text-[12px] text-[#a1a1a6]">{t.desc}</p>
            <p className="mt-3 text-[11px] text-[#ff8c14]">{t.href} →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
