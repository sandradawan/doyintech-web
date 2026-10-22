import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { getResource, visibleFields, type Resource } from "@/lib/admin/resources";
import { ValidationError, audit, pickRow, safeSearch, selectColumns, stripHidden, toCsv } from "@/lib/admin/crud";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string }> };
const MAX_BULK = 200;

async function setup(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return { error: NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 }) };
  const r = getResource((await ctx.params).resource);
  if (!r) return { error: NextResponse.json({ error: "Unknown resource" }, { status: 404 }) };
  const sb = getSupabaseAdmin();
  if (!sb) return { error: NextResponse.json({ error: "Database not configured" }, { status: 503 }) };
  return { r, sb, actor: auth.email || "admin-secret" };
}

function dbError(r: Resource, message: string) {
  return NextResponse.json(
    { error: message, hint: `If the table is missing, run the Supabase migrations (${r.id}).` },
    { status: 500 }
  );
}

/**
 * GET  ?id=…                       one record
 * GET  ?q=&page=&pageSize=&sort=&dir=&f_<field>=   paged list with search and filters
 * GET  ?format=csv (+ same filters) CSV export, up to 5,000 rows
 */
export async function GET(req: NextRequest, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const { r, sb } = s;
  const p = req.nextUrl.searchParams;
  const cols = selectColumns(r);

  const id = p.get("id");
  if (id) {
    const { data, error } = await sb.from(r.id).select(cols).eq(r.pk, id).maybeSingle();
    if (error) return dbError(r, error.message);
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ row: stripHidden(r, data as unknown as Record<string, unknown>) });
  }

  const csv = p.get("format") === "csv";
  const pageSize = csv ? 5000 : Math.min(100, Math.max(1, Number(p.get("pageSize")) || 25));
  const page = csv ? 1 : Math.max(1, Number(p.get("page")) || 1);
  const visible = visibleFields(r);
  const sortField = visible.find((f) => f.key === p.get("sort"))?.key || r.orderBy;
  const ascending = p.get("dir") === "asc";

  let query = sb
    .from(r.id)
    .select(cols, { count: "exact" })
    .order(sortField, { ascending, nullsFirst: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const q = safeSearch(p.get("q") || "");
  if (q && r.search.length) query = query.or(r.search.map((c) => `${c}.ilike.%${q}%`).join(","));

  for (const f of visible) {
    const v = p.get(`f_${f.key}`);
    if (v === null || v === "") continue;
    if (f.type === "boolean") query = query.eq(f.key, v === "true");
    else if (f.type === "select" || f.key === r.emailField || f.key === "lead_id" || f.key === "store_id") query = query.eq(f.key, v);
  }

  const { data, error, count } = await query;
  if (error) return dbError(r, error.message);
  const rows = ((data || []) as unknown as Record<string, unknown>[]).map((row) => stripHidden(r, row));

  if (csv) {
    return new NextResponse(toCsv(visible, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${r.id}-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return NextResponse.json({ rows, total: count ?? rows.length, page, pageSize });
}

/** POST { row } — create one record. */
export async function POST(req: NextRequest, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const { r, sb, actor } = s;
  if (!r.canCreate) return NextResponse.json({ error: `${r.label} can't be created here.` }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  let row: Record<string, unknown>;
  try {
    row = { ...(r.createDefaults || {}), ...pickRow(r, body.row || {}, "create") };
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
  if (r.id === "crm_activities") row.created_by = actor;
  if (r.id === "student_projects" && !row.request_id) row.request_id = `SP-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await sb.from(r.id).insert(row).select(selectColumns(r)).single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "A record with that value already exists." }, { status: 409 });
    return dbError(r, error.message);
  }
  const created = data as unknown as Record<string, unknown>;
  await audit(sb, { actor, action: "create", resource: r.id, recordId: String(created[r.pk] ?? ""), changes: row });
  return NextResponse.json({ ok: true, row: stripHidden(r, created) });
}

/** PATCH { id, row } — update one; or { ids: [...], row } — bulk update. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const { r, sb, actor } = s;
  if (!r.canUpdate) return NextResponse.json({ error: `${r.label} are read-only.` }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String).slice(0, MAX_BULK) : body.id ? [String(body.id)] : [];
  if (!ids.length) return NextResponse.json({ error: "Nothing selected." }, { status: 400 });

  let patch: Record<string, unknown>;
  try {
    patch = pickRow(r, body.row || {}, "update");
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No editable fields in the request." }, { status: 400 });
  if (r.fields.some((f) => f.key === "updated_at")) patch.updated_at = new Date().toISOString();

  // Keep the "before" values for the audit log and pipeline history.
  const changedKeys = Object.keys(patch).filter((k) => k !== "updated_at");
  const { data: before } = await sb.from(r.id).select([r.pk, ...changedKeys].join(", ")).in(r.pk, ids);

  const { data, error } = await sb.from(r.id).update(patch).in(r.pk, ids).select(selectColumns(r));
  if (error) return dbError(r, error.message);

  const beforeById = new Map(((before || []) as unknown as Record<string, unknown>[]).map((b) => [String(b[r.pk]), b]));
  for (const id of ids) {
    const prev = beforeById.get(id);
    const diff: Record<string, { from: unknown; to: unknown }> = {};
    for (const k of changedKeys) {
      if (JSON.stringify(prev?.[k]) !== JSON.stringify(patch[k])) diff[k] = { from: prev?.[k] ?? null, to: patch[k] };
    }
    if (!Object.keys(diff).length) continue;
    await audit(sb, { actor, action: "update", resource: r.id, recordId: id, changes: diff });
    if (r.id === "site_leads" && diff.status) {
      await sb.from("crm_activities").insert({
        lead_id: id,
        kind: "note",
        body: `Stage changed from ${diff.status.from ?? "none"} to ${diff.status.to}`,
        done: true,
        created_by: actor,
      });
    }
  }

  const rows = ((data || []) as unknown as Record<string, unknown>[]).map((row) => stripHidden(r, row));
  return NextResponse.json({ ok: true, updated: rows.length, row: ids.length === 1 ? rows[0] : undefined, rows });
}

/** DELETE { ids: [...] } (or ?id=…) — delete one or many. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const { r, sb, actor } = s;
  if (!r.canDelete) return NextResponse.json({ error: `${r.label} can't be deleted.` }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const single = req.nextUrl.searchParams.get("id");
  const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String).slice(0, MAX_BULK) : single ? [single] : [];
  if (!ids.length) return NextResponse.json({ error: "Nothing selected." }, { status: 400 });

  const { data: snapshot } = await sb.from(r.id).select(selectColumns(r)).in(r.pk, ids);
  const { error } = await sb.from(r.id).delete().in(r.pk, ids);
  if (error) return dbError(r, error.message);
  for (const row of (snapshot || []) as unknown as Record<string, unknown>[]) {
    await audit(sb, { actor, action: "delete", resource: r.id, recordId: String(row[r.pk]), changes: row });
  }
  return NextResponse.json({ ok: true, deleted: ids.length });
}
