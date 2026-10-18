import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

const TABLES = new Set([
  "site_leads",
  "student_projects",
  "store_listings",
  "store_orders",
  "store_developers",
  "ops_workspaces",
]);

const WRITABLE: Record<string, string[]> = {
  site_leads: ["type", "product", "name", "email", "phone", "message", "source", "status", "meta"],
  student_projects: [
    "request_id", "package_name", "stage", "status", "name", "email", "phone", "topic", "amount_ngn", "admin_notes",
  ],
  store_listings: [
    "title", "short_description", "description", "developer_name", "developer_email", "platform",
    "price_ngn", "amount_kobo", "category", "icon_emoji", "version", "review_status", "security_notes",
    "launch_url", "kind", "slug",
  ],
  store_orders: ["status", "buyer_email", "product_name", "amount_ngn"],
  store_developers: [
    "display_name", "email", "phone", "website", "bio", "membership_status", "membership_tier", "rejection_reason",
  ],
  ops_workspaces: ["name"],
};

function pickWritable(table: string, body: Record<string, unknown>) {
  const allowed = WRITABLE[table] || [];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

async function gate(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return { error: NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 }) };
  }
  return { auth };
}

export async function GET(req: NextRequest) {
  const g = await gate(req);
  if ("error" in g && g.error) return g.error;

  const table = req.nextUrl.searchParams.get("table") || "";
  if (!TABLES.has(table)) {
    return NextResponse.json({ error: "Invalid table", allowed: [...TABLES] }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 100), 300);
  const status = req.nextUrl.searchParams.get("status") || "";

  let query = sb.from(table).select("*").order("created_at", { ascending: false }).limit(limit);
  if (status) {
    if (table === "store_listings") query = query.eq("review_status", status);
    else query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, table, rows: data || [] });
}

export async function POST(req: NextRequest) {
  const g = await gate(req);
  if ("error" in g && g.error) return g.error;

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json();
    const table = String(body.table || "");
    if (!TABLES.has(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    const row = pickWritable(table, body.row || body);
    if (!Object.keys(row).length) {
      return NextResponse.json({ error: "No writable fields provided" }, { status: 400 });
    }
    if (table === "store_listings" && !row.slug) {
      const title = String(row.title || "item");
      row.slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) +
        "-" +
        Math.random().toString(36).slice(2, 7);
    }
    if (table === "store_listings") {
      if (!row.short_description) row.short_description = String(row.title || "").slice(0, 120);
      if (!row.description) row.description = String(row.short_description || "");
      if (!row.developer_name) row.developer_name = "DoyinTech";
      if (!row.developer_email) row.developer_email = "hello@doyintech.com";
      if (!row.platform) row.platform = "web";
      if (!row.kind) row.kind = "digital_product";
      if (row.price_ngn != null && row.amount_kobo == null) {
        row.amount_kobo = Math.round(Number(row.price_ngn) * 100);
      }
      if (!row.review_status) row.review_status = "draft";
    }
    if (table === "student_projects" && !row.request_id) {
      row.request_id = `SP-${Date.now().toString(36).toUpperCase()}`;
    }
    if (table === "site_leads") {
      if (!row.status) row.status = "new";
      if (!row.type) row.type = "lead-magnet";
      if (!row.product) row.product = "General";
      if (!row.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const { data, error } = await sb.from(table).insert(row).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, row: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const g = await gate(req);
  if ("error" in g && g.error) return g.error;

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json();
    const table = String(body.table || "");
    const id = String(body.id || "").trim();
    if (!TABLES.has(table) || !id) {
      return NextResponse.json({ error: "table and id required" }, { status: 400 });
    }
    const patch = pickWritable(table, body.row || body);
    delete (patch as { id?: unknown }).id;
    if (!Object.keys(patch).length) {
      return NextResponse.json({ error: "No writable fields" }, { status: 400 });
    }
    if (table === "store_listings" && patch.price_ngn != null && patch.amount_kobo == null) {
      patch.amount_kobo = Math.round(Number(patch.price_ngn) * 100);
    }

    const { data, error } = await sb.from(table).update(patch).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, row: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const g = await gate(req);
  if ("error" in g && g.error) return g.error;

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json().catch(() => ({}));
    const table = String(body.table || req.nextUrl.searchParams.get("table") || "").trim();
    const id = String(body.id || req.nextUrl.searchParams.get("id") || "").trim();
    if (!TABLES.has(table) || !id) {
      return NextResponse.json({ error: "table and id required" }, { status: 400 });
    }
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, deleted: id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
