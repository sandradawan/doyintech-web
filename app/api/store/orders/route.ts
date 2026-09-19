import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { dbListOrdersByEmail } from "@/lib/store/orders-reviews";
import { getPublishedBySlug } from "@/lib/store/published";

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`store-orders:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const email = (req.nextUrl.searchParams.get("email") || "").trim().toLowerCase();
  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const rows = await dbListOrdersByEmail(email);
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://doyintech.vercel.app";

  const orders = await Promise.all(
    rows.map(async (o) => {
      const slug = o.listing_slug || "";
      const listing = slug ? await getPublishedBySlug(slug) : null;
      const token = o.download_token;
      const exp = o.download_expires_at ? new Date(o.download_expires_at).getTime() : 0;
      const valid = token && (!exp || Date.now() < exp);
      return {
        id: o.id,
        slug,
        title: listing?.title || slug || "Product",
        amountNgn: Math.round((o.amount_kobo || 0) / 100),
        status: o.status,
        createdAt: (o.created_at || "").slice(0, 10),
        downloadUrl:
          valid && slug
            ? `${origin}/api/store/file?token=${encodeURIComponent(token!)}&slug=${encodeURIComponent(slug)}`
            : null,
        expired: Boolean(token && exp && Date.now() >= exp),
      };
    })
  );

  return NextResponse.json({ orders });
}
