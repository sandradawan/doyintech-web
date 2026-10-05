import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { reviewNotifyTemplate } from "@/lib/email/templates";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type Body = {
  name?: string;
  business?: string;
  rating?: number;
  body?: string;
  permission?: boolean;
  website?: string;
};

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`reviews:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const data = (await req.json()) as Body;
    if (data.website) return NextResponse.json({ ok: true });

    const name = (data.name || "").trim().slice(0, 80);
    const business = (data.business || "").trim().slice(0, 120);
    const body = (data.body || "").trim().slice(0, 2000);
    const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));
    const permission = Boolean(data.permission);

    if (!name || body.length < 20) {
      return NextResponse.json(
        { error: "Name and a short review (20+ characters) are required." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL || "hello@doyintech.com";
    const from =
      process.env.CONTACT_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>";

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const notify = reviewNotifyTemplate({
        name,
        business: business || undefined,
        rating,
        body,
        permission,
      });
      await resend.emails.send({
        from,
        to: [to],
        subject: notify.subject,
        html: notify.html,
        text: notify.text,
      });
    }

    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.doyintech.com";
      await fetch(`${origin}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: "",
          product: "Site review",
          type: "lead-magnet",
          source: "review-form",
          message: `Rating ${rating}/5. Publish: ${permission ? "yes" : "no"}. ${business ? `Biz: ${business}. ` : ""}${body}`,
        }),
      });
    } catch {
      /* non-fatal */
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
