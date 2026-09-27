import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { WHATSAPP_NUMBER } from "@/lib/chatbot-knowledge";
import {
  checkSiteHealth,
  formatOpsReport,
  siteBaseUrl,
  type DailyOpsReport,
} from "@/lib/daily-ops";

/**
 * Comprehensive daily website operations (unattended monitoring + digest).
 *
 * Does NOT auto-edit code or deploy — that stays human/Grok-approved.
 * Does: health-check money paths, pull recent leads, email + optional WhatsApp report.
 *
 * Vercel Cron: morning + evening (see vercel.json)
 * Auth: Authorization: Bearer CRON_SECRET
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = siteBaseUrl();
  const actions: string[] = [];
  const errors: string[] = [];

  let health: DailyOpsReport["health"] = [];
  try {
    health = await checkSiteHealth(baseUrl);
    const bad = health.filter((h) => !h.ok);
    if (bad.length) {
      actions.push(
        `FIX ASAP: ${bad.map((b) => `${b.path}(${b.status || "down"})`).join(", ")}`
      );
    } else {
      actions.push("All money paths healthy — no deploy required for uptime.");
    }
  } catch (e) {
    errors.push(`Health check failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  let leadsLast24h = 0;
  let leadsSample: DailyOpsReport["leadsSample"] = [];
  try {
    const sb = getSupabaseAdmin();
    if (sb) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await sb
        .from("site_leads")
        .select("type, product, name, email, source, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        errors.push(`Leads query: ${error.message}`);
      } else {
        leadsSample = data || [];
        leadsLast24h = leadsSample.length;
        if (leadsLast24h > 0) {
          actions.push(
            `Follow up ${leadsLast24h} lead(s) on WhatsApp / email today.`
          );
        } else {
          actions.push(
            "No new leads in 24h — run outreach/daily + Status pack."
          );
        }
      }
    } else {
      actions.push(
        "Supabase admin not configured — leads counted only when service role is set."
      );
    }
  } catch (e) {
    errors.push(`Leads: ${e instanceof Error ? e.message : String(e)}`);
  }

  actions.push(
    "Push revenue: Protector kit, Follow-up Agent kit, or Hire deposit only."
  );

  const report: DailyOpsReport = {
    ranAt: new Date().toISOString(),
    baseUrl,
    health,
    healthOk: health.length > 0 && health.every((h) => h.ok),
    leadsLast24h,
    leadsSample,
    actions,
    errors,
  };

  const text = formatOpsReport(report);
  const subject = report.healthOk
    ? `Daily Ops OK — ${leadsLast24h} leads · DoyinTech`
    : `Daily Ops ALERT — site issues · DoyinTech`;

  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const toEmail =
        process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

      await resend.emails.send({
        from: `DoyinTech Ops <${fromEmail}>`,
        to: toEmail,
        subject,
        text,
      });
      actions.push("Email digest sent.");
    } else {
      actions.push("RESEND_API_KEY missing — email digest skipped.");
    }
  } catch (e) {
    errors.push(`Email: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    if (apiKey) {
      const phone = process.env.CALLMEBOT_PHONE || WHATSAPP_NUMBER;
      const short =
        subject +
        "\n" +
        (report.healthOk ? "Health OK\n" : "HEALTH ISSUE — check email\n") +
        `Leads 24h: ${leadsLast24h}\n` +
        `Site: ${baseUrl}`;
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
        `&text=${encodeURIComponent(short)}` +
        `&apikey=${encodeURIComponent(apiKey)}`;
      await fetch(url);
    }
  } catch (e) {
    errors.push(`WhatsApp: ${e instanceof Error ? e.message : String(e)}`);
  }

  console.log(
    JSON.stringify({
      event: "doyintech_daily_ops",
      healthOk: report.healthOk,
      leadsLast24h,
      errors: errors.length,
      at: report.ranAt,
    })
  );

  return Response.json({
    ok: true,
    healthOk: report.healthOk,
    leadsLast24h,
    pathsChecked: health.length,
    errors,
  });
}
