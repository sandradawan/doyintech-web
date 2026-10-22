import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ATTR_COOKIE, parseAttribution, type EventName } from "@/lib/analytics/events";

function cookieValue(req: Request, name: string): string | null {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

/** Path of the page that made the request, from the Referer header (same site only). */
function refererPath(req: Request): string | null {
  try {
    const ref = new URL(req.headers.get("referer") || "");
    const host = new URL(req.url).host;
    return ref.host === host ? ref.pathname.slice(0, 200) : null;
  } catch {
    return null;
  }
}

/**
 * Records a conversion. Never throws: tracking must not break a lead form or a webhook.
 * Pass `req` when the call comes from the visitor's browser so page and source are attached.
 */
export async function recordEvent(
  name: EventName,
  opts: { req?: Request; label?: string | null; path?: string | null; valueKobo?: number | null } = {}
): Promise<void> {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return;
    const attr = opts.req ? parseAttribution(cookieValue(opts.req, ATTR_COOKIE)) : {};
    const { error } = await sb.from("site_events").insert({
      name,
      label: opts.label ? String(opts.label).slice(0, 120) : null,
      path: opts.path ?? (opts.req ? refererPath(opts.req) : null),
      value_kobo: opts.valueKobo && opts.valueKobo > 0 ? Math.round(opts.valueKobo) : null,
      session_id: attr.sid || null,
      utm_source: attr.src || null,
      utm_medium: attr.med || null,
      utm_campaign: attr.cmp || null,
      referrer_host: attr.ref || null,
    });
    if (error) console.error("site_events insert", error.message);
  } catch (e) {
    console.error("recordEvent", e);
  }
}
