import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import DailyProspecting from "@/components/outreach/DailyProspecting";

export const metadata: Metadata = {
  title: "Daily prospecting — 20 messages | DoyinTech",
  description:
    "Internal playbook: send 20 personalized WhatsApp messages per day using proven DoyinTech scripts.",
  robots: { index: false, follow: false },
};

export default function DailyOutreachPage() {
  return (
    <>
      <main className="min-h-screen bg-[#070b12] pb-24 pt-24">
        <DailyProspecting />
      </main>
      <Footer />
    </>
  );
}
