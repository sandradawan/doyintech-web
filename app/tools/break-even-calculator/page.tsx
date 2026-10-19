import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { BreakEvenCalculatorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Break-Even Calculator (Free)",
  description:
    "Calculate break-even units and revenue from fixed costs, price, and variable cost per unit.",
  alternates: { canonical: "/tools/break-even-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Break-Even Calculator"
      subtitle="How many units to cover fixed costs."
    >
      <BreakEvenCalculatorTool />
    </ToolPageShell>
  );
}
