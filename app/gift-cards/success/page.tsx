import type { Metadata } from "next";
import GiftCardSuccess from "@/components/giftcards/GiftCardSuccess";

export const metadata: Metadata = { title: "Your gift card", robots: { index: false, follow: false } };

export default function GiftCardSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
        <GiftCardSuccess />
      </div>
    </main>
  );
}
