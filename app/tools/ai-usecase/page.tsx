import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiUseCaseTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "AI Use-Case Finder for Business",
  description: "Discover practical AI and automation ideas for retail, education, services, and hospitality businesses.",
  alternates: { canonical: "/tools/ai-usecase" },
};

export default function Page() {
  return (
    <ToolPageShell title="AI Use-Case Finder" subtitle="Practical automation ideas — not hype. Pick your industry to get started.">
      <AiUseCaseTool />
    </ToolPageShell>
  );
}
