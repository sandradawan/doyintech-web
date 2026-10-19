import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { LoanEmiCalculatorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Loan EMI Calculator Nigeria (Free)",
  description:
    "Estimate monthly loan repayment (EMI) in Naira from amount, interest rate, and tenure.",
  alternates: { canonical: "/tools/loan-emi-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Loan EMI Calculator"
      subtitle="Monthly repayment from amount, rate, and months."
    >
      <LoanEmiCalculatorTool />
    </ToolPageShell>
  );
}
