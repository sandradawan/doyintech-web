import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PercentageCalculatorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Percentage Calculator (Free)",
  description:
    "Calculate X% of Y, what percent X is of Y, and percentage increase or decrease. Free online percentage calculator for work, school and shopping.",
  alternates: { canonical: "/tools/percentage-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Percentage Calculator"
      subtitle="Percent of, percent is, and percent change."
    >
      <PercentageCalculatorTool />
    </ToolPageShell>
  );
}
