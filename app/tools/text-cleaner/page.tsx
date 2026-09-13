import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import TextCleanerTool from "@/components/tools/TextCleanerTool";

export const metadata: Metadata = {
  title: "Text Cleaner (Free)",
  description: "Trim spaces, remove extra line breaks, and normalize text for WhatsApp, email, and docs.",
};

export default function Page() {
  return (
    <ToolPageShell
      title="Text Cleaner"
      subtitle="Free utility — clean messy text for WhatsApp, email, and documents."
    >
      <TextCleanerTool />
    </ToolPageShell>
  );
}
