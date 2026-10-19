import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RandomPickerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Random Decision Picker (Free)",
  description: "List options and pick one at random. Free decision spinner.",
  alternates: { canonical: "/tools/random-picker" },
};

export default function Page() {
  return (
    <ToolPageShell title="Random Decision Picker" subtitle="Stuck choosing? Spin a random option.">
      <RandomPickerTool />
    </ToolPageShell>
  );
}
