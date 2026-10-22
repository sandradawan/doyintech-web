import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { safeSearch } from "@/lib/admin/crud";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact 360.
 * GET ?q=ada        → people matching a name, phone, company or partial email (from leads + subscribers)
 * GET ?email=a@b.co → everything we know about that person across the site
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const email = (req.nextUrl.searchParams.get("email") || "").trim().toLowerCase();
  if (!email) {
    const q = safeSearch(req.nextUrl.searchParams.get("q") || "");
    if (q.length < 2) return NextResponse.json({ people: [] });
    const [leads, subs] = await Promise.all([
      sb
        .from("site_leads")
        .select("name, email, phone, company")
        .or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,company.ilike.%${q}%`)
        .not("email", "is", null)
        .limit(30),
      sb.from("email_subscribers").select("name, email").or(`email.ilike.%${q}%,name.ilike.%${q}%`).limit(30),
    ]);
    const people = new Map<string, { email: string; name: string | null; detail: string | null }>();
    for (const l of leads.data || []) {
      const e = String(l.email).toLowerCase();
      if (!people.has(e)) people.set(e, { email: e, name: l.name, detail: l.company || l.phone || null });
    }
    for (const s of subs.data || []) {
      const e = String(s.email).toLowerCase();
      if (!people.has(e)) people.set(e, { email: e, name: s.name, detail: "Email subscriber" });
    }
    return NextResponse.json({ people: [...people.values()].slice(0, 30) });
  }

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  // Case-insensitive match for tables that stored emails as typed. Only plain addresses go into filter strings.
  const plain = /^[a-z0-9._+@-]+$/.test(email);
  const safe = email.replace(/[\\%_]/g, (c) => `\\${c}`);
  const [leads, subscriber, subscriptions, payments, reports, students, shops, shopOrders] = await Promise.all([
    sb
      .from("site_leads")
      .select("id, name, company, phone, product, type, status, value_ngn, next_follow_up, source, message, created_at")
      .ilike("email", safe)
      .order("created_at", { ascending: false }),
    sb
      .from("email_subscribers")
      .select("id, name, sequence, step, next_send_at, unsubscribed_at, converted_at, source, created_at")
      .eq("email", email)
      .maybeSingle(),
    sb.from("subscriptions").select("id, plan_id, status, amount_kobo, next_payment_date, created_at").eq("email", email),
    sb.from("payment_claims").select("reference, product_id, amount_kobo, created_at").eq("email", email).order("created_at", { ascending: false }),
    sb.from("report_orders").select("id, order_id, product_name, status, price_ngn, created_at").ilike("email", safe),
    sb.from("student_projects").select("id, request_id, package_name, status, amount_ngn, created_at").ilike("email", safe),
    sb.from("storefronts").select("id, name, slug, payments_status, is_published, created_at").eq("owner_email", email),
    sb.from("storefront_orders").select("id, reference, amount_kobo, status, created_at").eq("customer_email", email).limit(20),
  ]);

  const leadIds = (leads.data || []).map((l) => l.id);
  const activitiesQuery = sb
    .from("crm_activities")
    .select("id, lead_id, kind, body, due_at, done, created_by, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const activities =
    leadIds.length && plain
      ? await activitiesQuery.or(`contact_email.eq.${email},lead_id.in.(${leadIds.join(",")})`)
      : await activitiesQuery.eq("contact_email", email);

  const lead = leads.data?.[0];
  const productSpend = (payments.data || [])
    .filter((p) => p.product_id)
    .reduce((n, p) => n + (Number(p.amount_kobo) || 0), 0);

  return NextResponse.json({
    email,
    name: lead?.name || subscriber.data?.name || null,
    phone: lead?.phone || null,
    company: lead?.company || null,
    productSpendKobo: productSpend,
    leads: leads.data || [],
    subscriber: subscriber.data || null,
    subscriptions: subscriptions.data || [],
    payments: payments.data || [],
    reports: reports.data || [],
    students: students.data || [],
    shops: shops.data || [],
    shopOrders: shopOrders.data || [],
    activities: activities.data || [],
  });
}
