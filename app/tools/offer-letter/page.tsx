import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { OfferLetterTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Offer Letter (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Salary & Offer Letter" subtitle="Unlock offer letter PDF export.">
      <OfferLetterTool />
    </ToolPageShell>
  );
}
