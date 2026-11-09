import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SecurityReportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/security-report" }, description: "Turn your website security check into a clean PDF report that you can share with your team or client, with clear findings. One-time unlock.", title: "Security PDF Report (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Full Security PDF Report" subtitle="Pay to export client-ready security report.">
      <SecurityReportTool />
    </ToolPageShell>
  );
}
