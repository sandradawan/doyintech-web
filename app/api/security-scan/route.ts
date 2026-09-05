import { NextRequest, NextResponse } from "next/server";
import tls from "tls";
import { URL } from "url";

export const runtime = "nodejs";
export const maxDuration = 60;

type Severity = "critical" | "high" | "medium" | "low" | "info";

export type ScanFinding = {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  page: string;
  description: string;
  recommendation: string;
  evidence: string;
  verified: boolean;
};

type PageResult = {
  url: string;
  path: string;
  status: number | null;
  ok: boolean;
  title?: string;
};

type TlsInfo = {
  valid: boolean;
  authorized: boolean;
  protocol?: string;
  daysRemaining?: number;
  validFrom?: string;
  validTo?: string;
  issuer?: string;
  subject?: string;
  error?: string;
};

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (h === "0.0.0.0" || h === "::1") return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)) return true;
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
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
  timeoutMs = 10000,
): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "DoyinTech-SecurityScan/2.0 (+https://doyintech.vercel.app)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
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
  return headers.get(name);
}

function detectTech(html: string, headers: Headers): string[] {
  const tech: string[] = [];
  const h = html.toLowerCase();
  const server = (headerGet(headers, "server") || "").toLowerCase();
  const powered = (headerGet(headers, "x-powered-by") || "").toLowerCase();

  if (
    h.includes("__next_data__") ||
    h.includes("/_next/static") ||
    powered.includes("next")
  ) {
    tech.push("Next.js");
  }
  if (h.includes("__nuxt") || h.includes("/_nuxt/")) tech.push("Nuxt");
  if (h.includes("data-reactroot") && !tech.includes("Next.js")) tech.push("React");
  if (
    /name=["']generator["'][^>]*wordpress/i.test(html) ||
    h.includes("/wp-content/") ||
    h.includes("/wp-includes/") ||
    h.includes("wp-json")
  ) {
    tech.push("WordPress");
  }
  if (h.includes("cdn.shopify.com")) tech.push("Shopify");
  if (server.includes("nginx")) tech.push("Nginx");
  if (server.includes("cloudflare") || headerGet(headers, "cf-ray"))
    tech.push("Cloudflare");
  if (headerGet(headers, "x-vercel-id") || server.includes("vercel"))
    tech.push("Vercel");
  if (powered.includes("express")) tech.push("Express");
  if (powered.includes("php")) tech.push("PHP");
  if (headerGet(headers, "set-cookie")?.toLowerCase().includes("laravel"))
    tech.push("Laravel");

  return [...new Set(tech)];
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]{1,120})/i);
  return m?.[1]?.trim();
}

function extractSameOriginLinks(html: string, base: URL): string[] {
  const hrefs = new Set<string>();
  const re = /(?:href|src)=["']([^"'#]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const abs = new URL(m[1], base);
      if (abs.origin !== base.origin) continue;
      if (!["http:", "https:"].includes(abs.protocol)) continue;
      abs.hash = "";
      // skip static assets
      if (/\.(css|js|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|map)(\?|$)/i.test(abs.pathname))
        continue;
      hrefs.add(abs.pathname + abs.search);
    } catch {
      /* ignore */
    }
  }
  return [...hrefs];
}

async function parseRobotsAndSitemap(
  origin: string,
): Promise<{ paths: string[]; robotsRaw?: string }> {
  const paths = new Set<string>();
  const robotsRes = await fetchSafe(`${origin}/robots.txt`, { method: "GET" }, 6000);
  let robotsRaw: string | undefined;
  if (robotsRes && robotsRes.status === 200) {
    robotsRaw = (await robotsRes.text()).slice(0, 50_000);
    for (const line of robotsRaw.split("\n")) {
      const dis = line.match(/^disallow:\s*(.+)/i);
      if (dis?.[1] && dis[1].trim() !== "/") {
        const p = dis[1].trim().split(" ")[0];
        if (p.startsWith("/") && p.length < 120) paths.add(p.split("*")[0] || p);
      }
      const sm = line.match(/^sitemap:\s*(.+)/i);
      if (sm?.[1]) {
        const smUrl = sm[1].trim();
        const smRes = await fetchSafe(smUrl, { method: "GET" }, 6000);
        if (smRes && smRes.status === 200) {
          const xml = (await smRes.text()).slice(0, 100_000);
          const locs = xml.matchAll(/<loc>([^<]+)<\/loc>/gi);
          for (const loc of locs) {
            try {
              const u = new URL(loc[1].trim());
              if (u.origin === new URL(origin).origin) {
                paths.add(u.pathname + u.search);
              }
            } catch {
              /* ignore */
            }
          }
        }
      }
    }
  }
  // Also try default sitemap
  if (paths.size < 5) {
    const smRes = await fetchSafe(`${origin}/sitemap.xml`, { method: "GET" }, 6000);
    if (smRes && smRes.status === 200) {
      const xml = (await smRes.text()).slice(0, 100_000);
      const locs = xml.matchAll(/<loc>([^<]+)<\/loc>/gi);
      for (const loc of locs) {
        try {
          const u = new URL(loc[1].trim());
          if (u.origin === new URL(origin).origin) paths.add(u.pathname + u.search);
        } catch {
          /* ignore */
        }
      }
    }
  }
  return { paths: [...paths].slice(0, 40), robotsRaw };
}

function checkTls(hostname: string, port = 443): Promise<TlsInfo> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        rejectUnauthorized: false,
        timeout: 8000,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          const protocol = socket.getProtocol() || undefined;
          const validTo = cert.valid_to ? new Date(cert.valid_to) : undefined;
          const validFrom = cert.valid_from ? new Date(cert.valid_from) : undefined;
          const daysRemaining = validTo
            ? Math.floor((validTo.getTime() - Date.now()) / 86400000)
            : undefined;
          socket.end();
          resolve({
            valid: !!cert && daysRemaining !== undefined && daysRemaining > 0,
            authorized,
            protocol: protocol || undefined,
            daysRemaining,
            validFrom: validFrom?.toISOString(),
            validTo: validTo?.toISOString(),
            issuer: cert.issuer
              ? Object.values(cert.issuer).join(", ")
              : undefined,
            subject: cert.subject
              ? Object.values(cert.subject).join(", ")
              : undefined,
          });
        } catch (e) {
          socket.end();
          resolve({
            valid: false,
            authorized: false,
            error: e instanceof Error ? e.message : "TLS read failed",
          });
        }
      },
    );
    socket.on("error", (err) => {
      resolve({ valid: false, authorized: false, error: err.message });
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ valid: false, authorized: false, error: "TLS timeout" });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = normalizeTarget(String(body.url || ""));
    if (!target) {
      return NextResponse.json(
        { error: "Invalid or disallowed URL (public http/https only)" },
        { status: 400 },
      );
    }

    const homeRes = await fetchSafe(target.toString(), { method: "GET" });
    if (!homeRes) {
      return NextResponse.json(
        { error: "Could not reach this URL from the scanner." },
        { status: 422 },
      );
    }

    const finalUrl = homeRes.url || target.toString();
    const finalBase = new URL(finalUrl);
    const headers = homeRes.headers;
    const html = (await homeRes.text()).slice(0, 500_000);
    const tech = detectTech(html, headers);
    const isWordPress = tech.includes("WordPress");
    const isNext = tech.includes("Next.js");
    const findings: ScanFinding[] = [];

    // ——— TLS ———
    let tlsInfo: TlsInfo | null = null;
    if (finalBase.protocol === "https:") {
      tlsInfo = await checkTls(finalBase.hostname);
      if (tlsInfo.error) {
        findings.push({
          id: "tls-error",
          title: "TLS connection problem",
          severity: "high",
          category: "TLS",
          page: "/",
          description: "Could not fully validate the certificate chain from the scanner.",
          recommendation: "Verify certificate installation and chain completeness.",
          evidence: tlsInfo.error,
          verified: true,
        });
      } else {
        if (tlsInfo.daysRemaining !== undefined && tlsInfo.daysRemaining < 0) {
          findings.push({
            id: "tls-expired",
            title: "TLS certificate expired",
            severity: "critical",
            category: "TLS",
            page: "/",
            description: "The certificate valid-to date is in the past.",
            recommendation: "Renew the certificate immediately.",
            evidence: `validTo=${tlsInfo.validTo}`,
            verified: true,
          });
        } else if (
          tlsInfo.daysRemaining !== undefined &&
          tlsInfo.daysRemaining < 14
        ) {
          findings.push({
            id: "tls-expiring",
            title: "TLS certificate expires within 14 days",
            severity: "high",
            category: "TLS",
            page: "/",
            description: "Certificate renewal is urgent to avoid browser warnings.",
            recommendation: "Renew before expiry; enable auto-renew if possible.",
            evidence: `daysRemaining=${tlsInfo.daysRemaining}; validTo=${tlsInfo.validTo}`,
            verified: true,
          });
        }
        if (!tlsInfo.authorized) {
          findings.push({
            id: "tls-untrusted",
            title: "Certificate not trusted by default chain",
            severity: "high",
            category: "TLS",
            page: "/",
            description:
              "Node could not verify the cert against default CAs (may be incomplete chain).",
            recommendation: "Install the full chain (intermediate certificates).",
            evidence: tlsInfo.issuer || "authorized=false",
            verified: true,
          });
        }
      }
    } else {
      findings.push({
        id: "no-https",
        title: "Site served over HTTP (no TLS on final URL)",
        severity: "critical",
        category: "Transport",
        page: "/",
        description: "Final URL is not HTTPS.",
        recommendation: "Enable HTTPS and redirect all HTTP traffic.",
        evidence: finalBase.protocol,
        verified: true,
      });
    }

    // HTTP → HTTPS redirect check if user entered http
    if (target.protocol === "http:" && finalBase.protocol === "https:") {
      // good — redirected
    } else if (target.protocol === "http:") {
      findings.push({
        id: "http-no-redirect",
        title: "HTTP URL did not redirect to HTTPS",
        severity: "high",
        category: "Transport",
        page: "/",
        description: "Entered HTTP and stayed on HTTP.",
        recommendation: "Force HTTPS redirects at the edge.",
        evidence: `input=${target.protocol} final=${finalBase.protocol}`,
        verified: true,
      });
    }

    // ——— Headers ———
    const hsts = headerGet(headers, "strict-transport-security");
    if (!hsts && finalBase.protocol === "https:") {
      findings.push({
        id: "no-hsts",
        title: "Missing Strict-Transport-Security (HSTS)",
        severity: "high",
        category: "Headers",
        page: "/",
        description: "No HSTS header on the homepage response.",
        recommendation: "Add Strict-Transport-Security with a long max-age.",
        evidence: "Header absent",
        verified: true,
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
        description: "No CSP or CSP-Report-Only header.",
        recommendation: "Deploy a Content-Security-Policy to reduce XSS impact.",
        evidence: "Header absent",
        verified: true,
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
        description: "Neither X-Frame-Options nor CSP frame-ancestors found.",
        recommendation: "Set CSP frame-ancestors 'self' or X-Frame-Options.",
        evidence: "Both absent",
        verified: true,
      });
    }

    const nosniff = headerGet(headers, "x-content-type-options");
    if (!nosniff?.toLowerCase().includes("nosniff")) {
      findings.push({
        id: "no-nosniff",
        title: "Missing X-Content-Type-Options: nosniff",
        severity: "low",
        category: "Headers",
        page: "/",
        description: "MIME-sniffing protection header missing.",
        recommendation: "Send X-Content-Type-Options: nosniff.",
        evidence: nosniff || "Header absent",
        verified: true,
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
        description: "Referrer-Policy header missing.",
        recommendation: "Use strict-origin-when-cross-origin or stricter.",
        evidence: "Header absent",
        verified: true,
      });
    }

    const xcto = headerGet(headers, "permissions-policy");
    if (!xcto) {
      findings.push({
        id: "no-permissions-policy",
        title: "Permissions-Policy not set",
        severity: "info",
        category: "Headers",
        page: "/",
        description: "Permissions-Policy header not present.",
        recommendation: "Restrict camera, mic, geolocation as needed.",
        evidence: "Header absent",
        verified: true,
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
        description: "Technology details exposed in response headers.",
        recommendation: "Remove or genericise Server and X-Powered-By.",
        evidence: [server && `Server: ${server}`, powered && `X-Powered-By: ${powered}`]
          .filter(Boolean)
          .join(" | "),
        verified: true,
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
      if (/session|token|auth|sid|jwt/i.test(c)) {
        const missing: string[] = [];
        if (!lower.includes("httponly")) missing.push("HttpOnly");
        if (!lower.includes("secure") && finalBase.protocol === "https:")
          missing.push("Secure");
        if (!lower.includes("samesite")) missing.push("SameSite");
        if (missing.length) {
          findings.push({
            id: "cookie-flags",
            title: "Session-related cookie missing recommended flags",
            severity: "high",
            category: "Session",
            page: "/",
            description: `Cookie appears session-related but lacks: ${missing.join(", ")}.`,
            recommendation: "Set Secure, HttpOnly, and SameSite on auth cookies.",
            evidence: c.slice(0, 160),
            verified: true,
          });
          break;
        }
      }
    }

    // HTML heuristics (marked verified:false when soft)
    if (/<form[^>]+>/i.test(html) && !/csrf|_token|authenticity_token|nonce/i.test(html)) {
      findings.push({
        id: "form-csrf",
        title: "Forms found without obvious CSRF token fields in HTML",
        severity: "medium",
        category: "Application",
        page: "/",
        description:
          "May be a false positive if tokens are injected by JavaScript.",
        recommendation: "Ensure CSRF protection on state-changing requests.",
        evidence: "<form> present; no common CSRF field names in HTML source",
        verified: false,
      });
    }

    if (/http:\/\//i.test(html) && finalUrl.startsWith("https:")) {
      findings.push({
        id: "mixed-content",
        title: "HTTP URLs found inside HTTPS page HTML",
        severity: "medium",
        category: "Transport",
        page: "/",
        description: "Possible mixed content.",
        recommendation: "Serve all assets over HTTPS.",
        evidence: "http:// substring in HTML body",
        verified: true,
      });
    }

    // ——— Discover pages ———
    const { paths: robotPaths, robotsRaw } = await parseRobotsAndSitemap(
      finalBase.origin,
    );
    const linkPaths = extractSameOriginLinks(html, finalBase);

    const sensitiveProbes = [
      "/.env",
      "/.git/config",
      "/phpinfo.php",
      "/server-status",
      "/wp-admin",
      "/wp-login.php",
      "/admin",
      "/login",
      "/api",
      "/robots.txt",
      "/sitemap.xml",
    ];

    const toVisit = new Set<string>(["/"]);
    for (const p of linkPaths.slice(0, 20)) toVisit.add(p.split("#")[0]);
    for (const p of robotPaths.slice(0, 15)) toVisit.add(p);
    for (const p of sensitiveProbes) toVisit.add(p);

    const pages: PageResult[] = [
      {
        url: finalUrl,
        path: finalBase.pathname || "/",
        status: homeRes.status,
        ok: homeRes.ok,
        title: extractTitle(html),
      },
    ];

    const visitList = [...toVisit].filter((p) => p !== finalBase.pathname).slice(0, 22);

    for (const path of visitList) {
      const probeUrl = new URL(path, finalBase.origin).toString();
      const res = await fetchSafe(probeUrl, { method: "GET" }, 7000);
      const status = res?.status ?? null;
      let title: string | undefined;
      let bodySlice = "";
      if (res && status && status < 500) {
        bodySlice = (await res.text()).slice(0, 8000);
        title = extractTitle(bodySlice);
      }
      pages.push({
        url: probeUrl,
        path,
        status,
        ok: !!(res && status !== null && status < 400),
        title,
      });

      // Critical exposures — only with body proof
      if (path === "/.env" && res && status === 200) {
        if (/=/.test(bodySlice) && /[A-Z0-9_]{2,}=/.test(bodySlice)) {
          findings.push({
            id: "env-exposed",
            title: ".env appears publicly accessible",
            severity: "critical",
            category: "Exposure",
            page: path,
            description: "Environment file content pattern returned with HTTP 200.",
            recommendation: "Block immediately and rotate all secrets.",
            evidence: `HTTP 200; body matches KEY=value pattern`,
            verified: true,
          });
        }
      }
      if (path === "/.git/config" && res && status === 200) {
        if (/\[core\]|repositoryformatversion/i.test(bodySlice)) {
          findings.push({
            id: "git-exposed",
            title: ".git/config appears publicly accessible",
            severity: "critical",
            category: "Exposure",
            page: path,
            description: "Git config content returned publicly.",
            recommendation: "Deny .git at the web server; treat as incident.",
            evidence: "HTTP 200; git config signatures in body",
            verified: true,
          });
        }
      }
      if (path === "/phpinfo.php" && res && status === 200) {
        if (/phpinfo\(|PHP Version/i.test(bodySlice)) {
          findings.push({
            id: "phpinfo",
            title: "phpinfo.php exposed",
            severity: "high",
            category: "Exposure",
            page: path,
            description: "phpinfo output detected.",
            recommendation: "Remove from production.",
            evidence: "HTTP 200; phpinfo markers in body",
            verified: true,
          });
        }
      }

      // WordPress paths only if WP detected or body proves WP login
      if (
        (path === "/wp-admin" || path === "/wp-login.php") &&
        res &&
        status &&
        status < 400
      ) {
        if (isWordPress || /wp-login|wordpress|wp-submit/i.test(bodySlice)) {
          findings.push({
            id: `wp-${path}`,
            title: `WordPress path responds: ${path}`,
            severity: "medium",
            category: "CMS",
            page: path,
            description: "WordPress admin/login surface is reachable.",
            recommendation: "Restrict access; keep WordPress updated.",
            evidence: `HTTP ${status}; WP signals`,
            verified: true,
          });
        }
      }
    }

    if (robotsRaw && /disallow:\s*\/admin/i.test(robotsRaw)) {
      findings.push({
        id: "robots-admin",
        title: "robots.txt references /admin",
        severity: "info",
        category: "Recon",
        page: "/robots.txt",
        description: "Disallow rules can reveal sensitive path names.",
        recommendation: "Avoid advertising private paths in robots.txt.",
        evidence: "Disallow rule mentioning /admin",
        verified: true,
      });
    }

    // Stack info (verified)
    if (isNext) {
      findings.push({
        id: "tech-next",
        title: "Next.js application detected",
        severity: "info",
        category: "Stack",
        page: "/",
        description: "Hard signals for Next.js were present.",
        recommendation: "Keep Next.js and dependencies updated; set security headers at the edge.",
        evidence: tech.join(", "),
        verified: true,
      });
    }
    if (isWordPress && !isNext) {
      findings.push({
        id: "tech-wp",
        title: "WordPress signals detected",
        severity: "info",
        category: "Stack",
        page: "/",
        description: "HTML/path signals indicate WordPress.",
        recommendation: "Patch core/plugins; limit admin exposure.",
        evidence: tech.join(", "),
        verified: true,
      });
    }

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
      tls: tlsInfo,
      headers: {
        server,
        poweredBy: powered,
        hsts,
        csp: csp ? csp.slice(0, 240) : null,
        xFrameOptions: xfo,
        contentTypeOptions: nosniff,
        referrerPolicy,
        permissionsPolicy: xcto,
      },
      pagesChecked: pages,
      findings,
      scope: {
        checks: [
          "TLS certificate",
          "Security headers",
          "Cookie flags",
          "Same-origin link crawl",
          "robots.txt / sitemap discovery",
          "Sensitive path probes with body verification",
          "Stack fingerprint from HTML/headers",
        ],
        notChecked: [
          "Authenticated / logged-in areas",
          "Business logic flaws",
          "Full XSS/SQLi exploit verification",
          "Rate-limit bypass",
          "Mobile app APIs behind auth",
        ],
      },
      scannedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
