import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import ServiceDepositButton from "@/components/services/ServiceDepositButton";
import { SERVICE_OFFERS, serviceWhatsAppLink } from "@/lib/service-offers";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Hire DoyinTech — Fixed-price websites",
  description:
    "Landing page from ₦100,000, local business site ₦250,000, or growth website ₦450,000. Clear fixed prices and 50% Paystack deposit.",
};

export default function HirePage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Fixed price · 50% deposit
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Hire us for a website that gets enquiries
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            No vague "from" quotes. Start with a single landing page or a full site. Pay the
            deposit online, send your content — we build and launch. Balance before final handoff.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Free 15-min call first
            </a>
            <a
              href="/free-audit"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              Free website audit
            </a>
            <a
              href="/pricing"
              className="rounded-full px-5 py-2.5 text-[14px] text-[#a1a1a6] hover:text-white"
            >
              See full pricing ranges →
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { t: "Fixed price", d: "No vague from quotes — totals on this page" },
              { t: "50% deposit", d: "Paystack online · balance only before handoff" },
              { t: "WhatsApp-first", d: "Every site pushes chat / booking clearly" },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-xl border border-white/10 bg-[#141a28] px-4 py-3"
              >
                <p className="text-[13px] font-semibold text-white">{x.t}</p>
                <p className="mt-1 text-[12px] text-[#a1a1a6]">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {SERVICE_OFFERS.map((offer) => (
              <article
                key={offer.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-6"
              >
                {offer.badge && (
                  <span className="mb-3 w-fit rounded-full bg-[#ff8c14]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#ff8c14]">
                    {offer.badge}
                  </span>
                )}
                <h2 className="text-[22px] font-semibold text-white">{offer.name}</h2>
                <p className="mt-2 text-[14px] text-[#a1a1a6]">{offer.tagline}</p>
                <p className="mt-4 text-[28px] font-semibold text-white">{offer.totalNgn}</p>
                <p className="text-[13px] text-[#86868b]">
                  Deposit {offer.depositNgn} · {offer.timeline}
                </p>
                <p className="mt-3 text-[13px] text-[#c7cdd8]">Ideal for: {offer.idealFor}</p>

                <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
                  Included
                </h3>
                <ul className="mt-2 space-y-2">
                  {offer.scope.map((s) => (
                    <li key={s} className="flex gap-2 text-[13px] text-[#e8eaed]">
                      <span className="text-[#ff8c14]">✓</span> {s}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
                  Not included
                </h3>
                <ul className="mt-2 space-y-1">
                  {offer.notIncluded.map((s) => (
                    <li key={s} className="text-[12px] text-[#86868b]">
                      · {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <ServiceDepositButton offer={offer} />
                </div>
                <a
                  href={serviceWhatsAppLink(offer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-center text-[13px] text-[#2997ff] hover:underline"
                >
                  Questions before deposit? WhatsApp us
                </a>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-[#141a28] p-6 text-[14px] leading-relaxed text-[#a1a1a6]">
            <p className="font-semibold text-white">How it works</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Pay 50% deposit (Paystack or WhatsApp transfer).</li>
              <li>Send logo, colours, text, and photos on WhatsApp.</li>
              <li>We share a first draft in the timeline above.</li>
              <li>Structured feedback round (or two on Growth).</li>
              <li>Balance payment → launch + short support window.</li>
            </ol>
          </div>

          <div className="mt-10 space-y-4">
            <h2 className="text-[20px] font-semibold text-white">Common questions</h2>
            {[
              {
                q: "What if I am not ready to pay deposit today?",
                a: "Start with a free website audit or a 15-min call. No pressure — deposit only when you want to book a slot.",
              },
              {
                q: "Do you write the content for me?",
                a: "You provide business facts, offers, and photos. We structure the page for clarity and conversion. Full copywriting can be quoted separately.",
              },
              {
                q: "Can I pay the balance in instalments?",
                a: "Balance is due before final handoff / domain. Talk to us on WhatsApp if you need a short staged plan after deposit.",
              },
              {
                q: "Where are you based?",
                a: "Jos, Nigeria — we work with SMEs nationwide over WhatsApp and Paystack.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-[#0c1018] px-5 py-4"
              >
                <p className="text-[14px] font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20want%20to%20hire%20you%20for%20a%20website.%20Which%20package%20fits%20me%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#25D366] px-8 py-3.5 text-[15px] font-semibold text-white"
            >
              WhatsApp — help me choose a package
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
