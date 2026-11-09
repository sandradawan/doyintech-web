import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { MixedContentTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Mixed Content Finder",
  description: "Find HTTP images, scripts and styles loading on your HTTPS pages, the usual cause of a missing padlock or broken page. A free website security check.",
  alternates: { canonical: "/tools/mixed-content" },
};

export default function Page() {
  return (
    <ToolPageShell title="Mixed Content Finder" subtitle="Detect http:// assets referenced from HTTPS pages.">
      <MixedContentTool />
    </ToolPageShell>
  );
}
