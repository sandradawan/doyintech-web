import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SecurityHeadersTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Security Headers Checker",
  description: "Score your website's HSTS, Content-Security-Policy, X-Frame-Options, nosniff, Referrer-Policy and more, and see exactly which headers to fix.",
  alternates: { canonical: "/tools/security-headers" },
};

export default function Page() {
  return (
    <ToolPageShell title="Security Headers Checker" subtitle="Real HTTP response headers scored with clear pass/fail.">
      <SecurityHeadersTool />
    </ToolPageShell>
  );
}
