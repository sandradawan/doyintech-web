"use client";

import { REVENUE_OFFERS, waLink } from "@/lib/revenue-30d";

export default function RevenueStrip() {
  return (
    <section className="border-y border-white/10 bg-[#0c1018] py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
          30-day focus · sell what pays
        </p>
        <h2 className="mt-2 text-center text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
          Three ways DoyinTech makes money
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] text-[#a1a1a6]">
          Services for cash this week. Digital products and ebooks while you sleep. Free audit to
          fill the pipeline.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVENUE_OFFERS.map((o) => (
            <article
              key={o.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                {o.path}
              </p>
              <h3 className="mt-2 text-[17px] font-semibold text-white">{o.title}</h3>
              <p className="mt-1 text-[20px] font-semibold text-white">{o.price}</p>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#a1a1a6]">{o.pitch}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={o.href}
                  className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black"
                >
                  Open
                </a>
                <a
                  href={waLink(o.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25D366] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
