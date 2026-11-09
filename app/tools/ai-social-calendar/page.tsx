import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiSocialCalendarTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Social Content Calendar (Paid)",
  description: "Plan weeks of social media posts for your business with AI, with ideas and captions for each day. One-time unlock, no subscription.",
  alternates: { canonical: "/tools/ai-social-calendar" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Social Content Calendar"
      subtitle="Plan weeks of posts with AI — unlock full calendar."
    >
      <AiSocialCalendarTool />
    </ToolPageShell>
  );
}
