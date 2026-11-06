import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { checkPost, LIMITS } from "@/lib/community/rules";
import { postedToday, tellAdmin } from "@/lib/community/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!rateLimit(`community-post:${clientIp(req)}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const input = await req.json().catch(() => ({}));
  const post = checkPost(input);
  if ("error" in post) return NextResponse.json({ error: post.error }, { status: 400 });

  if ((await postedToday("community_posts", user.id)) >= LIMITS.postsPerDay) {
    return NextResponse.json({ error: "You've reached today's limit for new questions. Please try again tomorrow." }, { status: 429 });
  }

  const sb = getSupabaseAdmin();
  const { error } = sb
    ? await sb.from("community_posts").insert({ user_id: user.id, display_name: post.name, topic: post.topic, title: post.title, body: post.body })
    : { error: true };
  if (error) return NextResponse.json({ error: "The community isn't open yet. Please try again soon." }, { status: 503 });

  await tellAdmin(`new question from ${post.name}`, `${post.title}\n\n${post.body}`);
  return NextResponse.json({ ok: true });
}
