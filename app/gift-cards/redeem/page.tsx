import type { Metadata } from "next";
import Link from "next/link";
import GiftCardRedeem from "@/components/giftcards/GiftCardRedeem";

export const metadata: Metadata = {
  title: "Check Your Gift Card Balance",
  description: "Enter your DoyinTech gift card code to check the balance you have left, then use it at checkout on any website package, tool or template.",
  alternates: { canonical: "/gift-cards/redeem" },
};

export default function GiftCardRedeemPage() {
  return (
    <main className="min-h-screen bg-brand-deep pb-24 pt-28">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-link">Gift cards</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-brand-ink">Use a gift card</h1>
        <p className="mt-2 max-w-xl text-[16px] text-brand-muted">
          Enter your code to see the balance, then apply it: it&apos;s used automatically when you pay for anything on DoyinTech.{" "}
          <Link href="/gift-cards" className="text-brand-link hover:underline">
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
