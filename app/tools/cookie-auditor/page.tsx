import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CookieAuditorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Cookie Security Auditor",
  description: "Inspect Set-Cookie flags: Secure, HttpOnly, SameSite.",
  alternates: { canonical: "/tools/cookie-auditor" },
};

export default function Page() {
  return (
    <ToolPageShell title="Cookie Security Auditor" subtitle="Review cookie flags returned by the server.">
      <CookieAuditorTool />
    </ToolPageShell>
  );
}
