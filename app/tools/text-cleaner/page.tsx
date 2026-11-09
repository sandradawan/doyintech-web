import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import TextCleanerTool from "@/components/tools/TextCleanerTool";

export const metadata: Metadata = { alternates: { canonical: "/tools/text-cleaner" },
  title: "Text Cleaner (Free)",
  description: "Trim spaces, remove extra line breaks and tidy pasted text for WhatsApp, Word or your website. Paste it in, then copy the clean result. Free.",
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
