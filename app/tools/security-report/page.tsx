import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SecurityReportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Security PDF Report (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Full Security PDF Report" subtitle="Pay to export client-ready security report.">
      <SecurityReportTool />
    </ToolPageShell>
  );
}
