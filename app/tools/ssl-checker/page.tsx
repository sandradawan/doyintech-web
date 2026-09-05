import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SslCheckerTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "SSL / TLS Checker",
  description: "Check certificate expiry, issuer, protocol, and HTTPS redirect behaviour.",
  alternates: { canonical: "/tools/ssl-checker" },
};

export default function Page() {
  return (
    <ToolPageShell title="SSL / TLS Report Card" subtitle="Certificate health and HTTPS posture for any public domain.">
      <SslCheckerTool />
    </ToolPageShell>
  );
}
