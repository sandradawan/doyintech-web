import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProjectBriefTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Project Brief Generator",
  description: "Free project brief generator for websites, apps, and automation. Structure your requirements before hiring a developer.",
  alternates: { canonical: "/tools/project-brief" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Project Brief Generator"
      subtitle="Turn a rough idea into a clear brief you can share with developers or send to DoyinTech."
    >
      <ProjectBriefTool />
    </ToolPageShell>
  );
}
