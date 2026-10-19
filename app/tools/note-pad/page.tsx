import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { NotePadTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Browser Note Pad (Free)",
  description: "Quick notes saved in your browser. Free online notepad.",
  alternates: { canonical: "/tools/note-pad" },
};

export default function Page() {
  return (
    <ToolPageShell title="Note Pad" subtitle="Scratch pad that auto-saves on this device.">
      <NotePadTool />
    </ToolPageShell>
  );
}
