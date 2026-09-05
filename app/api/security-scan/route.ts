import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type Severity = "critical" | "high" | "medium" | "low" | "info";

export type ScanFinding = {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  page: string;
  description: string;
  recommendation: string;
  evidence?: string;
};

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (h === "0.0.0.0" || h === "::1") return true;
  // Block obvious private IP literals
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)) return true;
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  return false;
}

function normalizeTarget(raw: string): URL | null {
  try {
    const withProto = /^https?:\/\//i.test(raw.trim())
      ? raw.trim()
      : `https://${raw.trim()}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (isPrivateHost(u.hostname)) return null;
    u.hash = "";
    return u;
  } catch {
    return null;
  }
}

async function fetchSafe(
  url: string,
  init?: RequestInit,
): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "DoyinTech-SecurityScan/1.0 (+https://doyintech.vercel.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(init?.headers || {}),
      },
    });
    clearTimeout(t);
    return res;
  } catch {
    return null;
  }
}

function headerGet(headers: Headers, name: string): string | null {
  return headers.get(name) || headers.get(name.toLowerCase());
}

function detectTech(html: string, headers: Headers): string[] {
  const tech: string[] = [];
  const h = html.toLowerCase();
  const server = (headerGet(headers, "server") || "").toLowerCase();
  const powered = (headerGet(headers, "x-powered-by") || "").toLowerCase();
  const generator = (html.match(/<meta[^>]+name=["']generator["'][^>]*>/i) ||
    [])[0] || "";

  if (
    h.includes("__next_data__") ||
    h.includes("/_next/static") ||
    powered.includes("next") ||
    h.includes("next.js")
  ) {
    tech.push("Next.js");
  }
  if (h.includes("__nuxt") || h.includes("/_nuxt/")) tech.push("Nuxt");
  if (h.includes("ng-version") || h.includes("ng-app")) tech.push("Angular");
  if (h.includes("data-reactroot") || h.includes("react")) {
    if (!tech.includes("Next.js")) tech.push("React");
  }
  if (
    generator.toLowerCase().includes("wordpress") ||
    h.includes("wp-content") ||
    h.includes("wp-includes") ||
    h.includes("wp-json")
  ) {
    tech.push("WordPress");
  }
  if (h.includes("cdn.shopify.com") || h.includes("shopify")) tech.push("Shopify");
  if (powered.includes("express") || server.includes("express")) tech.push("Express");
  if (server.includes("nginx")) tech.push("Nginx");
  if (server.includes("cloudflare")) tech.push("Cloudflare");
  if (server.includes("vercel") || headerGet(headers, "x-vercel-id")) {
    tech.push("Vercel");
  }
  if (powered.includes("php") || server.includes("php")) tech.push("PHP");
  if (h.includes("laravel") || headerGet(headers, "set-cookie")?.includes("laravel")) {
    tech.push("Laravel");
  }

  return [...new Set(tech)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = normalizeTarget(String(body.url || ""));
    if (!target) {
      return NextResponse.json(
        { error: "Invalid or disallowed URL" },
        { status: 400 },
      );
    }

    const homeRes = await fetchSafe(target.toString(), { method: "GET" });
    if (!homeRes) {
      return NextResponse.json(
        {
          error:
            "Could not reach this URL from the scanner. Check the address or try again.",
        },
        { status: 422 },
      );
    }

    const finalUrl = homeRes.url || target.toString();
    const headers = homeRes.headers;
    const html = (await homeRes.text()).slice(0, 400_000);
    const tech = detectTech(html, headers);
    const isWordPress = tech.includes("WordPress");
    const isNext = tech.includes("Next.js");

    const findings: ScanFinding[] = [];
    const pagesChecked: { path: string; status: number | null; ok: boolean }[] =
      [];

    // Protocol
    if (target.protocol === "http:") {
      findings.push({
        id: "no-https",
        title: "Site requested over HTTP (no TLS on input URL)",
        severity: "critical",
        category: "Transport",
        page: "/",
        description:
          "The URL you entered uses plain HTTP. Traffic can be intercepted on the network.",
        recommendation: "Use HTTPS and redirect all HTTP traffic to HTTPS.",
        evidence: target.protocol,
      });
    }

    // Security headers (real)
    const hsts = headerGet(headers, "strict-transport-security");
    if (!hsts) {
      findings.push({
        id: "no-hsts",
        title: "Missing Strict-Transport-Security (HSTS)",
        severity: "high",
        category: "Headers",
        page: "/",
        description:
          "No HSTS header was returned on the homepage response.",
        recommendation:
          "Add Strict-Transport-Security with a long max-age once HTTPS is stable.",
        evidence: "Header absent",
      });
    }

    const csp =
      headerGet(headers, "content-security-policy") ||
      headerGet(headers, "content-security-policy-report-only");
    if (!csp) {
      findings.push({
        id: "no-csp",
        title: "Content-Security-Policy not detected",
        severity: "medium",
        category: "Headers",
        page: "/",
        description: "No CSP or CSP-Report-Only header on the homepage.",
        recommendation:
          "Introduce a Content-Security-Policy to reduce XSS impact.",
        evidence: "Header absent",
      });
    }

    const xfo = headerGet(headers, "x-frame-options");
    const frameAncestors = csp?.toLowerCase().includes("frame-ancestors");
    if (!xfo && !frameAncestors) {
      findings.push({
        id: "no-frame-guard",
        title: "Clickjacking protections not detected",
        severity: "medium",
        category: "Headers",
        page: "/",
        description:
          "Neither X-Frame-Options nor CSP frame-ancestors was found.",
        recommendation:
          "Set Content-Security-Policy: frame-ancestors 'self' (preferred).",
        evidence: "X-Frame-Options and frame-ancestors absent",
      });
    }

    const nosniff = headerGet(headers, "x-content-type-options");
    if (!nosniff || !nosniff.toLowerCase().includes("nosniff")) {
      findings.push({
        id: "no-nosniff",
        title: "Missing X-Content-Type-Options: nosniff",
        severity: "low",
        category: "Headers",
        page: "/",
        description: "MIME-sniffing protection header was not present.",
        recommendation: "Send X-Content-Type-Options: nosniff on all responses.",
        evidence: nosniff || "Header absent",
      });
    }

    const referrerPolicy = headerGet(headers, "referrer-policy");
    if (!referrerPolicy) {
      findings.push({
        id: "no-referrer-policy",
        title: "Referrer-Policy not set",
        severity: "low",
        category: "Headers",
        page: "/",
        description:
          "Without Referrer-Policy, full URLs may leak to third parties via the Referer header.",
        recommendation:
          "Set Referrer-Policy to strict-origin-when-cross-origin or stricter.",
        evidence: "Header absent",
      });
    }

    const server = headerGet(headers, "server");
    const powered = headerGet(headers, "x-powered-by");
    if (server || powered) {
      findings.push({
        id: "fingerprint",
        title: "Server / framework fingerprint visible",
        severity: "low",
        category: "Information disclosure",
        page: "/",
        description:
          "Response headers expose technology details useful for targeted attacks.",
        recommendation:
          "Remove or genericise Server and X-Powered-By headers at the edge.",
        evidence: [server && `Server: ${server}`, powered && `X-Powered-By: ${powered}`]
          .filter(Boolean)
          .join(" | "),
      });
    }

    // Cookies
    const setCookies =
      typeof headers.getSetCookie === "function"
        ? headers.getSetCookie()
        : headerGet(headers, "set-cookie")
          ? [headerGet(headers, "set-cookie")!]
          : [];
    for (const c of setCookies) {
      const lower = c.toLowerCase();
      if (lower.includes("session") || lower.includes("token") || lower.includes("auth")) {
        if (!lower.includes("httponly") || !lower.includes("secure")) {
          findings.push({
            id: "cookie-flags",
            title: "Session-related cookie may lack Secure/HttpOnly",
            severity: "high",
            category: "Session",
            page: "/",
            description:
              "A Set-Cookie value that looks session-related is missing recommended flags.",
            recommendation: "Set Secure, HttpOnly, and SameSite on auth cookies.",
            evidence: c.slice(0, 120),
          });
          break;
        }
      }
    }

    // HTML signals
    if (/<form[^>]+>/i.test(html) && !/csrf|_token|authenticity_token/i.test(html)) {
      findings.push({
        id: "form-csrf",
        title: "HTML forms present without obvious CSRF tokens",
        severity: "medium",
        category: "Application",
        page: "/",
        description:
          "Forms were found in the HTML without common CSRF field names. This may be a false positive if tokens are injected by JS.",
        recommendation:
          "Ensure state-changing forms use anti-CSRF tokens or SameSite cookies + origin checks.",
        evidence: "Form tags found; no common CSRF field names in HTML",
      });
    }

    if (/http:\/\//i.test(html) && finalUrl.startsWith("https:")) {
      findings.push({
        id: "mixed-content",
        title: "Possible mixed content (HTTP URLs in HTTPS page)",
        severity: "medium",
        category: "Transport",
        page: "/",
        description:
          "The HTTPS page HTML contains http:// resource references.",
        recommendation: "Upgrade all assets and API calls to HTTPS.",
        evidence: "http:// found in HTML body",
      });
    }

    // Path probes — only report what we actually observe
    const paths = [
      "/robots.txt",
      "/sitemap.xml",
      "/login",
      "/admin",
      "/api",
      "/wp-admin",
      "/wp-login.php",
      "/.env",
      "/.git/config",
      "/phpinfo.php",
    ];

    for (const path of paths) {
      const probeUrl = new URL(path, finalUrl).toString();
      const res = await fetchSafe(probeUrl, { method: "GET" });
      const status = res?.status ?? null;
      const ok = !!(res && res.status > 0 && res.status < 400);
      pagesChecked.push({ path, status, ok });

      // Dangerous exposures
      if (path === "/.env" && res && res.status === 200) {
        const bodyText = (await res.text()).slice(0, 200);
        if (/=/.test(bodyText) || /key|secret|password/i.test(bodyText)) {
          findings.push({
            id: "env-exposed",
            title: ".env file appears publicly accessible",
            severity: "critical",
            category: "Exposure",
            page: path,
            description: "A .env-like response was returned with HTTP 200.",
            recommendation:
              "Immediately block this path and rotate all exposed secrets.",
            evidence: `HTTP ${res.status}`,
          });
        }
      }

      if (path === "/.git/config" && res && res.status === 200) {
        const bodyText = (await res.text()).slice(0, 200);
        if (/\[core\]/i.test(bodyText) || /repositoryformatversion/i.test(bodyText)) {
          findings.push({
            id: "git-exposed",
            title: ".git/config appears publicly accessible",
            severity: "critical",
            category: "Exposure",
            page: path,
            description: "Git metadata may be downloadable from the web root.",
            recommendation: "Block .git at the web server; treat as incident if confirmed.",
            evidence: `HTTP ${res.status}`,
          });
        }
      }

      if (path === "/phpinfo.php" && res && res.status === 200) {
        const bodyText = (await res.text()).slice(0, 300);
        if (/phpinfo|PHP Version/i.test(bodyText)) {
          findings.push({
            id: "phpinfo",
            title: "phpinfo.php appears exposed",
            severity: "high",
            category: "Exposure",
            page: path,
            description: "phpinfo output can leak server configuration.",
            recommendation: "Remove phpinfo from production immediately.",
            evidence: `HTTP ${res.status}`,
          });
        }
      }

      // WordPress paths — only flag if site looks like WordPress OR path returns 200 login page
      if (
        (path === "/wp-admin" || path === "/wp-login.php") &&
        res &&
        (res.status === 200 || res.status === 302 || res.status === 401)
      ) {
        if (isWordPress || path === "/wp-login.php") {
          const bodyText = res.status === 200 ? (await res.clone().text()).slice(0, 500) : "";
          if (
            isWordPress ||
            /wordpress|wp-login|wp-submit/i.test(bodyText)
          ) {
            findings.push({
              id: `wp-${path}`,
              title: `WordPress path responds: ${path}`,
              severity: "medium",
              category: "CMS",
              page: path,
              description:
                "A WordPress-related path returned a live response. This attracts automated attacks.",
              recommendation:
                "Restrict wp-admin, keep WordPress updated, consider limiting by IP.",
              evidence: `HTTP ${res.status}`,
            });
          }
        }
      }
    }

    // Tech-specific notes (accurate)
    if (isNext) {
      findings.push({
        id: "tech-next",
        title: "Next.js application detected",
        severity: "info",
        category: "Stack",
        page: "/",
        description:
          "Signals consistent with Next.js were found (__NEXT_DATA__, /_next/static, or related headers).",
        recommendation:
          "Keep Next.js updated; review security headers at the host (Vercel/Nginx) layer.",
        evidence: tech.join(", "),
      });
    }

    if (isWordPress && !isNext) {
      findings.push({
        id: "tech-wp",
        title: "WordPress signals detected",
        severity: "info",
        category: "Stack",
        page: "/",
        description: "HTML or paths indicate a WordPress site.",
        recommendation: "Keep core, themes, and plugins patched; limit admin exposure.",
        evidence: tech.join(", "),
      });
    }

    // Sort by severity
    const order: Record<Severity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      info: 4,
    };
    findings.sort((a, b) => order[a.severity] - order[b.severity]);

    return NextResponse.json({
      ok: true,
      inputUrl: target.toString(),
      finalUrl,
      status: homeRes.status,
      tech,
      headers: {
        server: server,
        poweredBy: powered,
        hsts: hsts,
        csp: csp ? csp.slice(0, 200) : null,
        xFrameOptions: xfo,
        contentTypeOptions: nosniff,
        referrerPolicy,
      },
      pagesChecked,
      findings,
      scannedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
