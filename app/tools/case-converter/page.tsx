import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CaseConverterTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Case Converter: Uppercase, Lowercase and Title Case",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case or Sentence case online. Paste your text and copy the result. Free, with no sign-up needed.",
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
