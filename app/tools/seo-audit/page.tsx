import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SeoAuditTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/seo-audit" }, description: "Check a web page for common SEO problems and get a report you can export: titles, descriptions, headings and more. One-time unlock, no subscription.", title: "SEO Audit Report (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="SEO Meta Audit Report" subtitle="Pay to export full SEO checklist report.">
      <SeoAuditTool />
    </ToolPageShell>
  );
}
