import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RoiTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Website ROI Calculator",
  description: "Estimate return on investment for a new website or digital upgrade using simple revenue assumptions.",
  alternates: { canonical: "/tools/roi-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Website ROI Calculator" subtitle="Illustrative model to discuss whether a site investment can pay back — not financial advice.">
      <RoiTool />
    </ToolPageShell>
  );
}
