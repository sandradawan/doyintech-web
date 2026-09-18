"use client";

import { useMemo, useState } from "react";
import Footer from "@/components/ui/Footer";
import { SERVICE_OFFERS, serviceWhatsAppLink } from "@/lib/service-offers";

type Answers = {
  pages: "one" | "few" | "many";
  goal: "test" | "enquiries" | "rank";
  booking: boolean;
};

export default function PricingQuizPage() {
  const [a, setA] = useState<Answers>({
    pages: "few",
    goal: "enquiries",
    booking: false,
  });

  const recommendation = useMemo(() => {
    if (a.pages === "one" || a.goal === "test") {
      return SERVICE_OFFERS[0]; // Landing
    }
    if (a.pages === "many" || a.goal === "rank") {
      return SERVICE_OFFERS[2]; // Growth
    }
    return SERVICE_OFFERS[1]; // Local
  }, [a]);

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            60-second quiz
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white">
            Which package fits?
          </h1>
          <p className="mt-3 text-[16px] text-[#a1a1a6]">
            Answer three questions. Get a fixed-price recommendation and deposit link.
          </p>

          <div className="mt-10 space-y-8">
            <fieldset>
              <legend className="text-[15px] font-semibold text-white">How many pages?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["one", "One page / one offer"],
                    ["few", "Up to 5 pages"],
                    ["many", "Up to 10 + blog"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setA((s) => ({ ...s, pages: v }))}
                    className={`rounded-full border px-4 py-2 text-[13px] ${
                      a.pages === v
                        ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                        : "border-white/15 text-[#a1a1a6]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-[15px] font-semibold text-white">Main goal</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["test", "Test one offer quickly"],
                    ["enquiries", "More WhatsApp / calls"],
                    ["rank", "Rank + measure growth"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setA((s) => ({ ...s, goal: v }))}
                    className={`rounded-full border px-4 py-2 text-[13px] ${
                      a.goal === v
                        ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                        : "border-white/15 text-[#a1a1a6]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-[15px] font-semibold text-white">Need booking / appointments?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setA((s) => ({ ...s, booking: false }))}
                  className={`rounded-full border px-4 py-2 text-[13px] ${
                    !a.booking
                      ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                      : "border-white/15 text-[#a1a1a6]"
                  }`}
                >
                  Not yet
                </button>
                <button
                  type="button"
                  onClick={() => setA((s) => ({ ...s, booking: true }))}
                  className={`rounded-full border px-4 py-2 text-[13px] ${
                    a.booking
                      ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                      : "border-white/15 text-[#a1a1a6]"
                  }`}
                >
                  Yes — appointments matter
                </button>
              </div>
            </fieldset>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-[#141a28] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
              Recommended
            </p>
            <h2 className="mt-2 text-[24px] font-semibold text-white">{recommendation.name}</h2>
            <p className="mt-1 text-[14px] text-[#a1a1a6]">{recommendation.tagline}</p>
            <p className="mt-4 text-[28px] font-semibold text-white">{recommendation.totalNgn}</p>
            <p className="text-[13px] text-[#86868b]">
              Deposit {recommendation.depositNgn} · {recommendation.timeline}
            </p>
            {a.booking && (
              <p className="mt-3 text-[13px] text-[#c7cdd8]">
                Tip: ask us about WhatsApp + booking add-on when you message.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href="/hire"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black"
              >
                Pay deposit on /hire
              </a>
              <a
                href={serviceWhatsAppLink(recommendation)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 py-3 text-[14px] font-semibold text-white"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
