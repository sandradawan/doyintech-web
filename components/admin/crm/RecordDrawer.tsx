"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin/client";
import { ACTIVITY_KINDS, visibleFields, type Field, type Resource } from "@/lib/admin/resources";
import { Badge, CellValue, Drawer, ErrorNote, btn, inputCls, relativeTime, formatDate } from "@/components/admin/crm/ui";

type Row = Record<string, unknown>;

const pad = (n: number) => String(n).padStart(2, "0");
function toLocalInput(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Record value → form input value. */
export function toForm(f: Field, v: unknown): string | boolean {
  if (f.type === "boolean") return Boolean(v);
  if (v === null || v === undefined) return "";
  if (f.type === "kobo") return String(Number(v) / 100);
  if (f.type === "datetime") return toLocalInput(v);
  if (f.type === "date") return String(v).slice(0, 10);
  if (f.type === "json") return JSON.stringify(v, null, 2);
  return String(v);
}

/** Form input value → API value (kobo fields are edited in naira). */
export function fromForm(f: Field, v: string | boolean): unknown {
  if (f.type === "boolean") return Boolean(v);
  const s = String(v).trim();
  if (s === "") return null;
  if (f.type === "kobo") return Math.round(Number(s.replace(/[^\d.-]/g, "")) * 100);
  if (f.type === "naira" || f.type === "number") return Number(s.replace(/[^\d.-]/g, ""));
  if (f.type === "datetime") return new Date(s).toISOString();
  return s;
}

export function FieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
  disabled?: boolean;
}) {
  const id = `f-${field.key}`;
  const common = { id, disabled, required: field.required, className: inputCls };
  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={4} value={String(value)} onChange={(e) => onChange(e.target.value)} />;
    case "json":
      return <textarea {...common} rows={8} spellCheck={false} className={`${inputCls} font-mono text-[12px]`} value={String(value)} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return (
        <select {...common} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-white">
          <input id={id} type="checkbox" disabled={disabled} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#ff8c14]" />
          {value ? "Yes" : "No"}
        </label>
      );
    default: {
      const type =
        field.type === "email"
          ? "email"
          : field.type === "url"
            ? "url"
            : field.type === "date"
              ? "date"
              : field.type === "datetime"
                ? "datetime-local"
                : field.type === "phone"
                  ? "tel"
                  : "text";
      const numeric = field.type === "number" || field.type === "naira" || field.type === "kobo";
      return (
        <div className="relative">
          {(field.type === "naira" || field.type === "kobo") && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/40">₦</span>}
          <input
            {...common}
            type={type}
            inputMode={numeric ? "decimal" : undefined}
            className={`${inputCls} ${field.type === "naira" || field.type === "kobo" ? "pl-7" : ""}`}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }
  }
}

/** View / edit / create one record, with the activity timeline for leads. */
export default function RecordDrawer({
  resource,
  record,
  open,
  onClose,
  onSaved,
  onDeleted,
}: {
  resource: Resource;
  record: Row | null; // null = create
  open: boolean;
  onClose: () => void;
  onSaved: (row: Row) => void;
  onDeleted: (id: string) => void;
}) {
  const creating = !record;
  const fields = useMemo(() => visibleFields(resource), [resource]);
  const editable = (f: Field) => (creating ? !f.readOnly || f.createOnly : resource.canUpdate && !f.readOnly);
  const shown = creating ? fields.filter((f) => !f.readOnly || f.createOnly) : fields;

  const initial = useMemo(() => {
    const src: Row = record || resource.createDefaults || {};
    return Object.fromEntries(fields.map((f) => [f.key, toForm(f, src[f.key])])) as Record<string, string | boolean>;
  }, [record, resource, fields]);

  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset the form whenever a different record is opened.
     
    setValues(initial);
    setError("");
  }, [initial]);

  const dirty = fields.some((f) => values[f.key] !== initial[f.key]);
  const id = record ? String(record[resource.pk]) : "";
  const title = creating ? `New ${resource.singular.toLowerCase()}` : String(record?.[resource.titleField] ?? id).slice(0, 80);
  const contactEmail = resource.emailField && record?.[resource.emailField] ? String(record[resource.emailField]) : "";

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const row: Row = {};
      for (const f of fields) {
        if (!editable(f)) continue;
        if (!creating && values[f.key] === initial[f.key]) continue;
        const v = fromForm(f, values[f.key]);
        if (creating && v === null) continue; // let server defaults apply
        row[f.key] = v;
      }
      const res = creating
        ? await adminApi<{ row: Row }>(`/api/admin/crud/${resource.id}`, { method: "POST", body: JSON.stringify({ row }) })
        : await adminApi<{ row: Row }>(`/api/admin/crud/${resource.id}`, { method: "PATCH", body: JSON.stringify({ id, row }) });
      onSaved(res.row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete this ${resource.singular.toLowerCase()}? This can't be undone.`)) return;
    setBusy(true);
    try {
      await adminApi(`/api/admin/crud/${resource.id}`, { method: "DELETE", body: JSON.stringify({ ids: [id] }) });
      onDeleted(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
      setBusy(false);
    }
  }

  const canSave = creating ? resource.canCreate : resource.canUpdate;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      wide={resource.id === "site_leads"}
      title={title}
      subtitle={
        creating ? (
          resource.label
        ) : (
          <span className="flex flex-wrap items-center gap-2">
            {resource.singular}
            {typeof record?.created_at === "string" && <span>· created {relativeTime(record.created_at)}</span>}
            {contactEmail && (
              <Link href={`/admin/contacts?email=${encodeURIComponent(contactEmail)}`} className="text-[#8ab4ff] hover:underline">
                · Open contact
              </Link>
            )}
          </span>
        )
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            {!creating && resource.canDelete && (
              <button type="button" onClick={remove} disabled={busy} className={btn.danger}>
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={btn.ghost}>
              {canSave ? "Cancel" : "Close"}
            </button>
            {canSave && (
              <button type="submit" form="record-form" disabled={busy || (!creating && !dirty)} className={btn.primary}>
                {busy ? "Saving…" : creating ? `Create ${resource.singular.toLowerCase()}` : "Save changes"}
              </button>
            )}
          </div>
        </div>
      }
    >
      {resource.warning && <div className="mb-4"><ErrorNote message={resource.warning} /></div>}
      {error && <div className="mb-4"><ErrorNote message={error} /></div>}

      {resource.id === "site_leads" && !creating && <LeadQuickActions record={record!} />}

      <form id="record-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        {shown.map((f) => {
          const wide = f.type === "textarea" || f.type === "json";
          return (
            <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
              <label htmlFor={`f-${f.key}`} className="mb-1 block text-[12px] font-medium text-[#a1a1a6]">
                {f.label}
                {f.required && editable(f) && <span className="text-[#ff8c14]"> *</span>}
              </label>
              {editable(f) ? (
                <FieldInput field={f} value={values[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
              ) : (
                <div className="min-h-[38px] rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[14px] text-[#e5e5ea]">
                  {f.type === "json" ? (
                    <pre className="max-h-60 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-white/70">{JSON.stringify(record?.[f.key] ?? null, null, 2)}</pre>
                  ) : (
                    <CellValue field={f} value={record?.[f.key]} />
                  )}
                </div>
              )}
              {f.hint && editable(f) && <p className="mt-1 text-[11px] text-[#6e6e73]">{f.hint}</p>}
            </div>
          );
        })}
      </form>

      {!creating && (resource.id === "site_leads" || contactEmail) && (
        <div className="mt-8">
          <ActivityTimeline leadId={resource.id === "site_leads" ? id : undefined} email={contactEmail || undefined} />
        </div>
      )}
    </Drawer>
  );
}

function LeadQuickActions({ record }: { record: Row }) {
  const phone = String(record.phone || "").replace(/\D/g, "").replace(/^0/, "234");
  const email = String(record.email || "");
  const name = String(record.name || "").split(" ")[0];
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {phone && (
        <a
          href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${name}, this is Silas from DoyinTech.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#25D366]/15 px-3 py-1.5 text-[12px] font-semibold text-[#4ade80] ring-1 ring-[#25D366]/30 hover:bg-[#25D366]/25"
        >
          WhatsApp
        </a>
      )}
      {phone && (
        <a href={`tel:+${phone}`} className={btn.ghost + " !px-3 !py-1.5 !text-[12px]"}>
          Call
        </a>
      )}
      {email && (
        <a href={`mailto:${email}?subject=${encodeURIComponent("Your enquiry with DoyinTech")}`} className={btn.ghost + " !px-3 !py-1.5 !text-[12px]"}>
          Email
        </a>
      )}
    </div>
  );
}

type Activity = { id: string; kind: string; body: string; due_at: string | null; done: boolean; created_by: string | null; created_at: string };

/** Notes, calls and tasks for a lead (and/or a contact email). */
export function ActivityTimeline({ leadId, email }: { leadId?: string; email?: string }) {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<string>("note");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filter = leadId ? `f_lead_id=${encodeURIComponent(leadId)}` : `f_contact_email=${encodeURIComponent(email || "")}`;
      const data = await adminApi<{ rows: Activity[] }>(`/api/admin/crud/crm_activities?${filter}&pageSize=100&sort=created_at&dir=desc`);
      setItems(data.rows);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load activity");
    } finally {
      setLoading(false);
    }
  }, [leadId, email]);

  useEffect(() => {
     
    void load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await adminApi("/api/admin/crud/crm_activities", {
        method: "POST",
        body: JSON.stringify({
          row: {
            kind,
            body,
            lead_id: leadId || null,
            contact_email: email || null,
            due_at: due ? new Date(due).toISOString() : null,
            done: kind !== "task",
          },
        }),
      });
      setBody("");
      setDue("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(a: Activity) {
    await adminApi("/api/admin/crud/crm_activities", { method: "PATCH", body: JSON.stringify({ id: a.id, row: { done: !a.done } }) });
    await load();
  }

  return (
    <section>
      <h3 className="text-[14px] font-semibold text-white">Activity</h3>
      <form onSubmit={add} className="mt-3 space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
        <div className="flex flex-wrap gap-1.5">
          {ACTIVITY_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`rounded-full px-2.5 py-1 text-[12px] font-medium capitalize ${kind === k ? "bg-[#ff8c14] text-black" : "bg-white/[0.05] text-[#a1a1a6] hover:text-white"}`}
            >
              {k}
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder={kind === "task" ? "What needs doing?" : `Log a ${kind}…`}
          className={inputCls}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[12px] text-[#a1a1a6]">
            {kind === "task" ? "Due" : "Follow-up (optional)"}
            <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className={`${inputCls} !w-auto !py-1.5`} />
          </label>
          <button type="submit" disabled={busy || !body.trim()} className={`${btn.primary} ml-auto`}>
            {busy ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
      {error && <div className="mt-3"><ErrorNote message={error} /></div>}
      {loading ? (
        <p className="mt-4 text-[13px] text-[#86868b]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#86868b]">No activity yet.</p>
      ) : (
        <ol className="mt-4 space-y-3 border-l border-white/10 pl-4">
          {items.map((a) => (
            <li key={a.id} className="relative">
              <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${a.kind === "task" && !a.done ? "bg-[#ff8c14]" : "bg-white/25"}`} />
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#86868b]">
                <Badge value={a.kind} tone={a.kind === "task" ? (a.done ? "green" : "orange") : "gray"} />
                <span>{relativeTime(a.created_at)}</span>
                {a.created_by && <span>· {a.created_by}</span>}
                {a.due_at && <span className={!a.done && new Date(a.due_at) < new Date() ? "text-red-300" : ""}>· due {formatDate(a.due_at, true)}</span>}
                {a.kind === "task" && (
                  <button type="button" onClick={() => toggle(a)} className="ml-auto text-[#8ab4ff] hover:underline">
                    {a.done ? "Reopen" : "Mark done"}
                  </button>
                )}
              </div>
              <p className={`mt-1 whitespace-pre-line text-[13px] ${a.done && a.kind === "task" ? "text-[#86868b] line-through" : "text-[#e5e5ea]"}`}>{a.body}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
