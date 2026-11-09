import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { MeetingCostCalculatorTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Meeting Cost Calculator (Free)",
  description: "Estimate what a meeting really costs in naira from the number of people, their pay and how long it runs. A quick way to shorten your next meeting.",
  alternates: { canonical: "/tools/meeting-cost-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Meeting Cost Calculator" subtitle="How much is this meeting really costing?">
      <MeetingCostCalculatorTool />
    </ToolPageShell>
  );
}
