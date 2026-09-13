import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProposalExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Proposal PDF Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Proposal PDF Export" subtitle="Unlock to export polished proposals.">
      <ProposalExportTool />
    </ToolPageShell>
  );
}
