import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RobotsAuditorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "robots.txt & Sitemap Auditor",
  description: "Inspect robots.txt rules and sitemap presence for recon risks.",
  alternates: { canonical: "/tools/robots-auditor" },
};

export default function Page() {
  return (
    <ToolPageShell title="robots.txt & Sitemap Auditor" subtitle="See what search engines and attackers can learn from robots and sitemaps.">
      <RobotsAuditorTool />
    </ToolPageShell>
  );
}
