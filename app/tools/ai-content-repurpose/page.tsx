import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiContentRepurposeTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Content Repurposer (Paid)",
  description: "Turn long content into posts, Status, email, and scripts with AI.",
  alternates: { canonical: "/tools/ai-content-repurpose" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Content Repurposer"
      subtitle="One source → posts, Status, email, script."
    >
      <AiContentRepurposeTool />
    </ToolPageShell>
  );
}
