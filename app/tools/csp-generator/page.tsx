import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CspGeneratorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Content-Security-Policy Generator",
  description: "Generate a starter CSP from script hosts found on your page.",
  alternates: { canonical: "/tools/csp-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="CSP Generator" subtitle="Turn observed script hosts into a starter Content-Security-Policy.">
      <CspGeneratorTool />
    </ToolPageShell>
  );
}
