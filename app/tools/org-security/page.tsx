import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import OrgSecurityDashboard from "@/components/tools/OrgSecurityDashboard";

export const metadata: Metadata = {
  title: "Organization Security Dashboard",
  description:
    "Monitor several company domains for uptime, SSL expiry, security headers, SPF and DMARC in one dashboard, with alerts when something changes.",
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
