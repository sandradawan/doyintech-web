import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ContractExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Contract / NDA Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Contract / NDA Export" subtitle="Pay to export agreement PDF.">
      <ContractExportTool />
    </ToolPageShell>
  );
}
