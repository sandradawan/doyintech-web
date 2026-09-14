import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import OutreachHub from "@/components/outreach/OutreachHub";

export const metadata: Metadata = {
  title: "Outreach Hub (US & UK)",
  description: "Prospect tracker, message templates, and digital audit builder for client outreach.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Outreach Hub"
      subtitle="US & UK pipeline — prospects, messages, audits, daily plan. You send the messages."
    >
      <OutreachHub />
    </ToolPageShell>
  );
}
