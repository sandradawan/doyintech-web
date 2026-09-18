import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  product?: string;
  type?: "waitlist" | "purchase" | "maintenance" | "lead-magnet" | "audit" | "chat" | "referral";
  message?: string;
  source?: string;
};

function adminOk(req: NextRequest) {
  const secret = process.env.ADMIN_LEADS_SECRET || process.env.LEADS_ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret") || "";
  const q = req.nextUrl.searchParams.get("secret") || "";
  return header === secret || q === secret;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadBody;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const product = (body.product || "General").trim();
    const type = body.type || "waitlist";
    const message = (body.message || "").trim();
    const source = (body.source || "website").trim();

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and email or phone are required." },
        { status: 400 }
      );
    }

    const row = {
      event: "doyintech_lead",
      type,
      product,
      name,
      email,
      phone,
      message,
      source,
      at: new Date().toISOString(),
    };
    console.log(JSON.stringify(row));

    const sb = getSupabaseAdmin();
    let savedId: string | null = null;
    if (sb) {
      const { data, error } = await sb
        .from("site_leads")
        .insert({
          type,
          product,
          name,
          email: email || null,
          phone: phone || null,
          message: message || null,
          source,
          status: "new",
        })
        .select("id")
        .single();
      if (!error && data?.id) savedId = data.id;
      else if (error) console.log(JSON.stringify({ event: "lead_supabase_error", error: error.message }));
    }

    const waText = encodeURIComponent(
      `New ${type} lead\nProduct: ${product}\nName: ${name}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n${message || ""}`
    );

    return NextResponse.json({
      ok: true,
      id: savedId,
      message:
        "Saved. We’ll follow up on WhatsApp/email. You can also message us now.",
      whatsapp: `https://wa.me/2348085343926?text=${waText}`,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/** List leads for admin inbox. Requires ADMIN_LEADS_SECRET. */
export async function GET(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      ok: true,
      leads: [],
      note: "Supabase not configured. Set SUPABASE_SERVICE_ROLE_KEY and run docs/site-leads.sql",
    });
  }

  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 50), 200);
  const status = req.nextUrl.searchParams.get("status") || "";
  const type = req.nextUrl.searchParams.get("type") || "";

  let q = sb.from("site_leads").select("*").order("created_at", { ascending: false }).limit(limit);
  if (status) q = q.eq("status", status);
  if (type) q = q.eq("type", type);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leads: data || [] });
}

/** Update lead status. Body: { id, status }. Requires ADMIN_LEADS_SECRET. */
export async function PATCH(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    const allowed = ["new", "contacted", "qualified", "won", "lost"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json(
        { error: "id and status (new|contacted|qualified|won|lost) required" },
        { status: 400 }
      );
    }

    const { data, error } = await sb
      .from("site_leads")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
