import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { TradeChecklistTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = {
  title: "Pre-Trade Checklist",
  description: "Discipline checklist before any trade. Educational risk hygiene.",
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
