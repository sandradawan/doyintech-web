import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SslCheckerTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "SSL / TLS Checker",
  description: "Check a website's SSL certificate: when it expires, who issued it, its protocol and whether HTTP redirects to HTTPS. Free, with no sign-up needed.",
  alternates: { canonical: "/tools/ssl-checker" },
};

export default function Page() {
  return (
    <ToolPageShell title="SSL / TLS Report Card" subtitle="Certificate health and HTTPS posture for any public domain.">
      <SslCheckerTool />
    </ToolPageShell>
  );
}
