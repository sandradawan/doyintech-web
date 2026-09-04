import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SkillGapTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Tech Skill Gap Checker",
  description: "Check skill gaps for backend, frontend, mobile, and AI learning paths. See what to learn next.",
  alternates: { canonical: "/tools/skill-gap" },
};

export default function Page() {
  return (
    <ToolPageShell title="Skill Gap Checker" subtitle="Pick a track, list what you already know, and see priority skills to learn next.">
      <SkillGapTool />
    </ToolPageShell>
  );
}
