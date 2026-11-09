import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RedirectInspectorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Redirect Chain Inspector",
  description: "Trace every HTTP redirect from a URL to its final page and see each status code. Useful for finding redirect chains that slow your site and hurt SEO.",
  alternates: { canonical: "/tools/redirect-inspector" },
};

export default function Page() {
  return (
    <ToolPageShell title="Redirect Inspector" subtitle="Follow redirect chains hop by hop.">
      <RedirectInspectorTool />
    </ToolPageShell>
  );
}
