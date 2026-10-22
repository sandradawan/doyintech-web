import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { secretsMatch } from "@/lib/admin/auth";
import { nextSendAt, sendNurtureEmail, sequenceFor } from "@/lib/newsletter/sequence";

export const maxDuration = 60;

const BATCH = 80;

/** Daily: sends each subscriber the next email in their sequence when it's due. */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET || "";
  if (!secretsMatch(auth, `Bearer ${secret}`) || !secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return Response.json({ error: "Database not configured" }, { status: 503 });

  const { data: due, error } = await sb
    .from("email_subscribers")
    .select("id, email, name, step, sequence, unsubscribe_token")
    .is("unsubscribed_at", null)
    .not("next_send_at", "is", null)
    .lte("next_send_at", new Date().toISOString())
    .order("next_send_at", { ascending: true })
    .limit(BATCH);
  if (error) {
    console.error("nurture select", error.message);
    return Response.json({ error: "query failed" }, { status: 500 });
  }

  let sent = 0;
  for (const s of due || []) {
    const step = s.step + 1;
    if (step >= sequenceFor(s.sequence).emails.length) {
      await sb.from("email_subscribers").update({ next_send_at: null }).eq("id", s.id);
      continue;
    }
    const ok = await sendNurtureEmail({ sequence: s.sequence, step, email: s.email, name: s.name, token: s.unsubscribe_token });
    if (!ok) continue; // retried on the next run
    sent += 1;
    await sb
      .from("email_subscribers")
      .update({ step, next_send_at: nextSendAt(step, s.sequence) })
      .eq("id", s.id);
  }

  return Response.json({ ok: true, due: due?.length || 0, sent });
}
