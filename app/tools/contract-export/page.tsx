import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ContractExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/contract-export" }, description: "Create a contract or NDA and export it as a clean PDF you can send for signing. One-time unlock with no subscription. Get a lawyer to review big deals.", title: "Contract / NDA Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Contract / NDA Export" subtitle="Pay to export agreement PDF.">
      <ContractExportTool />
    </ToolPageShell>
  );
}
