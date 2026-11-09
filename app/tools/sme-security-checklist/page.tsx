import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SmeSecurityChecklistTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Cyber Security Checklist for Small Businesses in Nigeria",
  description: "A practical cyber security checklist for small businesses in Nigeria: passwords, staff access, backups, payment scams and what to do first.",
  alternates: { canonical: "/tools/sme-security-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="SME Security Checklist" subtitle="Everyday security habits for small teams and business owners.">
      <SmeSecurityChecklistTool />
    </ToolPageShell>
  );
}
