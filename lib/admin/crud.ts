/** Server-only helpers for the admin CRUD API: value coercion, validation and the audit log. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Field, Resource } from "@/lib/admin/resources";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidationError extends Error {}

/** Converts one submitted value to what the column stores. Throws ValidationError with a readable message. */
export function coerce(field: Field, value: unknown): unknown {
  if (value === undefined) return undefined;
  const empty = value === null || (typeof value === "string" && value.trim() === "");
  if (empty) {
    if (field.required) throw new ValidationError(`${field.label} is required.`);
    return field.type === "boolean" ? false : null;
  }
  switch (field.type) {
    case "text":
    case "textarea":
    case "phone":
      return String(value).trim().slice(0, field.type === "textarea" ? 20_000 : 500);
    case "email": {
      const v = String(value).trim().toLowerCase();
      if (!EMAIL_RE.test(v)) throw new ValidationError(`${field.label} must be a valid email.`);
      return v;
    }
    case "url": {
      const v = String(value).trim();
      if (!/^https?:\/\//i.test(v)) throw new ValidationError(`${field.label} must start with http:// or https://`);
      return v.slice(0, 2000);
    }
    case "select": {
      const v = String(value);
      if (field.options && !field.options.includes(v)) {
        throw new ValidationError(`${field.label} must be one of: ${field.options.join(", ")}.`);
      }
      return v;
    }
    case "number":
    case "naira":
    case "kobo": {
      const n = Number(value);
      if (!Number.isFinite(n)) throw new ValidationError(`${field.label} must be a number.`);
      return field.type === "number" ? n : Math.round(n);
    }
    case "boolean":
      return value === true || value === "true" || value === 1 || value === "1";
    case "date": {
      const v = String(value).slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${field.label} must be a date.`);
      return v;
    }
    case "datetime": {
      const d = new Date(String(value));
      if (Number.isNaN(d.getTime())) throw new ValidationError(`${field.label} must be a date and time.`);
      return d.toISOString();
    }
    case "json": {
      if (typeof value === "object") return value;
      try {
        return JSON.parse(String(value));
      } catch {
        throw new ValidationError(`${field.label} must be valid JSON.`);
      }
    }
  }
}

/** Keeps only fields the admin may write, coerced. `mode` decides whether create-only keys are allowed. */
export function pickRow(r: Resource, input: Record<string, unknown>, mode: "create" | "update"): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of r.fields) {
    if (f.hidden) continue;
    const writable = !f.readOnly || (mode === "create" && f.createOnly);
    if (!writable || !(f.key in input)) continue;
    out[f.key] = coerce(f, input[f.key]);
  }
  if (mode === "create") {
    for (const f of r.fields) {
      const writable = !f.readOnly || f.createOnly;
      if (f.required && writable && (out[f.key] === undefined || out[f.key] === null) && r.createDefaults?.[f.key] === undefined) {
        throw new ValidationError(`${f.label} is required.`);
      }
    }
  }
  return out;
}

/** Removes hidden columns before rows go to the browser. */
export function stripHidden(r: Resource, row: Record<string, unknown>): Record<string, unknown> {
  const out = { ...row };
  for (const f of r.fields) if (f.hidden) delete out[f.key];
  return out;
}

export function selectColumns(r: Resource): string {
  return r.fields.filter((f) => !f.hidden).map((f) => f.key).join(", ");
}

/** Text for an ilike search: drops characters that would break PostgREST's `or` filter syntax. */
export function safeSearch(q: string): string {
  return q.replace(/[%_,()*\\:"']/g, " ").trim().slice(0, 80);
}

export async function audit(
  sb: SupabaseClient,
  entry: { actor: string; action: "create" | "update" | "delete"; resource: string; recordId: string | null; changes?: unknown }
) {
  const { error } = await sb.from("admin_audit_log").insert({
    actor: entry.actor,
    action: entry.action,
    resource: entry.resource,
    record_id: entry.recordId,
    changes: entry.changes ?? null,
  });
  if (error) console.error("admin audit", error.message);
}

export function toCsv(fields: Field[], rows: Record<string, unknown>[]): string {
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    // Neutralise spreadsheet formulas and quote everything.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const head = fields.map((f) => cell(f.label)).join(",");
  const body = rows.map((r) => fields.map((f) => cell(r[f.key])).join(","));
  return [head, ...body].join("\r\n");
}
