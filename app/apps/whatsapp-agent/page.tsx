import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DoyinAgent MVP — WhatsApp Ops Agent",
  description:
    "Product design for the WhatsApp ops agent: reply suggestions, pipeline, follow-ups, Status drafts.",
};

const phases = [
  {
    title: "Phase 0 — Sell the Kit (now)",
    items: [
      "WhatsApp Follow-up Agent Kit live in store (₦15,000 / $19)",
      "Scripts + CSV + AI prompts — no app required",
      "Collect buyers → waitlist for full agent",
    ],
  },
  {
    title: "Phase 1 — MVP agent (weeks 1–3)",
    items: [
      "Web app: paste chat → suggest next reply (from your scripts + AI)",
      "Local pipeline board: Lead → Quoted → Follow-up → Deposit → Won/Lost",
      "Reminders list: who to message today",
      "One-tap copy to WhatsApp",
      "Auth optional; start with localStorage + export CSV",
    ],
  },
  {
    title: "Phase 2 — Paid agent (weeks 4–6)",
    items: [
      "Cloud sync per business",
      "Saved brand voice + offer library",
      "Status caption generator tied to pipeline",
      "₦20,000–₦35,000/mo or $29–$49/mo",
    ],
  },
];

const screens = [
  { name: "Inbox assist", desc: "Paste last messages → 3 reply options + tone slider" },
  { name: "Pipeline", desc: "Kanban of leads; drag to stage; next action date" },
  { name: "Today", desc: "List of people due for Day-2 / Day-5 / Day-7" },
  { name: "Status studio", desc: "7 captions/week from your offers + CTAs" },
];

export default function WhatsappAgentMvpPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[800px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Product · MVP design
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">
            DoyinAgent — WhatsApp Ops Agent
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
            Highest-demand product shape: AI automation that closes the loop on WhatsApp
            (message → follow-up → deposit). Start with a paid kit; ship the agent next.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              Buy Follow-up Kit · ₦15k
            </Link>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20add%20me%20to%20the%20DoyinAgent%20waitlist."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Join agent waitlist
            </a>
            <Link
              href="/apps/build-plan-30d"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              30-day plan →
            </Link>
          </div>

          <h2 className="mt-12 text-[20px] font-semibold text-white">MVP screens</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {screens.map((s) => (
              <div
                key={s.name}
                className="rounded-xl border border-white/10 bg-[#141a28] p-4"
              >
                <p className="text-[15px] font-semibold text-white">{s.name}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{s.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-[20px] font-semibold text-white">Build phases</h2>
          <div className="mt-4 space-y-4">
            {phases.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
              >
                <p className="text-[15px] font-semibold text-[#ff8c14]">{p.title}</p>
                <ul className="mt-3 space-y-2 text-[14px] text-[#c7cdd8]">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#ff8c14]">✓</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-5 text-[14px] text-[#c7cdd8]">
            <p className="font-semibold text-white">Success metrics (first 30 days)</p>
            <ul className="mt-2 space-y-1">
              <li>· 15+ Kit sales (₦15k each) or equivalent pipeline</li>
              <li>· 50 waitlist signups for DoyinAgent</li>
              <li>· 5 businesses using scripts weekly (proof)</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
