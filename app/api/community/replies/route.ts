import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { checkReply, LIMITS } from "@/lib/community/rules";
import { getPost, postedToday, tellAdmin } from "@/lib/community/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!rateLimit(`community-reply:${clientIp(req)}`, 30, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const input = await req.json().catch(() => ({}));
  const reply = checkReply(input);
  if ("error" in reply) return NextResponse.json({ error: reply.error }, { status: 400 });

  const thread = await getPost(Number(input.postId));
  if (!thread) return NextResponse.json({ error: "This question is no longer available." }, { status: 404 });

  if ((await postedToday("community_replies", user.id)) >= LIMITS.repliesPerDay) {
    return NextResponse.json({ error: "You've reached today's limit for replies. Please try again tomorrow." }, { status: 429 });
  }

  const sb = getSupabaseAdmin();
  const { error } = sb
    ? await sb.from("community_replies").insert({ post_id: thread.post.id, user_id: user.id, display_name: reply.name, body: reply.body })
    : { error: true };
  if (error) return NextResponse.json({ error: "We couldn't save your reply. Please try again." }, { status: 503 });

  await tellAdmin(`new reply from ${reply.name}`, `On: ${thread.post.title}\n\n${reply.body}`);
  return NextResponse.json({ ok: true });
}
