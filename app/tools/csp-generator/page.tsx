import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CspGeneratorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Content-Security-Policy Generator",
  description: "Generate a starter Content-Security-Policy from the script hosts found on your page, then test it before you switch it on. A free tool for developers.",
  alternates: { canonical: "/tools/csp-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="CSP Generator" subtitle="Turn observed script hosts into a starter Content-Security-Policy.">
      <CspGeneratorTool />
    </ToolPageShell>
  );
}
