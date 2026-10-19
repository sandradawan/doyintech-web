import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProfitMarginCalculatorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Profit Margin Calculator (Free)",
  description:
    "Calculate profit, margin percentage, and markup from cost and selling price. Free online profit margin calculator.",
  alternates: { canonical: "/tools/profit-margin-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Profit Margin Calculator"
      subtitle="Profit, margin %, and markup from cost and sell price."
    >
      <ProfitMarginCalculatorTool />
    </ToolPageShell>
  );
}
