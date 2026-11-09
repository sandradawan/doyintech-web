import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PaperJournalTool } from "@/components/tools/MarketTools";

export const metadata: Metadata = { alternates: { canonical: "/tools/paper-journal" },
  title: "Paper Trading Journal",
  description: "Log simulated trades and session statistics to practise your discipline without risking money. Educational only and not financial advice.",
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
