import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PositionRiskTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = { alternates: { canonical: "/tools/position-risk" },
  title: "Position Size & Risk Calculator",
  description: "Learn position sizing by account risk percentage with this educational calculator. It is for learning only and is not financial advice.",
};

export default function Page() {
  return (
    <ToolPageShell
      title="Position Size & Risk Calculator"
      subtitle="Size trades by % of equity risked — educational tool, not financial advice."
    >
      <PositionRiskTool />
    </ToolPageShell>
  );
}
