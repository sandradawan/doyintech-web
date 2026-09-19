import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Lead nurture templates — WhatsApp follow-ups",
  description:
    "Copy-paste WhatsApp sequences after free audit, scripts tool, or deposit — internal DoyinTech playbook.",
  robots: { index: false, follow: false },
};

const sequences = [
  {
    title: "After free audit lead",
    steps: [
      {
        day: "Day 0 (same day)",
        text: `Hi {{name}} — got your audit request for {{url}}.\n\nI'll reply with 2–3 specific fixes within 1 business day.\n\nMeanwhile: if you want a fixed-price landing page (₦100k) or local site (₦250k), see doyintech.vercel.app/hire — 50% deposit locks the slot.`,
      },
      {
        day: "Day 1",
        text: `Quick follow-up on your site audit.\n\nBiggest issues I see: [1] [2] [3].\n\nHonest next step: [small DIY fix / landing page / full local site].\n\nWant me to quote fixed price + timeline? Reply YES.`,
      },
      {
        day: "Day 3",
        text: `Last nudge — happy to close the loop.\n\nIf budget is tight, start with a ₦100k landing page that sells one offer + WhatsApp.\n\nOr use free scripts: doyintech.vercel.app/tools/whatsapp-scripts\n\nReply when you're ready.`,
      },
    ],
  },
  {
    title: "After WhatsApp scripts tool",
    steps: [
      {
        day: "Day 0",
        text: `Hi {{name}} — your scripts are ready to paste into WhatsApp Business.\n\nTip: put a one-tap WhatsApp button on a real site. Strangers trust a link more than a bio alone.\n\nFree audit: doyintech.vercel.app/free-audit`,
      },
      {
        day: "Day 2",
        text: `Did the reply scripts help?\n\nMany salons/clinics next step is a fixed-price site so bookings don't die in DMs.\n\nLanding ₦100k · Local ₦250k · deposit online: doyintech.vercel.app/hire`,
      },
    ],
  },
  {
    title: "After deposit (already on success page)",
    steps: [
      {
        day: "Day 0",
        text: `Deposit received — thank you.\n\nNext: send logo, colours, text, photos. I'll share a private Drive folder.\n\nTimeline starts when assets land. Balance only before final handoff.`,
      },
      {
        day: "Day 2 (if no assets)",
        text: `Friendly reminder — still waiting on logo + photos + WhatsApp number for the site button so we can keep your launch date.\n\nReply with files or a Drive link anytime.`,
      },
    ],
  },
];

export default function NurturePage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Internal · noindex
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">Lead nurture scripts</h1>
          <p className="mt-3 text-[15px] text-[#a1a1a6]">
            Paste into WhatsApp from the lead inbox. Replace{" "}
            <code className="text-[#ff8c14]">{`{{name}}`}</code> and{" "}
            <code className="text-[#ff8c14]">{`{{url}}`}</code>. Consistency beats perfect copy.
          </p>
          <div className="mt-10 space-y-10">
            {sequences.map((seq) => (
              <section key={seq.title}>
                <h2 className="text-[20px] font-semibold text-white">{seq.title}</h2>
                <div className="mt-4 space-y-4">
                  {seq.steps.map((s) => (
                    <div
                      key={s.day}
                      className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
                    >
                      <p className="text-[12px] font-semibold text-[#ff8c14]">{s.day}</p>
                      <pre className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-[#e8eaed]">
                        {s.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-10 text-[13px] text-[#86868b]">
            Leads:{" "}
            <a href="/admin/leads" className="text-[#ff8c14] hover:underline">
              /admin/leads
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
