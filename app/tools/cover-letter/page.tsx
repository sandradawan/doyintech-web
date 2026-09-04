import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CoverLetterTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
  description: "Draft a professional cover letter structure for job applications. Use your real achievements only.",
  alternates: { canonical: "/tools/cover-letter" },
};

export default function Page() {
  return (
    <ToolPageShell title="Cover Letter Generator" subtitle="Build a simple, honest draft — edit before you send.">
      <CoverLetterTool />
    </ToolPageShell>
  );
}
