import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SecurityHeadersTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Security Headers Checker",
  description: "Score HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy and more.",
  alternates: { canonical: "/tools/security-headers" },
};

export default function Page() {
  return (
    <ToolPageShell title="Security Headers Checker" subtitle="Real HTTP response headers scored with clear pass/fail.">
      <SecurityHeadersTool />
    </ToolPageShell>
  );
}
