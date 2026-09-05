import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SmeSecurityChecklistTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "SME Security Checklist",
  description: "Practical cybersecurity checklist for small businesses in Nigeria.",
  alternates: { canonical: "/tools/sme-security-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="SME Security Checklist" subtitle="Everyday security habits for small teams and business owners.">
      <SmeSecurityChecklistTool />
    </ToolPageShell>
  );
}
