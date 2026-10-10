import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import ListPropertyForm from "@/components/real-estate/ListPropertyForm";

export const metadata: Metadata = {
  title: "List your property",
  description:
    "Submit a home for rent or sale on DoyinTech. Photos, walkthrough video, price, and WhatsApp — reviewed in the CRM before going live.",
};

export default function ListPropertyPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[720px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/real-estate" className="text-[#2997ff] hover:underline">
              Real estate
            </Link>{" "}
            / List property
          </p>
          <p className="section-eyebrow mt-4">Agents · Landlords</p>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            List a property
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
            Submit rent or sale listings with photo URL, walkthrough video, and your
            WhatsApp. An admin reviews each listing in the CRM before it appears in
            search.
          </p>
          <ListPropertyForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
