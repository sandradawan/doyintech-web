import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { nextSendAt, sendNurtureEmail, sequenceFor, type SequenceId } from "@/lib/newsletter/sequence";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EnrollResult = "created" | "switched" | "kept" | "invalid" | "unavailable";

/**
 * Puts an email on a follow-up sequence and sends its first email.
 * Existing subscribers move only to a higher-priority sequence (lead > store > tools > general),
 * or to a new one once their current sequence has finished. Unsubscribed people are never re-added,
 * and paying customers aren't moved onto the sales-led tools/general sequences.
 */
export async function enrollSubscriber(opts: {
  email: string;
  sequence: SequenceId;
  name?: string | null;
  source?: string | null;
  referral?: string | null;
}): Promise<EnrollResult> {
  const email = opts.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return "invalid";
  const sb = getSupabaseAdmin();
  if (!sb) return "unavailable";
  const name = opts.name?.trim().slice(0, 80) || null;

  const { data: existing, error: findErr } = await sb
    .from("email_subscribers")
    .select("id, name, sequence, next_send_at, unsubscribed_at, converted_at, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();
  if (findErr) {
    console.error("enroll lookup", findErr.message);
    return "unavailable";
  }

  if (!existing) {
    const { data: created, error } = await sb
      .from("email_subscribers")
      .insert({
        email,
        name,
        source: opts.source?.slice(0, 60) || null,
        referral: opts.referral?.slice(0, 40) || null,
        sequence: opts.sequence,
        step: 0,
        next_send_at: nextSendAt(0, opts.sequence),
      })
      .select("unsubscribe_token")
      .single();
    if (error || !created) {
      console.error("enroll insert", error?.message);
      return "unavailable";
    }
    await sendNurtureEmail({ sequence: opts.sequence, step: 0, email, name, token: created.unsubscribe_token });
    return "created";
  }

  if (existing.unsubscribed_at) return "kept";
  if (existing.converted_at && (opts.sequence === "tools" || opts.sequence === "general")) return "kept";
  if (existing.sequence === opts.sequence) return "kept";

  const finished = existing.next_send_at === null;
  const higher = sequenceFor(opts.sequence).priority > sequenceFor(existing.sequence).priority;
  if (!higher && !finished) return "kept";

  const { error } = await sb
    .from("email_subscribers")
    .update({
      sequence: opts.sequence,
      step: 0,
      next_send_at: nextSendAt(0, opts.sequence),
      name: existing.name || name,
    })
    .eq("id", existing.id);
  if (error) {
    console.error("enroll switch", error.message);
    return "unavailable";
  }
  await sendNurtureEmail({
    sequence: opts.sequence,
    step: 0,
    email,
    name: existing.name || name,
    token: existing.unsubscribe_token,
  });
  return "switched";
}

/** A payment stops any running sales sequence for that email; they won't get pitches for what they just bought. */
export async function markConverted(email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean) return;
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { error } = await sb
    .from("email_subscribers")
    .update({ converted_at: new Date().toISOString(), next_send_at: null })
    .eq("email", clean)
    .is("converted_at", null);
  if (error) console.error("markConverted", error.message);
}
