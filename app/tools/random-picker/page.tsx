import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RandomPickerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Random Decision Picker (Free)",
  description: "List your options and let the picker choose one at random. A free online decision spinner for raffles, classroom turns and hard choices.",
  alternates: { canonical: "/tools/random-picker" },
};

export default function Page() {
  return (
    <ToolPageShell title="Random Decision Picker" subtitle="Stuck choosing? Spin a random option.">
      <RandomPickerTool />
    </ToolPageShell>
  );
}
