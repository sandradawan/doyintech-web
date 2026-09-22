import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apps & MVPs | DoyinTech",
  description:
    "DoyinShield, WhatsApp Agent, 30-day plan, and other product MVPs — linked from one place.",
};

const apps = [
  {
    href: "/apps/doyinshield",
    title: "DoyinShield",
    desc: "System protector coach — score, WhatsApp safety, emergency playbooks (not fake AV).",
    badge: "Protector",
  },
  {
    href: "/tools/system-protector",
    title: "System Protector score",
    desc: "Free phone & WhatsApp hygiene quiz. Buy the full kit on Products.",
    badge: "Free tool",
  },
  {
    href: "/apps/whatsapp-agent",
    title: "WhatsApp Ops Agent",
    desc: "MVP design: reply assist, pipeline, follow-ups. Kit on sale now.",
    badge: "Agent",
  },
  {
    href: "/apps/build-plan-30d",
    title: "30-day build & sell plan",
    desc: "Week-by-week targets and pricing in NGN and USD.",
    badge: "Plan",
  },
  {
    href: "/apps/whatsapp-studio",
    title: "WhatsApp Studio",
    desc: "Scripts and status helpers for daily selling.",
    badge: "Studio",
  },
  {
    href: "/apps/client-tracker",
    title: "Client tracker",
    desc: "Lightweight pipeline for freelancers and SMEs.",
    badge: "Ops",
  },
  {
    href: "/apps/expense-log",
    title: "Expense log",
    desc: "Simple cash out tracking for small teams.",
    badge: "Ops",
  },
  {
    href: "/apps/invoice-helper",
    title: "Invoice helper",
    desc: "Quick invoice notes and payment nudges.",
    badge: "Ops",
  },
  {
    href: "/ops",
    title: "DoyinOps",
    desc: "Full SME ops workspace on the web.",
    badge: "Live",
  },
  {
    href: "/products",
    title: "Digital products store",
    desc: "Protector Kit, Follow-up Kit, Ember packs, Sheets bundles.",
    badge: "Shop",
  },
];

export default function AppsIndexPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Apps & tools
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">Everything new in one place</h1>
          <p className="mt-3 max-w-xl text-[16px] text-[#a1a1a6]">
            Product MVPs, free tools, and store kits — also linked from the navbar (Tools) and
            footer.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {apps.map((a) => (
              <Link
                key={a.href + a.title}
                href={a.href}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5 transition hover:border-[#ff8c14]/40"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                  {a.badge}
                </span>
                <p className="mt-1 text-[17px] font-semibold text-white">{a.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#a1a1a6]">{a.desc}</p>
                <p className="mt-3 text-[12px] text-[#86868b]">{a.href} →</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Tools hub
            </Link>
            <Link
              href="/products"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              Buy kits
            </Link>
            <Link
              href="/outreach/daily"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              20 DMs today
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
