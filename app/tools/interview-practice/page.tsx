import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { InterviewTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Tech Interview Practice Questions",
  description: "Practice common backend, frontend, mobile, and general interview questions.",
  alternates: { canonical: "/tools/interview-practice" },
};

export default function Page() {
  return (
    <ToolPageShell title="Interview Practice" subtitle="Work through role-based questions. Say answers out loud — that is the real practice.">
      <InterviewTool />
    </ToolPageShell>
  );
}
