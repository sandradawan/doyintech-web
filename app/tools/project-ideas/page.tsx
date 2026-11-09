import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProjectIdeasTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Portfolio Project Ideas for Developers",
  description: "Portfolio project ideas from beginner to advanced for students and junior developers, so you have real work to show employers and clients.",
  alternates: { canonical: "/tools/project-ideas" },
};

export default function Page() {
  return (
    <ToolPageShell title="Portfolio Project Ideas" subtitle="Pick a level and get practical project ideas that look good to employers.">
      <ProjectIdeasTool />
    </ToolPageShell>
  );
}
