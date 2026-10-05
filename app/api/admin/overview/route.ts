import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function adminOk(req: NextRequest) {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("x-admin-secret") || "") === secret;
}

export async function GET(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      ok: true,
      configured: false,
      note: "Supabase not configured. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.",
      leads: { total: 0, new: 0, byStatus: {}, recent: [] },
      students: { total: 0, pending_payment: 0, paid: 0, byStage: {}, recent: [] },
      purchases: { total: 0, recent: [] },
    });
  }

  const [leadsRes, studentsRes, purchaseRes] = await Promise.all([
    sb
      .from("site_leads")
      .select("id, created_at, type, product, name, email, phone, status, source")
      .order("created_at", { ascending: false })
      .limit(200),
    sb
      .from("student_projects")
      .select(
        "id, request_id, package_name, stage, status, name, email, topic, amount_ngn, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    sb
      .from("site_leads")
      .select("id, created_at, product, name, email, status, message")
      .eq("type", "purchase")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const leads = leadsRes.data || [];
  const students = studentsRes.data || [];
  const purchases = purchaseRes.data || [];

  const leadByStatus: Record<string, number> = {};
  let leadNew = 0;
  for (const l of leads) {
    leadByStatus[l.status] = (leadByStatus[l.status] || 0) + 1;
    if (l.status === "new") leadNew++;
  }

  const studentByStage: Record<string, number> = {};
  let pendingPay = 0;
  let paid = 0;
  for (const s of students) {
    studentByStage[s.stage] = (studentByStage[s.stage] || 0) + 1;
    if (s.status === "pending_payment") pendingPay++;
    if (s.status === "paid" || s.status === "in_progress" || s.status === "delivered")
      paid++;
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    leads: {
      total: leads.length,
      new: leadNew,
      byStatus: leadByStatus,
      recent: leads.slice(0, 8),
    },
    students: {
      total: students.length,
      pending_payment: pendingPay,
      paid,
      byStage: studentByStage,
      recent: students.slice(0, 8),
    },
    purchases: {
      total: purchases.length,
      recent: purchases.slice(0, 8),
    },
    errors: {
      leads: leadsRes.error?.message || null,
      students: studentsRes.error?.message || null,
    },
  });
}
