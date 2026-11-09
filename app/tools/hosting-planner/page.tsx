import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { HostingPlannerTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Website Hosting and Domain Cost Calculator Nigeria",
  description: "Estimate how much a domain and hosting cost per year in naira for a static site, business website or web app. Plan your website budget in a minute.",
  alternates: { canonical: "/tools/hosting-planner" },
};

export default function Page() {
  return (
    <ToolPageShell title="Hosting & Domain Planner" subtitle="Rough yearly cost ranges in Naira — actual prices depend on provider and traffic.">
      <HostingPlannerTool />
    </ToolPageShell>
  );
}
