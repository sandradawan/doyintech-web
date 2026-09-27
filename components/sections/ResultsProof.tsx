"use client";

import ScrollReveal from "../animations/ScrollReveal";

const RESULTS = [
  {
    metric: "Week 1",
    label: "WhatsApp leads",
    detail: "Property site — clearer offer, one-tap chat, viewings booked same week.",
    client: "Imperial Villa · Jos",
  },
  {
    metric: "Fixed price",
    label: "No scope surprises",
    detail: "Marketplace live on timeline. Team updates content without calling a developer.",
    client: "DoyinMart",
  },
  {
    metric: "More bookings",
    label: "Mobile-first site",
    detail: "Gaming lounge site that looks premium and turns walk-ins into reservations.",
    client: "LegacyPlay",
  },
];

export default function ResultsProof() {
  return (
    <section className="border-y border-white/5 bg-[#0a0e17] py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Proof · not promises
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Results clients can point to.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#a1a1a6]">
              Real Nigerian businesses. Clear outcomes. Then you decide — kit, audit, or deposit.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {RESULTS.map((r, i) => (
            <ScrollReveal key={r.client} direction="up" delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-[#141a28] p-6">
                <p className="text-[28px] font-semibold tracking-tight text-[#ff8c14]">
                  {r.metric}
                </p>
                <p className="mt-1 text-[14px] font-semibold text-white">{r.label}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-[#a1a1a6]">{r.detail}</p>
                <p className="mt-4 text-[12px] font-medium text-[#86868b]">{r.client}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/hire"
            className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
          >
            Hire — pay deposit
          </a>
          <a
            href="/portfolio"
            className="rounded-full border border-white/15 px-6 py-3 text-[14px] font-semibold text-white"
          >
            See live work
          </a>
        </div>
      </div>
    </section>
  );
}
