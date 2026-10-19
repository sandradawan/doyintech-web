import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiJobDescTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Job Description Writer (Paid)",
  description: "Hire-ready job descriptions generated with AI.",
  alternates: { canonical: "/tools/ai-job-desc" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Job Description Writer"
      subtitle="Hire-ready JDs generated with AI."
    >
      <AiJobDescTool />
    </ToolPageShell>
  );
}
