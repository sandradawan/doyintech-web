import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ContractGenerator from "@/components/tools/ContractGenerator";

export const metadata: Metadata = {
  title: "Service Agreement / Contract Generator",
  description:
    "Generate a simple service agreement template with fees, timeline, revisions, and signature lines. Print-ready.",
  alternates: { canonical: "/tools/contract-generator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Contract / Agreement Generator"
      subtitle="A practical service agreement template. Review with a lawyer for high-value work. Print only the contract."
    >
      <ContractGenerator />
    </ToolPageShell>
  );
}
