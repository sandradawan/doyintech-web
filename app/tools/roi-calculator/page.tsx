import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RoiTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Website ROI Calculator: Will a New Website Pay for Itself?",
  description: "Estimate the return on investment from a new website or digital upgrade using your own sales figures, so you can decide if the spend is worth it.",
  alternates: { canonical: "/tools/roi-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Website ROI Calculator" subtitle="Illustrative model to discuss whether a site investment can pay back — not financial advice.">
      <RoiTool />
    </ToolPageShell>
  );
}
