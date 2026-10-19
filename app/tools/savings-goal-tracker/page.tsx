import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SavingsGoalTrackerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Savings Goal Tracker (Free)",
  description: "Track a savings target on this device. Update deposits whenever you visit.",
  alternates: { canonical: "/tools/savings-goal-tracker" },
};

export default function Page() {
  return (
    <ToolPageShell title="Savings Goal Tracker" subtitle="Goal progress bar saved in your browser.">
      <SavingsGoalTrackerTool />
    </ToolPageShell>
  );
}
