import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Enforce HTTPS + security headers at the edge.
 * Vercel already terminates TLS; this covers edge cases (preview misconfig, proxies).
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    request.headers.get("x-forwarded-protocol") ||
    url.protocol.replace(":", "");

  // Force HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    proto === "http" &&
    !url.hostname.includes("localhost")
  ) {
    const httpsUrl = url.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  const response = NextResponse.next();

  // Upgrade any residual http subresources
  response.headers.set(
    "Content-Security-Policy",
    "upgrade-insecure-requests"
  );

  // Help browsers treat the origin as HTTPS-only
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|woff2)$).*)",
  ],
};
