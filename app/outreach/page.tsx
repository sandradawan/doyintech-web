import type { Metadata } from "next";
import OutreachConsole from "@/components/outreach/OutreachConsole";

export const metadata: Metadata = {
  title: "Outreach console",
  description:
    "Send DoyinTech outreach templates via WhatsApp or email — pick a message, fill details, send.",
  robots: { index: false, follow: false },
};

export default function OutreachPage() {
  return (
    <div className="min-h-screen bg-brand-deepest px-4 pb-20 pt-24">
      <OutreachConsole />
    </div>
  );
}
