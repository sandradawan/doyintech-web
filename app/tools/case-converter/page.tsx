import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CaseConverterTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Case Converter — Uppercase Lowercase (Free)",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case, or Sentence case online.",
  alternates: { canonical: "/tools/case-converter" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Case Converter"
      subtitle="UPPER, lower, Title, and Sentence case in one click."
    >
      <CaseConverterTool />
    </ToolPageShell>
  );
}
