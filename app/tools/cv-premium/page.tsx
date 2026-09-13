import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CvPremiumTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "CV Premium Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="CV Premium Export" subtitle="Pay to export premium CV PDF.">
      <CvPremiumTool />
    </ToolPageShell>
  );
}
