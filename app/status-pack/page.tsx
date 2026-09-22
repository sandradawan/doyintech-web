import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import StatusPackClient from "@/components/growth/StatusPackClient";

export const metadata: Metadata = {
  title: "Weekly Status pack — promote free audit & Landing Page",
  description:
    "Ready WhatsApp Status captions for DoyinTech: free audit, fixed-price websites, digital products. Copy and post daily.",
};

export default function StatusPackPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <StatusPackClient />
      </main>
      <Footer />
    </>
  );
}
