import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { DailyChecklistTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Daily Checklist (Free)",
  description: "A simple daily checklist saved on your device. Tick things off today, come back tomorrow and carry on. Free online, with no account needed.",
  alternates: { canonical: "/tools/daily-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="Daily Checklist" subtitle="Tasks for today — saved in this browser.">
      <DailyChecklistTool />
    </ToolPageShell>
  );
}
