import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { HostingExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/hosting-export" }, description: "Export your domain and hosting cost plan as a PDF you can share with a client or your boss, in naira with yearly totals. One-time unlock.", title: "Hosting Plan Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Hosting Plan Export" subtitle="Pay to export domain + hosting plan PDF.">
      <HostingExportTool />
    </ToolPageShell>
  );
}
