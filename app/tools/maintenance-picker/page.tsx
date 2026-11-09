import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { MaintenanceTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Website Maintenance Plan Picker",
  description: "Choose a practical website maintenance plan based on how often you update your site and how much your business depends on it. Free and quick.",
  alternates: { canonical: "/tools/maintenance-picker" },
};

export default function Page() {
  return (
    <ToolPageShell title="Maintenance Plan Picker" subtitle="Match your site to an essentials, standard, or priority care plan.">
      <MaintenanceTool />
    </ToolPageShell>
  );
}
