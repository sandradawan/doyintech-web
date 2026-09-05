import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { GoLiveChecklistTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Website Go-Live Security Checklist",
  description: "Pre-launch security gates before putting a website into production.",
  alternates: { canonical: "/tools/golive-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="Go-Live Security Checklist" subtitle="Ship safer — tick every box before launch day.">
      <GoLiveChecklistTool />
    </ToolPageShell>
  );
}
