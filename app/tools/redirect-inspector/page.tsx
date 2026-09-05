import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RedirectInspectorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Redirect Chain Inspector",
  description: "Trace HTTP redirect hops to the final URL.",
  alternates: { canonical: "/tools/redirect-inspector" },
};

export default function Page() {
  return (
    <ToolPageShell title="Redirect Inspector" subtitle="Follow redirect chains hop by hop.">
      <RedirectInspectorTool />
    </ToolPageShell>
  );
}
