import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

type Row = {
  name: string;
  label: string | null;
  path: string | null;
  value_kobo: number | null;
  utm_source: string | null;
  created_at: string;
};

function top(rows: Row[], key: (r: Row) => string | null, n = 10) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (k) counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, count]) => ({ key: k, count }));
}

/** Conversion totals, daily trend, best pages/sources and email sequence health for the admin view. */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const days = Math.min(90, Math.max(1, Number(req.nextUrl.searchParams.get("days")) || 30));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [eventsRes, subsRes] = await Promise.all([
    sb
      .from("site_events")
      .select("name, label, path, value_kobo, utm_source, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(20000),
    sb.from("email_subscribers").select("sequence, next_send_at, unsubscribed_at, converted_at").limit(20000),
  ]);
  if (eventsRes.error) {
    return NextResponse.json(
      { error: `site_events: ${eventsRes.error.message}. Run supabase/migrations/005_conversions.sql.` },
      { status: 500 }
    );
  }

  const events = (eventsRes.data || []) as Row[];
  const totals: Record<string, number> = {};
  let revenueKobo = 0;
  for (const e of events) {
    totals[e.name] = (totals[e.name] || 0) + 1;
    if (e.name === "payment" || e.name === "subscription_payment") revenueKobo += e.value_kobo || 0;
  }

  // Daily trend of the three numbers that matter most.
  const daily: { date: string; leads: number; whatsapp: number; payments: number }[] = [];
  const index = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    index.set(date, daily.length);
    daily.push({ date, leads: 0, whatsapp: 0, payments: 0 });
  }
  for (const e of events) {
    const i = index.get(e.created_at.slice(0, 10));
    if (i === undefined) continue;
    if (e.name === "lead") daily[i].leads++;
    else if (e.name === "whatsapp_click") daily[i].whatsapp++;
    else if (e.name === "payment" || e.name === "subscription_payment") daily[i].payments++;
  }

  const enquiries = events.filter((e) => e.name === "lead" || e.name === "whatsapp_click");
  const sales = events.filter((e) => e.name === "payment" || e.name === "subscription_payment");

  const sequences: Record<string, { active: number; finished: number; converted: number; unsubscribed: number }> = {};
  if (!subsRes.error) {
    for (const s of subsRes.data || []) {
      const k = (s.sequence as string) || "general";
      const b = (sequences[k] ||= { active: 0, finished: 0, converted: 0, unsubscribed: 0 });
      if (s.unsubscribed_at) b.unsubscribed++;
      else if (s.converted_at) b.converted++;
      else if (s.next_send_at) b.active++;
      else b.finished++;
    }
  }

  return NextResponse.json({
    ok: true,
    days,
    totals,
    revenueKobo,
    daily,
    enquiryPages: top(enquiries, (e) => e.path),
    salePages: top(sales, (e) => e.label),
    sources: top(
      events.filter((e) => e.name === "lead" || e.name === "payment" || e.name === "checkout_start" || e.name === "whatsapp_click"),
      (e) => e.utm_source
    ),
    downloads: top(events.filter((e) => e.name === "tool_download"), (e) => e.path),
    sequences,
    truncated: events.length >= 20000,
  });
}
