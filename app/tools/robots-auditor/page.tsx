import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RobotsAuditorTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "robots.txt & Sitemap Auditor",
  description: "Inspect a website's robots.txt rules and check its sitemap is present. Find pages blocked by mistake and paths that reveal too much. Free to use.",
  alternates: { canonical: "/tools/robots-auditor" },
};

export default function Page() {
  return (
    <ToolPageShell title="robots.txt & Sitemap Auditor" subtitle="See what search engines and attackers can learn from robots and sitemaps.">
      <RobotsAuditorTool />
    </ToolPageShell>
  );
}
