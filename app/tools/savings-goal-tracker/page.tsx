import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SavingsGoalTrackerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Savings Goal Tracker (Free)",
  description: "Set a savings target and track your deposits on this device. See how close you are and how much more you need. Free, with no account needed.",
  alternates: { canonical: "/tools/savings-goal-tracker" },
};

export default function Page() {
  return (
    <ToolPageShell title="Savings Goal Tracker" subtitle="Goal progress bar saved in your browser.">
      <SavingsGoalTrackerTool />
    </ToolPageShell>
  );
}
