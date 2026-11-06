import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type Body = { name?: string; email?: string; show?: string; link?: string; plan?: string; website?: string };

const PLANS: Record<string, string> = { listing: "Free listing", featured: "Paid featured spot", suggestion: "Listener suggestion" };

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(`listen-submit:${clientIp(req)}`, 5, 60 * 60 * 1000);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });

    const data = (await req.json()) as Body;
    if (data.website) return NextResponse.json({ ok: true });

    const name = (data.name || "").trim().slice(0, 80);
    const email = (data.email || "").trim().slice(0, 120);
    const show = (data.show || "").trim().slice(0, 120);
    const link = (data.link || "").trim().slice(0, 300);
    const plan = PLANS[data.plan || ""] || PLANS.listing;

    if (!name || !show || !/^\S+@\S+\.\S+$/.test(email) || !/^https?:\/\/\S+$/i.test(link)) {
      return NextResponse.json({ error: "Please add your name, email, podcast name and a full link." }, { status: 400 });
    }

    const summary = `${plan}\nPodcast: ${show}\nLink: ${link}\nFrom: ${name} <${email}>`;

    if (process.env.RESEND_API_KEY) {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || "hello@doyintech.com"],
        replyTo: email,
        subject: `Listen: ${plan} for ${show}`,
        text: summary,
      });
    }

    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.doyintech.com";
      await fetch(`${origin}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, product: "DoyinTech Listen", type: "lead-magnet", source: "listen-submit", message: summary }),
      });
    } catch {
      /* non-fatal */
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
