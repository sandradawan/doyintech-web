import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import OrgSecurityDashboard from "@/components/tools/OrgSecurityDashboard";

export const metadata: Metadata = {
  title: "Organization Security Dashboard",
  description:
    "Monitor multiple company domains for uptime, SSL, security headers, SPF and DMARC with live alerts.",
  alternates: { canonical: "/tools/org-security" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Organization Security Dashboard"
      subtitle="Live signals across your business domains — uptime, TLS, headers, and email authentication."
    >
      <OrgSecurityDashboard />
    </ToolPageShell>
  );
}
