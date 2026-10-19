import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { MeetingCostCalculatorTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Meeting Cost Calculator (Free)",
  description: "Estimate the Naira cost of a meeting from people, rate, and duration.",
  alternates: { canonical: "/tools/meeting-cost-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Meeting Cost Calculator" subtitle="How much is this meeting really costing?">
      <MeetingCostCalculatorTool />
    </ToolPageShell>
  );
}
