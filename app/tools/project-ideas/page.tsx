import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ProjectIdeasTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Portfolio Project Ideas for Developers",
  description: "Beginner to advanced portfolio project ideas for students and junior developers in Nigeria.",
  alternates: { canonical: "/tools/project-ideas" },
};

export default function Page() {
  return (
    <ToolPageShell title="Portfolio Project Ideas" subtitle="Pick a level and get practical project ideas that look good to employers.">
      <ProjectIdeasTool />
    </ToolPageShell>
  );
}
