import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiMeetingActionsTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Meeting Notes to Action Items (Paid)",
  description: "Paste messy meeting notes and get clear decisions and action items with AI, so everybody knows who is doing what. One-time unlock, no subscription.",
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
