import { NextRequest, NextResponse } from "next/server";

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  product?: string;
  type?: "waitlist" | "purchase" | "maintenance" | "lead-magnet";
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadBody;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const product = (body.product || "General").trim();
    const type = body.type || "waitlist";

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and email or phone are required." },
        { status: 400 }
      );
    }

    // Structured log for Vercel — also ready for Resend/Supabase later
    console.log(
      JSON.stringify({
        event: "doyintech_lead",
        type,
        product,
        name,
        email,
        phone,
        message: body.message || "",
        at: new Date().toISOString(),
      })
    );

    const waText = encodeURIComponent(
      `New ${type} lead\nProduct: ${product}\nName: ${name}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n${body.message || ""}`
    );

    return NextResponse.json({
      ok: true,
      message:
        "Saved. We’ll follow up on WhatsApp/email. You can also message us now.",
      whatsapp: `https://wa.me/2348085343926?text=${waText}`,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
