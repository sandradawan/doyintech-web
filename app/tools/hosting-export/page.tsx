import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { HostingExportTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Hosting Plan Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Hosting Plan Export" subtitle="Pay to export domain + hosting plan PDF.">
      <HostingExportTool />
    </ToolPageShell>
  );
}
