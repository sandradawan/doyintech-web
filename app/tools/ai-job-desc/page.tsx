import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiJobDescTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Job Description Writer (Paid)",
  description: "Write a clear, hire-ready job description with AI in minutes: duties, requirements and how to apply. One-time unlock, no subscription.",
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
