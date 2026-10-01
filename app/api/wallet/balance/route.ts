import { NextResponse } from "next/server";
import { getUserFromRequest, ensureProfileWallet } from "@/lib/bills/session";
import { getBalanceKobo } from "@/lib/bills/wallet";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  try {
    await ensureProfileWallet(user.id, user.email);
    const balance_kobo = await getBalanceKobo(user.id);
    return NextResponse.json({
      balance_kobo,
      balance_naira: balance_kobo / 100,
      user_id: user.id,
      email: user.email,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Could not load balance" },
      { status: 500 }
    );
  }
}
