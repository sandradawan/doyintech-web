import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

/**
 * Full-site admin CRUD. Tables mirror docs/doyintech-full-site.sql + related schemas.
 * Primary key is usually `id`; exceptions: site_settings.key, ops_workspaces.user_id
 */

const TABLE_CONFIG: Record<
  string,
  {
    pk: string;
    writable: string[];
    orderBy?: string;
    createDefaults?: Record<string, unknown>;
  }
> = {
  site_leads: {
    pk: "id",
    writable: [
      "type",
      "product",
      "name",
      "email",
      "phone",
      "message",
      "source",
      "status",
      "meta",
      "referral_code",
    ],
    orderBy: "created_at",
    createDefaults: { status: "new", type: "lead", product: "General" },
  },
  site_orders: {
    pk: "id",
    writable: [
      "product_id",
      "product_name",
      "buyer_email",
      "buyer_name",
      "amount_kobo",
      "paystack_reference",
      "status",
      "meta",
      "paid_at",
    ],
    orderBy: "created_at",
    createDefaults: { status: "pending", amount_kobo: 0 },
  },
  site_chat_messages: {
    pk: "id",
    writable: ["session_id", "role", "content", "name", "email", "ip"],
    orderBy: "created_at",
    createDefaults: { role: "user" },
  },
  site_settings: {
    pk: "key",
    writable: ["key", "value"],
    orderBy: "updated_at",
  },
  student_projects: {
    pk: "id",
    writable: [
      "request_id",
      "package_name",
      "stage",
      "status",
      "name",
      "email",
      "phone",
      "topic",
      "amount_ngn",
      "admin_notes",
    ],
    orderBy: "created_at",
    createDefaults: { status: "new", stage: "intake" },
  },
  student_project_events: {
    pk: "id",
    writable: ["project_id", "event_type", "note", "meta"],
    orderBy: "created_at",
  },
  store_listings: {
    pk: "id",
    writable: [
      "slug",
      "kind",
      "title",
      "short_description",
      "description",
      "developer_id",
      "developer_name",
      "developer_email",
      "platform",
      "price_ngn",
      "amount_kobo",
      "category",
      "icon_emoji",
      "icon_url",
      "version",
      "package_type",
      "file_name",
      "file_path",
      "file_size_mb",
      "sha256",
      "launch_url",
      "privacy_policy_url",
      "support_url",
      "review_status",
      "virus_scan_status",
      "security_notes",
      "downloads",
      "rating_avg",
      "rating_count",
    ],
    orderBy: "created_at",
    createDefaults: {
      kind: "digital_product",
      platform: "web",
      review_status: "draft",
      price_ngn: 0,
      amount_kobo: 0,
      category: "Business",
      short_description: "",
      description: "",
      developer_name: "DoyinTech",
      developer_email: "doyintechnology@outlook.com",
    },
  },
  store_orders: {
    pk: "id",
    writable: [
      "listing_id",
      "product_name",
      "buyer_email",
      "buyer_name",
      "amount_ngn",
      "amount_kobo",
      "paystack_reference",
      "status",
      "meta",
    ],
    orderBy: "created_at",
    createDefaults: { status: "pending" },
  },
  store_developers: {
    pk: "id",
    writable: [
      "display_name",
      "email",
      "phone",
      "website",
      "bio",
      "membership_status",
      "membership_tier",
      "rejection_reason",
      "avatar_url",
    ],
    orderBy: "created_at",
    createDefaults: { membership_status: "pending" },
  },
  store_reviews: {
    pk: "id",
    writable: ["listing_id", "reviewer_email", "reviewer_name", "rating", "body", "status"],
    orderBy: "created_at",
    createDefaults: { status: "published", rating: 5 },
  },
  store_members: {
    pk: "id",
    writable: ["user_id", "email", "display_name", "phone", "avatar_url", "status"],
    orderBy: "created_at",
    createDefaults: { status: "active" },
  },
  store_submissions_log: {
    pk: "id",
    writable: ["payload"],
    orderBy: "created_at",
  },
  ops_workspaces: {
    pk: "user_id",
    writable: ["user_id", "payload"],
    orderBy: "updated_at",
    createDefaults: { payload: {} },
  },
  ops_payment_events: {
    pk: "id",
    writable: ["invoice_number", "reference", "amount_kobo", "email", "paid_at", "metadata"],
    orderBy: "created_at",
  },
};

const TABLES = new Set(Object.keys(TABLE_CONFIG));

function pickWritable(table: string, body: Record<string, unknown>) {
  const allowed = TABLE_CONFIG[table]?.writable || [];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      let v = body[key];
      if (
        (key === "meta" || key === "payload" || key === "metadata" || key === "value") &&
        typeof v === "string"
      ) {
        try {
          v = JSON.parse(v);
        } catch {
          /* keep string */
        }
      }
      if (
        [
          "amount_ngn",
          "amount_kobo",
          "price_ngn",
          "downloads",
          "rating",
          "rating_count",
          "file_size_mb",
          "rating_avg",
        ].includes(key) &&
        v !== "" &&
        v != null
      ) {
        v = Number(v);
      }
      out[key] = v;
    }
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

  if (req.nextUrl.searchParams.get("catalog") === "1") {
    return NextResponse.json({
      ok: true,
      tables: Object.entries(TABLE_CONFIG).map(([id, cfg]) => ({
        id,
        pk: cfg.pk,
        writable: cfg.writable,
      })),
    });
  }

  const table = req.nextUrl.searchParams.get("table") || "";
  if (!TABLES.has(table)) {
    return NextResponse.json({ error: "Invalid table", allowed: [...TABLES] }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const cfg = TABLE_CONFIG[table];
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 150), 500);
  const status = req.nextUrl.searchParams.get("status") || "";
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  let query = sb.from(table).select("*").limit(limit);
  if (cfg.orderBy) {
    query = query.order(cfg.orderBy, { ascending: false });
  }
  if (status) {
    if (table === "store_listings") query = query.eq("review_status", status);
    else if (cfg.writable.includes("status")) query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint: "Table may not exist yet — run docs/doyintech-full-site.sql (or related) in Supabase.",
      },
      { status: 500 }
    );
  }

  let rows = data || [];
  if (q) {
    const lower = q.toLowerCase();
    rows = rows.filter((row) =>
      Object.values(row as Record<string, unknown>).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      )
    );
  }

  return NextResponse.json({
    ok: true,
    table,
    pk: cfg.pk,
    writable: cfg.writable,
    rows,
    count: rows.length,
  });
}

export async function POST(req: NextRequest) {
  const g = await gate(req);
  if ("error" in g && g.error) return g.error;

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const body = await req.json();
    const table = String(body.table || "");
    if (!TABLES.has(table)) {
      return NextResponse.json({ error: "Invalid table", allowed: [...TABLES] }, { status: 400 });
    }
    const cfg = TABLE_CONFIG[table];
    const row = {
      ...(cfg.createDefaults || {}),
      ...pickWritable(table, body.row || body),
    };

    if (table === "store_listings") {
      if (!row.slug) {
        row.slug = String(row.title || "listing")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 60);
      }
      if (row.price_ngn != null && row.amount_kobo == null) {
        row.amount_kobo = Math.round(Number(row.price_ngn) * 100);
      }
      if (!row.title) return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    if (table === "student_projects" && !row.request_id) {
      row.request_id = `SP-${Date.now().toString(36).toUpperCase()}`;
    }
    if (table === "site_leads") {
      if (!row.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (table === "site_settings") {
      if (!row.key) return NextResponse.json({ error: "key required" }, { status: 400 });
      if (row.value === undefined) row.value = {};
    }
    if (table === "ops_workspaces" && !row.user_id) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }
    if (table === "site_orders") {
      if (!row.product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });
      if (!row.buyer_email) return NextResponse.json({ error: "buyer_email required" }, { status: 400 });
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
    if (!TABLES.has(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const cfg = TABLE_CONFIG[table];
    const id = String(body.id ?? body[cfg.pk] ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: `${cfg.pk} required` }, { status: 400 });
    }

    const patch = pickWritable(table, body.row || body);
    delete patch[cfg.pk];
    if (table === "site_settings") delete patch.key;

    if (!Object.keys(patch).length) {
      return NextResponse.json({ error: "No writable fields" }, { status: 400 });
    }
    if (table === "store_listings" && patch.price_ngn != null && patch.amount_kobo == null) {
      patch.amount_kobo = Math.round(Number(patch.price_ngn) * 100);
    }
    if (table === "site_settings" || table === "ops_workspaces") {
      patch.updated_at = new Date().toISOString();
    }

    const { data, error } = await sb.from(table).update(patch).eq(cfg.pk, id).select("*").single();
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
    if (!TABLES.has(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const cfg = TABLE_CONFIG[table];
    const id = String(
      body.id || body[cfg.pk] || req.nextUrl.searchParams.get("id") || ""
    ).trim();
    if (!id) {
      return NextResponse.json({ error: `${cfg.pk} required` }, { status: 400 });
    }

    const { error } = await sb.from(table).delete().eq(cfg.pk, id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, deleted: id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
