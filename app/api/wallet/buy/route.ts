import { NextResponse } from "next/server";
import { getUserFromRequest, ensureProfileWallet } from "@/lib/bills/session";
import { buyFromWallet } from "@/lib/bills/wallet";
import type { NetworkId } from "@/lib/bills/catalog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: {
    kind?: "airtime" | "data";
    network?: NetworkId;
    phone?: string;
    amount?: number;
    variation_code?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.kind !== "airtime" && body.kind !== "data") {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }
  if (!body.network || !body.phone) {
    return NextResponse.json({ error: "Network and phone required" }, { status: 400 });
  }

  try {
    await ensureProfileWallet(user.id, user.email);
    const result = await buyFromWallet({
      userId: user.id,
      kind: body.kind,
      network: body.network,
      phone: body.phone,
      amountNaira: body.amount,
      variation_code: body.variation_code,
    });
    return NextResponse.json(result);
  } catch (e) {
    const err = e as Error & { code?: string };
    const status = err.code === "INSUFFICIENT" ? 402 : 400;
    return NextResponse.json({ error: err.message || "Purchase failed" }, { status });
  }
}
