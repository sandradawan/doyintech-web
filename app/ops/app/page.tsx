import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import OpsApp from "@/components/ops/OpsApp";

export const metadata: Metadata = {
  title: "DoyinOps workspace",
  description: "Your DoyinOps contacts, pipeline, and invoices.",
  robots: { index: false, follow: false },
};

export default function OpsAppPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <OpsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
