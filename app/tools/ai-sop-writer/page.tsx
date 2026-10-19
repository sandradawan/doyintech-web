import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiSopWriterTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI SOP / Process Writer (Paid)",
  description: "Generate practical standard operating procedures with AI. One-time unlock.",
  alternates: { canonical: "/tools/ai-sop-writer" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI SOP / Process Writer"
      subtitle="Generate practical SOPs with AI — unlock full export."
    >
      <AiSopWriterTool />
    </ToolPageShell>
  );
}
