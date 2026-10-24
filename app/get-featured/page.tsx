import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { BOOST_PLANS, formatKobo } from "@/lib/storefront/shared";

const TITLE = "Get your shop featured — more buyers on DoyinTech";
const DESCRIPTION =
  "Put your shop at the top of the DoyinTech shop directory, your category page and the homepage. From ₦2,000 a week. See your shop views in your dashboard.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/get-featured" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/get-featured" },
};

const FAQS: Faq[] = [
  {
    q: "Where does a featured shop appear?",
    a: "First on doyintech.com/shops, first on your category page (for example Food & drinks), and in the Featured shops section of the DoyinTech homepage. Featured shops carry a small Sponsored label.",
  },
  {
    q: "How do I know it's working?",
    a: "Your dashboard shows shop views for the last 7 and 30 days, and how many came from the DoyinTech directory and homepage.",
  },
  {
    q: "Can I extend it?",
    a: "Yes. Buying again adds the days on top of the time you have left, so there's no gap.",
  },
  {
    q: "Who can be featured?",
    a: "Any visible DoyinTech shop with at least one product in stock, on the free or Store plan. We may remove listings that break our terms, and refund unused days if we do.",
  },
];

const PLACES = [
  ["Top of the shop directory", "Buyers browsing doyintech.com/shops see you first."],
  ["Top of your category", "First in front of people looking for exactly what you sell."],
  ["DoyinTech homepage", "Featured shops section, seen by every visitor to our site."],
];

export default function GetFeaturedPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">For sellers</p>
          <h1 className="mt-2 max-w-3xl text-[32px] font-semibold tracking-tight text-white sm:text-[44px]">Get your shop in front of buyers who are ready to order</h1>
          <p className="mt-4 max-w-2xl text-[17px] text-[#a1a1a6]">{DESCRIPTION}</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {PLACES.map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
                <p className="text-[15px] font-semibold text-white">{t}</p>
                <p className="mt-1 text-[14px] text-[#a1a1a6]">{d}</p>
              </li>
            ))}
          </ul>

          <section className="mt-12 grid gap-4 sm:grid-cols-2">
            {BOOST_PLANS.map((p) => (
              <div key={p.days} className={`rounded-[22px] border p-6 ${p.days === 30 ? "border-[#ff8c14]/50 bg-[#ff8c14]/[0.06]" : "border-white/10 bg-[#141a28]"}`}>
                {p.days === 30 && <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">Best value · 4 weeks for the price of 3</p>}
                <h2 className="mt-1 text-[20px] font-semibold text-white">Featured for {p.label}</h2>
                <p className="mt-3 text-[36px] font-semibold text-white">{formatKobo(p.amountKobo)}</p>
                <p className="text-[13px] text-[#86868b]">≈ {formatKobo(Math.round(p.amountKobo / p.days))} a day · one-off payment, no subscription</p>
                <Link href="/stores/dashboard" className="mt-5 inline-flex w-full justify-center rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black">
                  Feature my shop
                </Link>
              </div>
            ))}
          </section>
          <p className="mt-4 text-[13px] text-[#86868b]">
            No shop yet?{" "}
            <Link href="/stores" className="text-[#ff8c14] hover:underline">
              Open one free in two minutes
            </Link>
            , add a product, then feature it from your dashboard.
          </p>

          <section className="mt-16 max-w-3xl">
            <h2 className="text-[22px] font-semibold text-white">Questions</h2>
            <dl className="mt-4 space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
