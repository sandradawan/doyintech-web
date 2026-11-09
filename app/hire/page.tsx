import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import ServiceDepositButton from "@/components/services/ServiceDepositButton";
import ServiceAddons from "@/components/services/ServiceAddons";
import { SERVICE_OFFERS, serviceWhatsAppLink } from "@/lib/service-offers";
import { discoveryCallLink } from "@/lib/packages";

// Add-on prices can be changed in Admin → Pricing; refresh hourly.
export const revalidate = 3600;

export const metadata: Metadata = { alternates: { canonical: "/hire" },
  title: "Hire DoyinTech — Fixed-price websites · 50% deposit",
  description:
    "Hire DoyinTech to build your business website at a fixed price. Book your slot with a 50% deposit, pay securely with Paystack and go live in days.",
};

export default function HirePage() {
  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Fixed price · USD · Paystack deposit
          </p>
          <h1 className="mt-2 max-w-3xl text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Book your website slot. Pay deposit. We build.
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            Three clear packages. No vague “from” quotes. 50% online today — balance before
            launch. Built for growing businesses worldwide.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#packages"
              className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
            >
              Choose package & deposit
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-[14px] font-semibold text-white"
            >
              Free 15-min call
            </a>
            <a
              href="/free-audit"
              className="rounded-full px-5 py-3 text-[14px] text-brand-muted hover:text-white"
            >
              Free audit first →
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { t: "Fixed total", d: "USD price on the card — not a vague range" },
              { t: "50% deposit", d: "Paystack · rest before handoff" },
              { t: "WhatsApp-ready", d: "Every site drives chat & booking" },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-xl border border-white/10 bg-brand-surface px-4 py-3"
              >
                <p className="text-[13px] font-semibold text-white">{x.t}</p>
                <p className="mt-1 text-[12px] text-brand-muted">{x.d}</p>
              </div>
            ))}
          </div>

          <div id="packages" className="mt-14 grid scroll-mt-28 gap-6 lg:grid-cols-3">
            {SERVICE_OFFERS.map((offer) => (
              <article
                key={offer.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-brand-raised to-brand-deep p-6"
              >
                {offer.badge && (
                  <span className="mb-3 w-fit rounded-full bg-[#ff8c14]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#ff8c14]">
                    {offer.badge}
                  </span>
                )}
                <h2 className="text-[22px] font-semibold text-white">{offer.name}</h2>
                <p className="mt-2 text-[14px] text-brand-muted">{offer.tagline}</p>
                <p className="mt-4 text-[28px] font-semibold text-white">{offer.totalUsd || offer.totalNgn}</p>
                <p className="text-[13px] text-brand-subtle">
                  Deposit {offer.depositUsd || offer.depositNgn} · {offer.timeline}
                </p>
                <p className="mt-3 text-[13px] text-brand-soft">Ideal for: {offer.idealFor}</p>

                <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-brand-subtle">
                  Included
                </h3>
                <ul className="mt-2 space-y-2">
                  {offer.scope.map((s) => (
                    <li key={s} className="flex gap-2 text-[13px] text-brand-soft">
                      <span className="text-[#ff8c14]">✓</span> {s}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-brand-subtle">
                  Not included
                </h3>
                <ul className="mt-2 space-y-1">
                  {offer.notIncluded.map((s) => (
                    <li key={s} className="text-[12px] text-brand-subtle">
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
                  className="mt-3 text-center text-[13px] text-brand-link hover:underline"
                >
                  Questions? WhatsApp before deposit
                </a>
              </article>
            ))}
          </div>

          <ServiceAddons />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-brand-surface p-6 text-[14px] text-brand-muted">
              <p className="font-semibold text-white">How it works</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Pick a package → pay 50% deposit.</li>
                <li>Send logo, text, and photos.</li>
                <li>Review draft in the timeline shown.</li>
                <li>Pay balance → we launch + short support.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-white/10 bg-brand-surface p-6">
              <p className="font-semibold text-white">Not ready to deposit?</p>
              <p className="mt-2 text-[14px] text-brand-muted">
                Free audit or 15-min call — no pressure. Deposit only when you book a slot.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/free-audit"
                  className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white"
                >
                  Free audit
                </a>
                <a
                  href={discoveryCallLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-black"
                >
                  Book a call
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <h2 className="text-[18px] font-semibold text-white">FAQ</h2>
            {[
              {
                q: "Do you write all the content?",
                a: "You send facts, offers, and photos. We structure for conversion. Full copywriting is extra if needed.",
              },
              {
                q: "Can I pay the balance later in parts?",
                a: "Balance is due before launch. Message us after deposit if you need a short staged plan.",
              },
              {
                q: "Where are you based?",
                a: "We work remotely with clients worldwide. HQ in Jos, Nigeria — payments via Paystack.",
              },
              {
                q: "Why is checkout in Naira if prices show USD?",
                a: "USD is the display currency for international visitors. Paystack settles in NGN; your bank converts automatically when you pay with an international card.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-brand-deep px-5 py-4"
              >
                <p className="text-[14px] font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-[13px] text-brand-muted">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#packages"
              className="inline-flex rounded-full bg-[#ff8c14] px-8 py-3.5 text-[15px] font-semibold text-black"
            >
              Back to packages — pay deposit
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
