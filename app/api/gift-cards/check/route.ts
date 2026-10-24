import { NextRequest, NextResponse } from "next/server";
import { checkGiftCode } from "@/lib/giftcards/server";
import { limitRequest } from "@/lib/rate-limit";

/** Balance check. Strictly rate-limited; unknown codes get the same answer as malformed ones. */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "gift-check", 15, 60_000);
  if (limited) return limited;
  const card = await checkGiftCode(req.nextUrl.searchParams.get("code") || "").catch(() => null);
  if (!card) return NextResponse.json({ error: "We couldn't find that gift card. Check the code and try again." }, { status: 404 });
  return NextResponse.json({ card }, { headers: { "Cache-Control": "private, no-store" } });
}
