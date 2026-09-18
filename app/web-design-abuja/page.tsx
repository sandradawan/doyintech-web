import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Web Design Abuja — Fixed-price SME websites | DoyinTech",
  description:
    "Website design for Abuja SMEs. Fixed-price landing pages and local business sites with WhatsApp. Remote delivery from DoyinTech.",
};

export default function WebDesignAbujaPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Abuja · FCT
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white">
            Web design for Abuja businesses
          </h1>
          <p className="mt-4 text-[17px] text-[#a1a1a6]">
            Fixed-price websites delivered remotely with the same process we use in Jos: clear
            scope, WhatsApp coordination, Paystack deposit, and sites built to get enquiries — not
            just look pretty.
          </p>
          <ul className="mt-8 space-y-2 text-[15px] text-[#c7cdd8]">
            <li>✓ Landing page ₦100,000 · Local site ₦250,000</li>
            <li>✓ Ideal for consultants, clinics, property, events, shops</li>
            <li>✓ Mobile-first + one-tap WhatsApp</li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/hire" className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black">Hire — deposit</a>
            <a href="/pricing-quiz" className="rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white">Pricing quiz</a>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white">WhatsApp</a>
          </div>
          <p className="mt-8 text-[14px] text-[#86868b]">
            <a href="/web-design-jos" className="text-[#2997ff] hover:underline">Web design Jos</a>{" "}
            · based in Plateau, serving Nigeria.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
