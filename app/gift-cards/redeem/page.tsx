import type { Metadata } from "next";
import Link from "next/link";
import GiftCardRedeem from "@/components/giftcards/GiftCardRedeem";

export const metadata: Metadata = {
  title: "Check gift card balance",
  description: "Check your DoyinTech gift card balance and use it at checkout.",
  alternates: { canonical: "/gift-cards/redeem" },
};

export default function GiftCardRedeemPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">Gift cards</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white">Use a gift card</h1>
        <p className="mt-2 max-w-xl text-[16px] text-[#a1a1a6]">
          Enter your code to see the balance, then apply it: it&apos;s used automatically when you pay for anything on DoyinTech.{" "}
          <Link href="/gift-cards" className="text-[#ff8c14] hover:underline">
            Buy a gift card
          </Link>
        </p>
        <div className="mt-8">
          <GiftCardRedeem />
        </div>
      </div>
    </main>
  );
}
