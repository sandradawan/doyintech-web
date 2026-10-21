import { Resend } from "resend";
import { ctaButton, emailLayout } from "@/lib/email/templates";
import { absoluteUrl } from "@/lib/site";
import { getPlan } from "@/lib/subscriptions/plans";

/** Welcome email to the subscriber + heads-up to DoyinTech (care plans need onboarding). */
export async function notifyNewSubscription(opts: { email: string; planId: string | null }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !opts.email) return;
  const plan = opts.planId ? getPlan(opts.planId) : undefined;
  const name = plan?.name || "your DoyinTech membership";
  const from =
    process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
  const resend = new Resend(key);

  const isCare = plan?.family === "care";
  const next = isCare
    ? "We'll contact you within one business day to confirm your website details and access. You can also message us on WhatsApp any time: +234 808 534 3926."
    : "Sign in on your account page with this email and every premium tool unlocks automatically, on any device.";

  try {
    await resend.emails.send({
      from,
      to: opts.email,
      subject: `Welcome to ${name}`,
      html: emailLayout({
        title: `Welcome to ${name}`,
        bodyHtml: [
          `<p style="margin:0 0 14px;">Thanks for subscribing to <strong>${name}</strong>.</p>`,
          `<p style="margin:0 0 14px;">${next}</p>`,
          ctaButton(absoluteUrl(isCare ? "/care-plans" : "/account"), isCare ? "View your plan" : "Open your account"),
          `<p style="margin:16px 0 0;font-size:13px;color:#86868b;">Manage your card or cancel any time from ${absoluteUrl("/account")}.</p>`,
        ].join(""),
      }),
    });

    const ops = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;
    if (ops) {
      await resend.emails.send({
        from,
        to: ops,
        subject: `New subscription: ${name}`,
        text: `${opts.email} subscribed to ${name} (${opts.planId || "unknown plan"}).${
          isCare ? "\n\nCare plan: contact them within one business day to onboard." : ""
        }`,
      });
    }
  } catch (e) {
    console.error("subscription notify", e);
  }
}
