import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { TradeChecklistTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = { alternates: { canonical: "/tools/trade-checklist" },
  title: "Pre-Trade Checklist",
  description: "A discipline checklist to go through before any trade, for educational risk awareness. It is for learning only and is not financial advice.",
};

export default function Page() {
  return (
    <ToolPageShell
      title="Pre-Trade Checklist"
      subtitle="Confirm risk hygiene before you trade — still not a profit guarantee."
    >
      <TradeChecklistTool />
    </ToolPageShell>
  );
}
