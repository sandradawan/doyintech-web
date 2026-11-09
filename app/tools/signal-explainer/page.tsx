import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SignalExplainerTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = { alternates: { canonical: "/tools/signal-explainer" },
  title: "Signal Explainer (Educational)",
  description: "Learn how moving-average stacks are described in textbooks. This is an educational explainer only, not trading signals or financial advice.",
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
