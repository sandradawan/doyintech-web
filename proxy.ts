import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Forces HTTPS in production. Security headers (incl. CSP) live in next.config.ts. */
export function proxy(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto");
  if (process.env.NODE_ENV === "production" && proto === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|woff2)$).*)",
  ],
};
