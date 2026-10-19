import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiSocialCalendarTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Social Content Calendar (Paid)",
  description: "Plan weeks of social posts with AI. One-time unlock.",
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
