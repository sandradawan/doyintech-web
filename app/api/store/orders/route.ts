import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { dbListOrdersByEmail } from "@/lib/store/orders-reviews";
import { getPublishedBySlug } from "@/lib/store/published";
import { SITE_URL } from "@/lib/site";

const GENERIC_REPLY = {
  ok: true,
  message:
    "If there are purchases for that email, we've sent the download links to it. Check your inbox and spam folder.",
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Purchase recovery. Download links are emailed to the address rather than returned,
 * so typing someone else's email reveals nothing. The response is identical either way.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`store-orders:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const perEmail = rateLimit(`store-orders-email:${email}`, 3, 60 * 60 * 1000);
  if (!perEmail.ok) return NextResponse.json(GENERIC_REPLY);

  const rows = await dbListOrdersByEmail(email);
  const items = (
    await Promise.all(
      rows.map(async (o) => {
        const slug = o.listing_slug || "";
        const token = o.download_token;
        const exp = o.download_expires_at ? new Date(o.download_expires_at).getTime() : 0;
        if (!slug || !token || (exp && Date.now() >= exp)) return null;
        const listing = await getPublishedBySlug(slug);
        return {
          title: listing?.title || slug,
          url: `${SITE_URL}/api/store/file?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
        };
      })
    )
  ).filter((x): x is { title: string; url: string } => x !== null);

  const key = process.env.RESEND_API_KEY;
  if (items.length > 0 && key) {
    try {
      const from =
        process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
      await new Resend(key).emails.send({
        from,
        to: email,
        subject: "Your DoyinStore download links",
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
          <p>Here are your active DoyinStore downloads:</p>
          <ul>${items
            .map((i) => `<li><a href="${i.url}">${escapeHtml(i.title)}</a></li>`)
            .join("")}</ul>
          <p style="color:#64748b;font-size:13px">Links expire for security. If you didn't request this, you can ignore it.</p>
          <p>— DoyinTech</p>
        </div>`,
        text: `Your DoyinStore downloads:\n\n${items.map((i) => `${i.title}: ${i.url}`).join("\n")}\n`,
      });
    } catch (e) {
      console.error("store orders email", e);
    }
  }

  return NextResponse.json(GENERIC_REPLY);
}
