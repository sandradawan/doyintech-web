import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PositionRiskTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = {
  title: "Position Size & Risk Calculator",
  description: "Educational position sizing by account risk %. Not financial advice.",
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
