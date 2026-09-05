import { NextRequest, NextResponse } from "next/server";
import tls from "tls";

export const runtime = "nodejs";
export const maxDuration = 30;

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (/^(10\.|127\.|192\.168\.|169\.254\.)/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
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

async function fetchSafe(url: string, timeoutMs = 10000): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "manual",
      headers: {
        "User-Agent": "DoyinTech-SecurityLite/1.0 (+https://doyintech.vercel.app)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
    });
    clearTimeout(t);
    return res;
  } catch {
    return null;
  }
}

async function fetchFollow(url: string, maxHops = 8) {
  const chain: { url: string; status: number | null }[] = [];
  let current = url;
  for (let i = 0; i < maxHops; i++) {
    const res = await fetchSafe(current, 8000);
    if (!res) {
      chain.push({ url: current, status: null });
      break;
    }
    chain.push({ url: current, status: res.status });
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get("location");
      if (!loc) break;
      current = new URL(loc, current).toString();
      continue;
    }
    const html = (await res.text()).slice(0, 400_000);
    return { chain, finalUrl: current, status: res.status, headers: res.headers, html };
  }
  return { chain, finalUrl: current, status: chain.at(-1)?.status ?? null, headers: null as Headers | null, html: "" };
}

function checkTls(hostname: string): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: false, timeout: 8000 },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const validTo = cert.valid_to ? new Date(cert.valid_to) : undefined;
          const daysRemaining = validTo
            ? Math.floor((validTo.getTime() - Date.now()) / 86400000)
            : undefined;
          socket.end();
          resolve({
            authorized: socket.authorized,
            protocol: socket.getProtocol(),
            daysRemaining,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            issuer: cert.issuer ? Object.values(cert.issuer).join(", ") : null,
            subject: cert.subject ? Object.values(cert.subject).join(", ") : null,
          });
        } catch (e) {
          socket.end();
          resolve({ error: e instanceof Error ? e.message : "TLS failed" });
        }
      },
    );
    socket.on("error", (err) => resolve({ error: err.message }));
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ error: "TLS timeout" });
    });
  });
}

const HEADER_SPECS = [
  { key: "strict-transport-security", name: "HSTS", weight: 20 },
  { key: "content-security-policy", name: "CSP", weight: 20 },
  { key: "x-frame-options", name: "X-Frame-Options", weight: 15 },
  { key: "x-content-type-options", name: "X-Content-Type-Options", weight: 15 },
  { key: "referrer-policy", name: "Referrer-Policy", weight: 15 },
  { key: "permissions-policy", name: "Permissions-Policy", weight: 15 },
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "headers");
    const target = normalizeTarget(String(body.url || ""));
    if (!target) {
      return NextResponse.json({ error: "Invalid or disallowed URL" }, { status: 400 });
    }

    if (mode === "ssl") {
      if (target.protocol !== "https:") {
        return NextResponse.json({
          mode,
          inputUrl: target.toString(),
          https: false,
          message: "URL is not HTTPS",
          tls: null,
        });
      }
      const tlsInfo = await checkTls(target.hostname);
      const followed = await fetchFollow(target.toString().replace(/^https:/, "http:"));
      return NextResponse.json({
        mode,
        inputUrl: target.toString(),
        https: true,
        tls: tlsInfo,
        httpRedirectChain: followed.chain,
      });
    }

    if (mode === "redirects") {
      const followed = await fetchFollow(target.toString());
      return NextResponse.json({
        mode,
        inputUrl: target.toString(),
        chain: followed.chain,
        finalUrl: followed.finalUrl,
        hops: followed.chain.length,
      });
    }

    if (mode === "exposed") {
      const paths = [
        "/.env",
        "/.git/config",
        "/.git/HEAD",
        "/phpinfo.php",
        "/server-status",
        "/backup.zip",
        "/backup.sql",
        "/wp-config.php.bak",
        "/config.php.bak",
        "/admin",
        "/administrator",
        "/wp-admin",
        "/wp-login.php",
      ];
      const results = [];
      for (const path of paths) {
        const url = new URL(path, target.origin).toString();
        const res = await fetchSafe(url, 6000);
        let evidence = "";
        let risk = false;
        if (res && res.status === 200) {
          const text = (await res.text()).slice(0, 2000);
          if (path.includes(".env") && /[A-Z0-9_]+=/.test(text)) {
            risk = true;
            evidence = "KEY=value pattern";
          } else if (path.includes(".git") && (/\[core\]/i.test(text) || /ref:/i.test(text))) {
            risk = true;
            evidence = "git metadata";
          } else if (path.includes("phpinfo") && /phpinfo|PHP Version/i.test(text)) {
            risk = true;
            evidence = "phpinfo output";
          } else if (/\.bak|backup\./i.test(path) && text.length > 50) {
            risk = true;
            evidence = "non-empty 200 response";
          } else if (res.status === 200 && (path.includes("admin") || path.includes("wp-"))) {
            evidence = "HTTP 200";
          }
        }
        results.push({
          path,
          status: res?.status ?? null,
          risk,
          evidence: evidence || (res ? `HTTP ${res.status}` : "unreachable"),
        });
      }
      return NextResponse.json({ mode, inputUrl: target.toString(), results });
    }

    if (mode === "robots") {
      const robotsUrl = `${target.origin}/robots.txt`;
      const sitemapUrl = `${target.origin}/sitemap.xml`;
      const robotsRes = await fetchSafe(robotsUrl);
      const sitemapRes = await fetchSafe(sitemapUrl);
      const robotsText =
        robotsRes && robotsRes.status === 200
          ? (await robotsRes.text()).slice(0, 30_000)
          : null;
      const sitemapText =
        sitemapRes && sitemapRes.status === 200
          ? (await sitemapRes.text()).slice(0, 30_000)
          : null;
      const disallows =
        robotsText
          ?.split("\n")
          .filter((l) => /^disallow:/i.test(l))
          .map((l) => l.replace(/^disallow:\s*/i, "").trim())
          .filter(Boolean) || [];
      const sitemaps =
        robotsText
          ?.split("\n")
          .filter((l) => /^sitemap:/i.test(l))
          .map((l) => l.replace(/^sitemap:\s*/i, "").trim()) || [];
      return NextResponse.json({
        mode,
        robotsStatus: robotsRes?.status ?? null,
        sitemapStatus: sitemapRes?.status ?? null,
        robotsText,
        disallows,
        sitemaps,
        sitemapHasLocs: sitemapText ? (sitemapText.match(/<loc>/gi) || []).length : 0,
      });
    }

    // Default path: fetch page with redirects followed for headers/cookies/mixed/csp
    const followed = await fetchFollow(target.toString());
    const headers = followed.headers;
    const html = followed.html || "";

    if (mode === "headers" || mode === "all") {
      const present: Record<string, string | null> = {};
      let score = 0;
      const detail = HEADER_SPECS.map((spec) => {
        let val = headers?.get(spec.key) || null;
        if (spec.key === "content-security-policy" && !val) {
          val = headers?.get("content-security-policy-report-only") || null;
        }
        // frame-ancestors can substitute xfo
        if (spec.key === "x-frame-options" && !val) {
          const csp = headers?.get("content-security-policy") || "";
          if (/frame-ancestors/i.test(csp)) val = "(via CSP frame-ancestors)";
        }
        present[spec.key] = val;
        const ok = !!val;
        if (ok) score += spec.weight;
        return { ...spec, value: val, ok };
      });
      return NextResponse.json({
        mode: "headers",
        inputUrl: target.toString(),
        finalUrl: followed.finalUrl,
        score,
        grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : score >= 30 ? "D" : "F",
        headers: detail,
      });
    }

    if (mode === "cookies") {
      const raw =
        headers && typeof headers.getSetCookie === "function"
          ? headers.getSetCookie()
          : headers?.get("set-cookie")
            ? [headers.get("set-cookie")!]
            : [];
      const cookies = raw.map((c) => {
        const lower = c.toLowerCase();
        return {
          raw: c.slice(0, 200),
          httpOnly: lower.includes("httponly"),
          secure: lower.includes("secure"),
          sameSite: /samesite=(lax|strict|none)/i.exec(c)?.[1] || null,
        };
      });
      return NextResponse.json({
        mode,
        finalUrl: followed.finalUrl,
        cookies,
        count: cookies.length,
      });
    }

    if (mode === "mixed") {
      const httpsPage = followed.finalUrl.startsWith("https:");
      const matches = httpsPage ? [...html.matchAll(/http:\/\/[^"'\s)]+/gi)].map((m) => m[0]) : [];
      const unique = [...new Set(matches)].slice(0, 40);
      return NextResponse.json({
        mode,
        finalUrl: followed.finalUrl,
        httpsPage,
        mixedCount: unique.length,
        samples: unique,
      });
    }

    if (mode === "csp") {
      const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map((m) => m[1]);
      const hosts = new Set<string>();
      for (const src of scripts) {
        try {
          hosts.add(new URL(src, followed.finalUrl).origin);
        } catch {
          /* ignore */
        }
      }
      const existing =
        headers?.get("content-security-policy") ||
        headers?.get("content-security-policy-report-only");
      const scriptSrc = ["'self'", ...hosts].join(" ");
      const generated = [
        `default-src 'self';`,
        `script-src ${scriptSrc};`,
        `style-src 'self' 'unsafe-inline';`,
        `img-src 'self' data: https:;`,
        `font-src 'self' data:;`,
        `connect-src 'self';`,
        `frame-ancestors 'self';`,
        `base-uri 'self';`,
        `form-action 'self';`,
      ].join(" ");
      return NextResponse.json({
        mode,
        finalUrl: followed.finalUrl,
        existingCsp: existing,
        scriptHosts: [...hosts],
        generated,
        note: "Starter policy — test in report-only mode before enforcing.",
      });
    }

    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
