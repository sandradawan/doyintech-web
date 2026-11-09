import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CookieAuditorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Cookie Security Auditor",
  description: "Check your website's cookies for the Secure, HttpOnly and SameSite flags and see which ones are unprotected. A free security check for website owners.",
  alternates: { canonical: "/tools/cookie-auditor" },
};

export default function Page() {
  return (
    <ToolPageShell title="Cookie Security Auditor" subtitle="Review cookie flags returned by the server.">
      <CookieAuditorTool />
    </ToolPageShell>
  );
}
