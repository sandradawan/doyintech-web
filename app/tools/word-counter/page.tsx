import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WordCounterTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "Word Counter — Free Character Counter",
  description:
    "Count words, characters, sentences, paragraphs and reading time online. Paste your text for an instant count. A free word counter with no sign-up.",
  alternates: { canonical: "/tools/word-counter" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Word Counter"
      subtitle="Words, characters, sentences, and estimated reading time."
    >
      <WordCounterTool />
    </ToolPageShell>
  );
}
