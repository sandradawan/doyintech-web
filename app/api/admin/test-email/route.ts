import { NextRequest, NextResponse } from "next/server";

function adminOk(req: NextRequest) {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("x-admin-secret") || "") === secret;
}

/** POST — send a Resend test message to hello@doyintech.com (or body.to). */
export async function POST(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured on this deployment" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const to = String(body.to || "hello@doyintech.com")
      .trim()
      .toLowerCase();
    if (!to.includes("@")) {
      return NextResponse.json({ error: "Invalid to address" }, { status: 400 });
    }

    const fromRaw =
      process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
    const from = fromRaw.includes("<")
      ? fromRaw
      : `DoyinTech <${fromRaw}>`;

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: "DoyinTech test email — Resend is working",
      text: [
        "This is a test email from the DoyinTech admin endpoint.",
        "",
        "If you received this, Resend is configured correctly.",
        "",
        "Student portal highlights:",
        "• Research projects ₦15k–₦30k",
        "• 50% deposit to start, 50% before download unlocks",
        "• Request ID tracking (DT-PRJ-YYYY-NNNN)",
        "• Stage pipeline + feedback box",
        "• Paystack payment links emailed from CRM",
        "",
        "Portal: https://www.doyintech.com/students/projects",
        "Track: https://www.doyintech.com/students/projects/track",
        "",
        `Sent at: ${new Date().toISOString()}`,
        "— DoyinTech systems",
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Resend error", details: error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      to,
      from,
      id: data?.id || null,
      message: "Test email sent",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Send failed" },
      { status: 500 }
    );
  }
}
