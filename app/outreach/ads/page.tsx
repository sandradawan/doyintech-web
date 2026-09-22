import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import AdsCreatives from "@/components/outreach/AdsCreatives";

export const metadata: Metadata = {
  title: "Ads & Status creatives | DoyinTech",
  description: "Copy-ready WhatsApp Status, Meta, and follow-up scripts for DoyinTech offers.",
  robots: { index: false, follow: false },
};

export default function AdsPage() {
  return (
    <>
      <main className="min-h-screen bg-[#070b12] pb-24 pt-24">
        <AdsCreatives />
      </main>
      <Footer />
    </>
  );
}
