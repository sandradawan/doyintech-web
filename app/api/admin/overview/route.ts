import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

type LeadRow = {
  id: string;
  created_at: string;
  type: string;
  product: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  source?: string | null;
};

type ProjectRow = {
  id: string;
  request_id: string;
  package_name: string;
  stage: string;
  status: string;
  name: string;
  email: string;
  amount_ngn: number;
  created_at: string;
};

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
    });
  }

  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [leadsRes, projectsRes] = await Promise.all([
    sb
      .from("site_leads")
      .select("id, created_at, type, product, name, email, phone, status, source")
      .order("created_at", { ascending: false })
      .limit(300),
    sb
      .from("student_projects")
      .select(
        "id, request_id, package_name, stage, status, name, email, amount_ngn, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const leads = (leadsRes.data || []) as LeadRow[];
  const projects = (projectsRes.data || []) as ProjectRow[];
  const leadsError = leadsRes.error?.message || null;
  const projectsError = projectsRes.error?.message || null;

  const byStatus: Record<string, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  };
  const byType: Record<string, number> = {};
  let leads7 = 0;
  let leads30 = 0;

  for (const l of leads) {
    if (l.status in byStatus) byStatus[l.status]++;
    byType[l.type || "other"] = (byType[l.type || "other"] || 0) + 1;
    if (l.created_at >= since7) leads7++;
    if (l.created_at >= since30) leads30++;
  }

  const projectByStatus: Record<string, number> = {};
  const projectByStage: Record<string, number> = {};
  let projectValueNgn = 0;
  let activeProjects = 0;

  for (const p of projects) {
    projectByStatus[p.status || "unknown"] =
      (projectByStatus[p.status || "unknown"] || 0) + 1;
    projectByStage[p.stage || "unknown"] =
      (projectByStage[p.stage || "unknown"] || 0) + 1;
    projectValueNgn += Number(p.amount_ngn || 0);
    if (!["completed", "cancelled"].includes(p.status)) activeProjects++;
  }

  const needsAttention = [
    ...leads
      .filter((l) => l.status === "new")
      .slice(0, 8)
      .map((l) => ({
        kind: "lead" as const,
        id: l.id,
        title: l.name,
        subtitle: `${l.product} · ${l.type}`,
        status: l.status,
        at: l.created_at,
        href: "/admin/leads",
      })),
    ...projects
      .filter((p) =>
        ["pending_payment", "awaiting_balance", "in_progress"].includes(p.status)
      )
      .slice(0, 6)
      .map((p) => ({
        kind: "project" as const,
        id: p.id,
        title: p.name,
        subtitle: `${p.package_name} · ${p.stage}`,
        status: p.status,
        at: p.created_at,
        href: "/admin/student-projects",
      })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 12);

  const recent = [
    ...leads.slice(0, 10).map((l) => ({
      kind: "lead" as const,
      id: l.id,
      title: l.name,
      subtitle: `${l.product} · ${l.status}`,
      at: l.created_at,
      href: "/admin/leads",
    })),
    ...projects.slice(0, 8).map((p) => ({
      kind: "project" as const,
      id: p.id,
      title: p.name,
      subtitle: `${p.package_name} · ${p.status}`,
      at: p.created_at,
      href: "/admin/student-projects",
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 14);

  return NextResponse.json({
    ok: true,
    configured: true,
    generatedAt: new Date().toISOString(),
    adminEmail: auth.email || null,
    errors: { leads: leadsError, projects: projectsError },
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
      projectByStage,
    },
    needsAttention,
    recent,
  });
}
