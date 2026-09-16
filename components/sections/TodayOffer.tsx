import Link from "next/link";
import { SERVICE_OFFERS } from "@/lib/service-offers";

/** Homepage strip highlighting the newest sellable offer */
export default function TodayOffer() {
  const offer = SERVICE_OFFERS[0];

  return (
    <section className="border-b border-white/10 bg-gradient-to-r from-[#1a1208] via-[#0c1018] to-[#0c1018]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
            New on the site · hire
          </p>
          <p className="mt-1 text-[16px] font-semibold text-white sm:text-[18px]">
            {offer.name} — {offer.totalNgn}{" "}
            <span className="font-normal text-[#a1a1a6]">
              (deposit {offer.depositNgn})
            </span>
          </p>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#a1a1a6]">
            {offer.tagline} Ideal for {offer.idealFor.toLowerCase()}.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/hire"
            className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
          >
            View package
          </Link>
          <a
            href={`https://wa.me/2348085343926?text=${encodeURIComponent(
              `Hi DoyinTech, I want the ${offer.name} (${offer.totalNgn}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
