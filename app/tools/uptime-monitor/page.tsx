import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UptimeMonitorTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Uptime & SSL Monitor (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Uptime & SSL Monitor" subtitle="One-time unlock for monitoring workflow.">
      <UptimeMonitorTool />
    </ToolPageShell>
  );
}
