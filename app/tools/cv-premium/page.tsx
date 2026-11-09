import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CvPremiumTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/cv-premium" }, description: "Export your CV as a clean, professional PDF ready to send to employers, with a layout that reads well on phone and laptop. One-time unlock.", title: "CV Premium Export (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="CV Premium Export" subtitle="Pay to export premium CV PDF.">
      <CvPremiumTool />
    </ToolPageShell>
  );
}
