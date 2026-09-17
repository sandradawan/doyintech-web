import type { Metadata } from "next";
import OpsApp from "@/components/ops/OpsApp";

export const metadata: Metadata = {
  title: "DoyinOps workspace",
  description: "Your DoyinOps contacts, pipeline, invoices, and tasks.",
  robots: { index: false, follow: false },
};

export default function OpsAppPage() {
  return (
    <div className="min-h-screen bg-[#070b12] pt-12">
      <OpsApp />
    </div>
  );
}
