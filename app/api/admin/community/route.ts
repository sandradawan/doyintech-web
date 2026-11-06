import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { postPath } from "@/lib/community/rules";
import { refreshReplyCount, tellMember } from "@/lib/community/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const SETUP_HINT = "Run supabase/migrations/011_community.sql in the Supabase SQL editor.";

/** The moderation queue: everything waiting for a decision, plus open reports with the reported text. */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [posts, replies, reports] = await Promise.all([
    sb.from("community_posts").select("id, display_name, topic, title, body, created_at").eq("status", "pending").order("created_at").limit(100),
    sb.from("community_replies").select("id, post_id, display_name, body, created_at, community_posts(title)").eq("status", "pending").order("created_at").limit(100),
    sb.from("community_reports").select("id, kind, item_id, reason, created_at").eq("resolved", false).order("created_at").limit(100),
  ]);
  if (posts.error || replies.error || reports.error) return NextResponse.json({ error: "The community tables aren't set up.", hint: SETUP_HINT }, { status: 503 });

  const open = reports.data || [];
  const idsOf = (kind: string) => open.filter((r) => r.kind === kind).map((r) => r.item_id);
  const [reportedPosts, reportedReplies] = await Promise.all([
    sb.from("community_posts").select("id, title, body").in("id", idsOf("post")),
    sb.from("community_replies").select("id, body").in("id", idsOf("reply")),
  ]);
  const text = (r: { kind: string; item_id: number }) => {
    if (r.kind === "post") {
      const p = reportedPosts.data?.find((x) => x.id === r.item_id);
      return p ? `${p.title}\n\n${p.body}` : "(deleted)";
    }
    return reportedReplies.data?.find((x) => x.id === r.item_id)?.body ?? "(deleted)";
  };

  return NextResponse.json({ posts: posts.data, replies: replies.data, reports: open.map((r) => ({ ...r, text: text(r) })) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { kind, id, action } = (await req.json().catch(() => ({}))) as { kind?: string; id?: number; action?: string };
  if (!Number.isSafeInteger(id) || !["post", "reply", "report"].includes(kind ?? "") || !["approve", "reject", "dismiss"].includes(action ?? "")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (kind === "report") {
    await sb.from("community_reports").update({ resolved: true }).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  const approve = action === "approve";
  const patch = { status: approve ? "approved" : "rejected", approved_at: approve ? new Date().toISOString() : null };

  if (kind === "post") {
    const { data: post, error } = await sb.from("community_posts").update(patch).eq("id", id).select("id, title, user_id").single();
    if (error) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    revalidatePath(postPath(post));
    if (approve) await tellMember(post.user_id, "Your question is live", post, "Your question is now on the DoyinTech Community.");
  } else {
    const { data: reply, error } = await sb.from("community_replies").update(patch).eq("id", id).select("post_id, user_id").single();
    if (error) return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    await refreshReplyCount(reply.post_id);
    const { data: post } = await sb.from("community_posts").select("id, title, user_id").eq("id", reply.post_id).single();
    if (post) {
      revalidatePath(postPath(post));
      if (approve && post.user_id !== reply.user_id) await tellMember(post.user_id, "Someone answered your question", post, "There's a new reply to your question.");
    }
  }

  revalidatePath("/community");
  await sb.from("community_reports").update({ resolved: true }).eq("kind", kind).eq("item_id", id);
  return NextResponse.json({ ok: true });
}
