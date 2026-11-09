import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProposalExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/proposal-export" }, description: "Turn your business proposal into a clean PDF you can send to a client, with your scope, price and timeline laid out clearly. One-time unlock.", title: "Proposal PDF Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Proposal PDF Export" subtitle="Unlock to export polished proposals.">
      <ProposalExportTool />
    </ToolPageShell>
  );
}
