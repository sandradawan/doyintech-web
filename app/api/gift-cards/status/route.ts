import { NextRequest, NextResponse } from "next/server";
import { GIFT_PURCHASE_REF_RE, activateGiftCard, cardByPurchaseRef } from "@/lib/giftcards/server";
import { fetchPaystackTransaction } from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";

/** Buyer's return page: confirms payment with Paystack if needed, then returns the card (code once active). */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "gift-status", 40, 60_000);
  if (limited) return limited;
  const reference = req.nextUrl.searchParams.get("reference") || "";
  if (!GIFT_PURCHASE_REF_RE.test(reference)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  let card = await cardByPurchaseRef(reference);
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (card.status === "pending") {
    const tx = await fetchPaystackTransaction(reference);
    if (tx && (await activateGiftCard(tx))) card = await cardByPurchaseRef(reference);
  }
  return NextResponse.json({ card }, { headers: { "Cache-Control": "private, no-store" } });
}
