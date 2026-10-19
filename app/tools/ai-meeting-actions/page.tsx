import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiMeetingActionsTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Meeting → Actions (Paid)",
  description: "Turn messy meeting notes into decisions and action items with AI.",
  alternates: { canonical: "/tools/ai-meeting-actions" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Meeting → Actions"
      subtitle="Turn messy notes into decisions and owners."
    >
      <AiMeetingActionsTool />
    </ToolPageShell>
  );
}
