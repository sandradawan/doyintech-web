import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SignalExplainerTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = {
  title: "Signal Explainer (Educational)",
  description: "Learn how moving-average stacks are described in textbooks. Not signals to trade.",
};

export default function Page() {
  return (
    <ToolPageShell
      title="Signal Explainer"
      subtitle="Educational moving-average examples — not live data, not financial advice."
    >
      <SignalExplainerTool />
    </ToolPageShell>
  );
}
