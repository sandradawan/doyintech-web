import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { OfferLetterTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/offer-letter" }, description: "Create a professional job offer letter and export it as a PDF for your new hire, with role, pay and start date filled in. One-time unlock.", title: "Offer Letter (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Salary & Offer Letter" subtitle="Unlock offer letter PDF export.">
      <OfferLetterTool />
    </ToolPageShell>
  );
}
