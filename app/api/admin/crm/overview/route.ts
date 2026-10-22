import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { LEAD_STAGES } from "@/lib/admin/resources";

export const runtime = "nodejs";

const DAY = 86_400_000;
const iso = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  product: string | null;
  status: string;
  value_ngn: number | null;
  next_follow_up: string | null;
  created_at: string;
};

/** Everything the CRM home screen needs in one call. Each block degrades to null if its table is missing. */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const today = new Date().toISOString().slice(0, 10);
  const endOfToday = `${today}T23:59:59.999Z`;

  const [leadsRes, tasksRes, eventsRes, subsRes, shopsRes, shopOrdersRes, listRes, auditRes] = await Promise.all([
    sb
      .from("site_leads")
      .select("id, name, company, email, product, status, value_ngn, next_follow_up, created_at")
      .order("created_at", { ascending: false })
      .limit(3000),
    sb
      .from("crm_activities")
      .select("id, kind, body, due_at, lead_id, contact_email")
      .eq("done", false)
      .not("due_at", "is", null)
      .lte("due_at", endOfToday)
      .order("due_at", { ascending: true })
      .limit(25),
    sb
      .from("site_events")
      .select("name, value_kobo, created_at")
      .in("name", ["payment", "subscription_payment", "lead", "whatsapp_click"])
      .gte("created_at", iso(60 * DAY))
      .limit(20000),
    sb.from("subscriptions").select("plan_id, status, amount_kobo").in("status", ["active", "non-renewing", "attention"]),
    sb.from("storefronts").select("payments_status"),
    sb.from("storefront_orders").select("platform_fee_kobo, paid_at").eq("status", "paid").gte("paid_at", iso(30 * DAY)),
    sb.from("email_subscribers").select("id", { count: "exact", head: true }).is("unsubscribed_at", null),
    sb.from("admin_audit_log").select("actor, action, resource, record_id, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  // Pipeline
  const leads = (leadsRes.data || []) as Lead[];
  const stages = LEAD_STAGES.map((stage) => {
    const inStage = leads.filter((l) => (l.status || "new") === stage);
    return { stage, count: inStage.length, value: inStage.reduce((n, l) => n + (Number(l.value_ngn) || 0), 0) };
  });
  const open = leads.filter((l) => l.status !== "won" && l.status !== "lost");
  const followUps = open
    .filter((l) => l.next_follow_up && l.next_follow_up <= today)
    .sort((a, b) => (a.next_follow_up! < b.next_follow_up! ? -1 : 1))
    .slice(0, 20);

  // Revenue (our own sales from conversion events) — this 30 days vs the previous 30.
  const events = (eventsRes.data || []) as { name: string; value_kobo: number | null; created_at: string }[];
  const cut = iso(30 * DAY);
  const sum = (names: string[], recent: boolean) =>
    events
      .filter((e) => names.includes(e.name) && (recent ? e.created_at >= cut : e.created_at < cut))
      .reduce((n, e) => n + (e.value_kobo || 0), 0);
  const count = (name: string, recent: boolean) => events.filter((e) => e.name === name && (recent ? e.created_at >= cut : e.created_at < cut)).length;

  const subs = (subsRes.data || []) as { plan_id: string; status: string; amount_kobo: number | null }[];
  const mrrKobo = subs.reduce((n, s) => n + Math.round((s.amount_kobo || 0) / (s.plan_id.includes("annual") ? 12 : 1)), 0);
  const shops = (shopsRes.data || []) as { payments_status: string }[];
  const shopFees = ((shopOrdersRes.data || []) as { platform_fee_kobo: number | null }[]).reduce((n, o) => n + (o.platform_fee_kobo || 0), 0);

  return NextResponse.json({
    pipeline: leadsRes.error ? null : { stages, openCount: open.length, openValue: open.reduce((n, l) => n + (Number(l.value_ngn) || 0), 0) },
    leads: leadsRes.error
      ? null
      : {
          new7: leads.filter((l) => l.created_at >= iso(7 * DAY)).length,
          new30: leads.filter((l) => l.created_at >= cut).length,
          recent: leads.slice(0, 8),
          followUps,
        },
    tasks: tasksRes.error ? null : tasksRes.data,
    revenue: eventsRes.error
      ? null
      : {
          last30: sum(["payment", "subscription_payment"], true),
          prev30: sum(["payment", "subscription_payment"], false),
          payments30: count("payment", true) + count("subscription_payment", true),
          enquiries30: count("lead", true) + count("whatsapp_click", true),
          enquiriesPrev30: count("lead", false) + count("whatsapp_click", false),
        },
    subscriptions: subsRes.error ? null : { active: subs.length, mrrKobo },
    store: shopsRes.error
      ? null
      : {
          shops: shops.length,
          pendingApproval: shops.filter((s) => s.payments_status === "pending_review").length,
          fees30: shopFees,
        },
    subscribers: listRes.error ? null : listRes.count ?? 0,
    audit: auditRes.error ? null : auditRes.data,
  });
}
