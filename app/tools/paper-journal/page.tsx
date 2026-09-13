import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PaperJournalTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = {
  title: "Paper Trading Journal",
  description: "Log simulated trades and session stats. Educational only.",
};

export default function Page() {
  return (
    <ToolPageShell
      title="Paper Trading Journal"
      subtitle="Practice journaling with simulated trades — no real orders."
    >
      <PaperJournalTool />
    </ToolPageShell>
  );
}
