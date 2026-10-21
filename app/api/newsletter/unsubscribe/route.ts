import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

async function unsubscribe(token: string): Promise<boolean> {
  if (!/^[a-f0-9]{16,64}$/i.test(token)) return false;
  const sb = getSupabaseAdmin();
  if (!sb) return false;
  const { data } = await sb
    .from("email_subscribers")
    .update({ unsubscribed_at: new Date().toISOString(), next_send_at: null })
    .eq("unsubscribe_token", token)
    .select("id");
  return Boolean(data?.length);
}

function page(message: string) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>DoyinTech emails</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0e17;color:#f5f5f7;font-family:system-ui,sans-serif;padding:24px;text-align:center}a{color:#ff8c14}</style></head>
<body><div><h1 style="font-size:22px">${message}</h1><p><a href="/">Back to DoyinTech</a></p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/** Link in every email. */
export async function GET(req: NextRequest) {
  const ok = await unsubscribe(req.nextUrl.searchParams.get("token") || "");
  return page(ok ? "You've been unsubscribed. No more emails from this list." : "This link is invalid or already used.");
}

/** RFC 8058 one-click unsubscribe (Gmail/Yahoo "Unsubscribe" button). */
export async function POST(req: NextRequest) {
  await unsubscribe(req.nextUrl.searchParams.get("token") || "");
  return new NextResponse(null, { status: 200 });
}
