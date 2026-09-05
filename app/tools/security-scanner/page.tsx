import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import SecurityScanner from "@/components/tools/SecurityScanner";

export const metadata: Metadata = {
  title: "Website Security Scanner — Bug & Vulnerability Report",
  description:
    "Scan any website URL with a visual laser pass, see highlighted risk markers, and download a PDF vulnerability report. Educational security tool by DoyinTech.",
  alternates: { canonical: "/tools/security-scanner" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Website Security Scanner"
      subtitle="Enter a URL, watch the green laser sweep the site preview, and download a bug & vulnerability PDF report."
    >
      <SecurityScanner />
    </ToolPageShell>
  );
}
