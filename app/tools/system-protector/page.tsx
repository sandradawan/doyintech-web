import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import SystemProtectorQuiz from "@/components/tools/SystemProtectorQuiz";

export const metadata: Metadata = {
  title: "System Protector — device & WhatsApp security score",
  description:
    "Free SME security hygiene quiz for phone, PC, and WhatsApp. Not a virus scanner — practical protector checklist from DoyinTech.",
};

export default function SystemProtectorPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="px-6">
          <SystemProtectorQuiz />
        </div>
      </main>
      <Footer />
    </>
  );
}
