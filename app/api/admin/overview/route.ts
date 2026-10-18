import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      ok: true,
      configured: false,
      note: "Supabase service role not configured",
      stats: null,
      modules: [],
    });
  }

  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [leadsRes, projectsRes, storeOrdersRes, storeListingsRes, storeDevsRes, opsWsRes] =
    await Promise.all([
      sb.from("site_leads").select("id, created_at, type, product, name, email, phone, status, source").order("created_at", { ascending: false }).limit(300),
      sb.from("student_projects").select("id, request_id, package_name, stage, status, name, email, amount_ngn, created_at").order("created_at", { ascending: false }).limit(200),
      sb.from("store_orders").select("id, created_at, status, amount_ngn, buyer_email, product_name").order("created_at", { ascending: false }).limit(100),
      sb.from("store_listings").select("id, title, status, created_at").order("created_at", { ascending: false }).limit(100),
      sb.from("store_developers").select("id, display_name, email, created_at").limit(100),
      sb.from("ops_workspaces").select("id, name, created_at").order("created_at", { ascending: false }).limit(50),
    ]);

  const leads = leadsRes.data || [];
  const projects = projectsRes.data || [];
  const storeOrders = storeOrdersRes.data || [];
  const listings = storeListingsRes.data || [];
  const developers = storeDevsRes.data || [];
  const workspaces = opsWsRes.data || [];

  const byStatus: Record<string, number> = { new: 0, contacted: 0, qualified: 0, won: 0, lost: 0 };
  const byType: Record<string, number> = {};
  let leads7 = 0;
  let leads30 = 0;
  for (const l of leads as Array<{ status: string; type?: string; created_at: string }>) {
    if (l.status in byStatus) byStatus[l.status]++;
    byType[l.type || "other"] = (byType[l.type || "other"] || 0) + 1;
    if (l.created_at >= since7) leads7++;
    if (l.created_at >= since30) leads30++;
  }

  let projectValueNgn = 0;
  let activeProjects = 0;
  const projectByStatus: Record<string, number> = {};
  for (const p of projects as Array<{ status: string; amount_ngn?: number }>) {
    projectByStatus[p.status || "unknown"] = (projectByStatus[p.status || "unknown"] || 0) + 1;
    projectValueNgn += Number(p.amount_ngn || 0);
    if (!["completed", "cancelled"].includes(p.status)) activeProjects++;
  }

  const storeOrderCount = storeOrders.length;
  const storeRevenue = (storeOrders as Array<{ amount_ngn?: number }>).reduce((s, o) => s + Number(o.amount_ngn || 0), 0);

  const needsAttention = [
    ...(leads as Array<Record<string, string>>).filter((l) => l.status === "new").slice(0, 8).map((l) => ({
      kind: "lead", id: l.id, title: l.name, subtitle: `${l.product} · ${l.type}`, status: l.status, at: l.created_at, href: "/admin/leads",
    })),
    ...(projects as Array<Record<string, string | number>>).filter((p) => ["pending_payment", "awaiting_balance", "in_progress"].includes(String(p.status))).slice(0, 6).map((p) => ({
      kind: "project", id: String(p.id), title: String(p.name), subtitle: `${p.package_name} · ${p.stage}`, status: String(p.status), at: String(p.created_at), href: "/admin/student-projects",
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 12);

  const recent = [
    ...(leads as Array<Record<string, string>>).slice(0, 8).map((l) => ({ kind: "lead", id: l.id, title: l.name, subtitle: `${l.product} · ${l.status}`, at: l.created_at, href: "/admin/leads" })),
    ...(projects as Array<Record<string, string>>).slice(0, 6).map((p) => ({ kind: "project", id: p.id, title: p.name, subtitle: `${p.package_name} · ${p.status}`, at: p.created_at, href: "/admin/student-projects" })),
    ...(storeOrders as Array<Record<string, string | number>>).slice(0, 6).map((o) => ({ kind: "order", id: String(o.id), title: String(o.product_name || "Store order"), subtitle: String(o.buyer_email || o.status || ""), at: String(o.created_at), href: "/admin/store" })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 16);

  const modules = [
    { id: "leads", title: "Leads & contact", desc: "Inquiries, audits, referrals, chat handoffs", href: "/admin/leads", metric: leads.length, metricLabel: "total" },
    { id: "students", title: "Student projects", desc: "Research pipeline & payments", href: "/admin/student-projects", metric: activeProjects, metricLabel: "active" },
    { id: "store", title: "DoyinStore", desc: "Listings, developers, app sales", href: "/admin/store", metric: listings.length, metricLabel: "listings" },
    { id: "orders", title: "Orders & sales", desc: "Store orders and revenue", href: "/admin/orders", metric: storeOrderCount, metricLabel: "orders" },
    { id: "ops", title: "DoyinOps", desc: "SME workspaces", href: "/admin/ops", metric: workspaces.length, metricLabel: "workspaces" },
    { id: "ai", title: "AI tools", desc: "Pitch, studio, report studio", href: "/admin/tools", metric: null, metricLabel: "open" },
    { id: "content", title: "Site content", desc: "Pages, blog, portfolio links", href: "/admin/content", metric: null, metricLabel: "manage" },
    { id: "settings", title: "Settings", desc: "Env health & allowlist", href: "/admin/settings", metric: null, metricLabel: "check" },
  ];

  return NextResponse.json({
    ok: true,
    configured: true,
    generatedAt: new Date().toISOString(),
    adminEmail: auth.email || null,
    errors: {
      leads: leadsRes.error?.message || null,
      projects: projectsRes.error?.message || null,
      storeOrders: storeOrdersRes.error?.message || null,
      listings: storeListingsRes.error?.message || null,
      ops: opsWsRes.error?.message || null,
    },
    stats: {
      leadsTotal: leads.length,
      leadsNew: byStatus.new,
      leads7,
      leads30,
      leadsWon: byStatus.won,
      leadsByStatus: byStatus,
      leadsByType: byType,
      projectsTotal: projects.length,
      projectsActive: activeProjects,
      projectValueNgn,
      projectByStatus,
      storeOrders: storeOrderCount,
      storeRevenueNgn: storeRevenue,
      storeListings: listings.length,
      storeDevelopers: developers.length,
      opsWorkspaces: workspaces.length,
    },
    modules,
    needsAttention,
    recent,
  });
}
