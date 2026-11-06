/** Server-only community helpers. Public reads pick their columns, so user ids never reach a page. */
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/site";
import { postPath, type PublicPost, type PublicReply } from "./rules";

const POST_COLUMNS = "id, display_name, topic, title, body, reply_count, created_at";

/** Approved posts, newest first, or null if the board isn't set up yet. */
export async function listPosts(limit = 50): Promise<PublicPost[] | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb.from("community_posts").select(POST_COLUMNS).eq("status", "approved").order("approved_at", { ascending: false }).limit(limit);
  return error ? null : (data as PublicPost[]);
}

export async function getPost(id: number): Promise<{ post: PublicPost; replies: PublicReply[] } | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data: post } = await sb.from("community_posts").select(POST_COLUMNS).eq("id", id).eq("status", "approved").maybeSingle();
  if (!post) return null;
  const { data: replies } = await sb.from("community_replies").select("id, display_name, body, created_at").eq("post_id", id).eq("status", "approved").order("created_at");
  return { post: post as PublicPost, replies: (replies || []) as PublicReply[] };
}

/** How many rows this member created in the last 24 hours, for the daily limits. */
export async function postedToday(table: "community_posts" | "community_replies", userId: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return 0;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since);
  return count ?? 0;
}

async function send(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>",
      to: [to],
      subject: subject.replace(/\s+/g, " ").slice(0, 150),
      text,
    });
  } catch {
    /* a missed email must not fail the action */
  }
}

export function tellAdmin(subject: string, text: string) {
  return send(process.env.CONTACT_TO_EMAIL || "hello@doyintech.com", `Community: ${subject}`, `${text}\n\nReview: ${absoluteUrl("/admin/community")}`);
}

export async function tellMember(userId: string | null, subject: string, post: { id: number; title: string }, line: string) {
  const sb = getSupabaseAdmin();
  if (!sb || !userId) return;
  const { data } = await sb.auth.admin.getUserById(userId);
  if (data.user?.email) await send(data.user.email, subject, `${line}\n\n${post.title}\n${absoluteUrl(postPath(post))}\n\nDoyinTech Community`);
}

/** Reply counts are recounted rather than incremented, so approving and removing can't drift. */
export async function refreshReplyCount(postId: number) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { count } = await sb.from("community_replies").select("id", { count: "exact", head: true }).eq("post_id", postId).eq("status", "approved");
  await sb.from("community_posts").update({ reply_count: count ?? 0 }).eq("id", postId);
}
