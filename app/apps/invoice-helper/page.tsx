import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { InvoiceHelperApp } from "@/components/apps/MiniApps";

export const metadata: Metadata = {
  title: "Invoice Helper · DoyinStore",
  description: "Free web invoice helper for freelancers and SMEs.",
};

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] px-6 pb-24 pt-24">
        <div className="mb-6 flex justify-between text-sm">
          <Link href="/store" className="text-[#ff8c14] hover:underline">
            ← Store
          </Link>
          <Link href="/store/invoice-helper" className="text-[#a1a1a6] hover:text-white">
            Listing
          </Link>
        </div>
        <InvoiceHelperApp />
      </main>
      <Footer />
    </>
  );
}
