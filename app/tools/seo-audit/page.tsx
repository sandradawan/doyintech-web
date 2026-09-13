import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SeoAuditTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "SEO Audit Report (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="SEO Meta Audit Report" subtitle="Pay to export full SEO checklist report.">
      <SeoAuditTool />
    </ToolPageShell>
  );
}
