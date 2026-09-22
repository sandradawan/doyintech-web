import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DoyinShield — System Protector app (MVP)",
  description:
    "Honest device & WhatsApp protector coach for SMEs. Checklist scoring, scam red flags, emergency playbooks — not fake antivirus.",
};

const screens = [
  {
    name: "Score home",
    body: "Daily protector score from checklist toggles (lock, 2FA, backups, updates).",
  },
  {
    name: "WhatsApp safe",
    body: "Two-step status reminder, code-scam warnings, backup nudge.",
  },
  {
    name: "Scam radar",
    body: "Common Nigeria SME scams: fake support, new account Status, APK traps.",
  },
  {
    name: "Emergency",
    body: "Account taken over playbook — step-by-step offline-friendly cards.",
  },
  {
    name: "Staff mode",
    body: "One-pager rules for shop phones; owner vs helper permissions notes.",
  },
  {
    name: "Kit unlock",
    body: "Full playbooks via purchase (same content as System Protector Kit).",
  },
];

const phases = [
  {
    t: "Now — Kit + web quiz",
    d: "Sell SME System Protector Kit. Free score at /tools/system-protector.",
  },
  {
    t: "Phase 1 — Expo MVP",
    d: "Local checklist + score + emergency cards. No root/AV claims. Android first via Expo.",
  },
  {
    t: "Phase 2 — Reminders",
    d: "Weekly notification: backup WhatsApp, check updates. Optional paid tier.",
  },
];

export default function DoyinShieldPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[800px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Product · System Protector
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">DoyinShield</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
            A system protector for SMEs — habits, WhatsApp, and recovery — not a full antivirus
            engine. Keep Defender / Play Protect as the real scanners; we make people harder to
            scam and lock out.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools/system-protector"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              Free security score
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Buy Protector Kit
            </Link>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20want%20the%20DoyinShield%20%2F%20System%20Protector%20Kit."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#25D366]/40 px-5 py-2.5 text-[14px] font-semibold text-[#25D366]"
            >
              WhatsApp
            </a>
          </div>

          <h2 className="mt-12 text-[20px] font-semibold text-white">MVP screens (Expo)</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {screens.map((s) => (
              <div
                key={s.name}
                className="rounded-xl border border-white/10 bg-[#141a28] p-4"
              >
                <p className="text-[15px] font-semibold text-white">{s.name}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{s.body}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-[20px] font-semibold text-white">Build path</h2>
          <div className="mt-4 space-y-3">
            {phases.map((p) => (
              <div
                key={p.t}
                className="rounded-xl border border-white/10 bg-[#141a28] px-4 py-3"
              >
                <p className="text-[14px] font-semibold text-[#ff8c14]">{p.t}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{p.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-5 text-[13px] text-[#86868b]">
            <p className="font-semibold text-white">Pricing</p>
            <ul className="mt-2 space-y-1 text-[#c7cdd8]">
              <li>· Kit (now): ₦12,500 / $16 one-time</li>
              <li>· App reminders (later): ₦3,000–₦5,000/mo optional</li>
              <li>· Never marketed as “removes all viruses”</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
