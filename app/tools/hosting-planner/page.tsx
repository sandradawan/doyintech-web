import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { HostingPlannerTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Hosting & Domain Cost Planner Nigeria",
  description: "Estimate yearly domain and hosting costs in Naira for static sites, business websites, and web apps.",
  alternates: { canonical: "/tools/hosting-planner" },
};

export default function Page() {
  return (
    <ToolPageShell title="Hosting & Domain Planner" subtitle="Rough yearly cost ranges in Naira — actual prices depend on provider and traffic.">
      <HostingPlannerTool />
    </ToolPageShell>
  );
}
