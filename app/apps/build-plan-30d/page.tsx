import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "30-day build & sell plan | DoyinTech",
  description: "WhatsApp Follow-up Kit + DoyinAgent: daily actions, prices in ₦ and $.",
};

const weeks = [
  {
    week: "Week 1 — Sell what exists",
    focus: "Revenue before more code",
    days: [
      "Day 1–2: Publish Kit on store; Status + 20 DMs/day (/outreach/daily)",
      "Day 3–4: Follow up interested leads with Day-0/2 scripts; push /hire deposits",
      "Day 5–7: Collect 3 testimonials or usage notes; post Status from /outreach/ads",
    ],
    target: "5 Kit sales · ₦75,000 or ~$95",
  },
  {
    week: "Week 2 — Proof + waitlist",
    focus: "Social proof and agent list",
    days: [
      "Day 8–10: Case snippet: Used Day-2 script → deposit",
      "Day 11–12: Open DoyinAgent waitlist CTA on product + WhatsApp",
      "Day 13–14: Double outreach on salons/clinics/coaches; offer free audit path",
    ],
    target: "10 total Kit sales · 25 waitlist",
  },
  {
    week: "Week 3 — MVP agent v0",
    focus: "Ship internal web MVP",
    days: [
      "Day 15–17: Pipeline board + today list (localStorage)",
      "Day 18–19: Paste-chat → 3 reply suggestions (API or prompt template)",
      "Day 20–21: Onboard 3 pilot users from waitlist (free 14 days)",
    ],
    target: "Working demo · 3 pilots",
  },
  {
    week: "Week 4 — Price the agent",
    focus: "Convert pilots + packages",
    days: [
      "Day 22–24: Fix pilot feedback; add export CSV",
      "Day 25–26: Paid plan page: ₦20k/mo starter · ₦35k/mo pro (or $29 / $49)",
      "Day 27–30: Sell 2 agent seats or 5 more Kits; review metrics",
    ],
    target: "2 paid seats or ₦150k+ month total product+service",
  },
];

const pricing = [
  { item: "WhatsApp Follow-up Agent Kit", ngn: "₦15,000", usd: "$19", type: "One-time" },
  { item: "DoyinAgent Starter (when live)", ngn: "₦20,000/mo", usd: "$29/mo", type: "SaaS" },
  { item: "DoyinAgent Pro", ngn: "₦35,000/mo", usd: "$49/mo", type: "SaaS" },
  { item: "Landing Page Starter (service)", ngn: "₦100,000", usd: "~$65", type: "50% deposit" },
  { item: "Local Business Website", ngn: "₦250,000", usd: "~$160", type: "50% deposit" },
];

export default function BuildPlan30dPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[800px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Execution · 30 days
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">
            Build & sell plan — WhatsApp ops
          </h1>
          <p className="mt-3 text-[16px] text-[#a1a1a6]">
            Sell the Kit this week. Build the agent while money comes in. Prices in ₦ and $.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead className="bg-[#141a28] text-[#86868b]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Offer</th>
                  <th className="px-4 py-3 font-semibold">₦</th>
                  <th className="px-4 py-3 font-semibold">$</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="text-[#e8eaed]">
                {pricing.map((r) => (
                  <tr key={r.item} className="border-t border-white/10">
                    <td className="px-4 py-3">{r.item}</td>
                    <td className="px-4 py-3 font-semibold text-[#ff8c14]">{r.ngn}</td>
                    <td className="px-4 py-3">{r.usd}</td>
                    <td className="px-4 py-3 text-[#a1a1a6]">{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 space-y-6">
            {weeks.map((w) => (
              <div
                key={w.week}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
              >
                <p className="text-[15px] font-semibold text-white">{w.week}</p>
                <p className="mt-1 text-[13px] text-[#ff8c14]">{w.focus}</p>
                <ul className="mt-3 space-y-2 text-[14px] text-[#c7cdd8]">
                  {w.days.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] font-semibold text-emerald-400">
                  Target: {w.target}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              Store — sell Kit
            </Link>
            <Link
              href="/apps/whatsapp-agent"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Agent MVP design
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
