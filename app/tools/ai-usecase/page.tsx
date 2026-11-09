import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiUseCaseTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "AI Use-Case Finder for Business",
  description: "Find practical AI and automation ideas for retail, education, services and hospitality businesses, matched to the work your team does every day.",
  alternates: { canonical: "/tools/ai-usecase" },
};

export default function Page() {
  return (
    <ToolPageShell title="AI Use-Case Finder" subtitle="Practical automation ideas — not hype. Pick your industry to get started.">
      <AiUseCaseTool />
    </ToolPageShell>
  );
}
