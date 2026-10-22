import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";
import { CLIENT_EVENTS, type ClientEvent } from "@/lib/analytics/events";
import { recordEvent } from "@/lib/analytics/server";

/** Browser conversion events (WhatsApp clicks, CTA clicks, PDF saves). Body is JSON sent as text/plain via sendBeacon. */
export async function POST(req: Request) {
  const limited = limitRequest(req, "track", 120, 60 * 60 * 1000);
  if (limited) return limited;

  let body: { name?: string; label?: string; path?: string };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!CLIENT_EVENTS.includes(body.name as ClientEvent)) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }
  const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 200) : null;
  await recordEvent(body.name as ClientEvent, { req, label: body.label, path });
  return new NextResponse(null, { status: 204 });
}
