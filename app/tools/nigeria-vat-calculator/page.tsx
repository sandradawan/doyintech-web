import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { NigeriaVatCalculatorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Nigeria VAT Calculator 7.5% (Free)",
  description:
    "Calculate Nigeria VAT at 7.5% — exclusive or inclusive amounts in Naira. Free VAT calculator.",
  alternates: { canonical: "/tools/nigeria-vat-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Nigeria VAT Calculator"
      subtitle="Add or extract 7.5% VAT from any ₦ amount."
    >
      <NigeriaVatCalculatorTool />
    </ToolPageShell>
  );
}
