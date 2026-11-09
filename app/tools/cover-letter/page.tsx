import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CoverLetterTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Cover Letter Generator for Job Applications",
  description: "Draft a professional cover letter for a job application, then fill it in with your real achievements. Free, with a clear structure employers expect.",
  alternates: { canonical: "/tools/cover-letter" },
};

export default function Page() {
  return (
    <ToolPageShell title="Cover Letter Generator" subtitle="Build a simple, honest draft — edit before you send.">
      <CoverLetterTool />
    </ToolPageShell>
  );
}
