/**
 * DoyinTech branded Resend HTML templates.
 * Dark header, orange accent (#ff8c14), mobile-friendly table layout.
 */

const BRAND = {
  orange: "#ff8c14",
  blue: "#2997ff",
  black: "#0a0a0a",
  card: "#141414",
  muted: "#a1a1a6",
  body: "#e8e8ed",
  white: "#ffffff",
  site: "https://www.doyintech.com",
  wa: "https://wa.me/2348085343926",
  logoText: "DoyinTech",
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

/** Shared shell — works in Gmail, Apple Mail, Outlook (basic). */
export function emailLayout(opts: {
  preheader?: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const pre = escapeHtml(opts.preheader || opts.title);
  const foot =
    opts.footerNote ||
    "DoyinTech · Jos, Nigeria · Websites, systems & digital products for SMEs";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.black};color:${BRAND.body};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${pre}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.black};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.card};border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
          <tr>
            <td style="padding:22px 28px;background:${BRAND.black};border-bottom:1px solid rgba(255,140,20,0.35);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;font-size:18px;font-weight:700;color:${BRAND.white};letter-spacing:-0.02em;">
                    <span style="color:${BRAND.orange};">◆</span> ${BRAND.logoText}
                  </td>
                  <td align="right" style="font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">
                    Official
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:${BRAND.body};">
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid rgba(255,255,255,0.06);font-family:Inter,Arial,sans-serif;font-size:12px;line-height:1.5;color:${BRAND.muted};">
              <p style="margin:0 0 10px;">${escapeHtml(foot)}</p>
              <p style="margin:0;">
                <a href="${BRAND.site}" style="color:${BRAND.blue};text-decoration:none;">Website</a>
                &nbsp;·&nbsp;
                <a href="${BRAND.wa}" style="color:${BRAND.blue};text-decoration:none;">WhatsApp</a>
                &nbsp;·&nbsp;
                <a href="${BRAND.site}/hire" style="color:${BRAND.blue};text-decoration:none;">Hire</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:Inter,Arial,sans-serif;font-size:11px;color:#555;">
          © ${new Date().getFullYear()} DoyinTech. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string, color = BRAND.orange): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0 8px;">
  <tr>
    <td style="border-radius:999px;background:${color};">
      <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Inter,Arial,sans-serif;font-size:14px;font-weight:600;color:#000000;text-decoration:none;border-radius:999px;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

function metaRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-size:12px;color:${BRAND.muted};width:110px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-size:14px;color:${BRAND.white};vertical-align:top;">${value}</td>
  </tr>`;
}

/** Customer: product / ebook delivery after Paystack */
export function productDeliveryTemplate(opts: {
  productName: string;
  reference: string;
  downloadLinks: { label: string; url: string }[];
}): { subject: string; html: string; text: string } {
  const links = opts.downloadLinks
    .map(
      (l) =>
        `<li style="margin:10px 0;"><a href="${l.url}" style="color:${BRAND.orange};font-weight:600;text-decoration:none;">${escapeHtml(l.label)}</a></li>`
    )
    .join("");

  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">Payment confirmed</p>
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.02em;">Your files are ready</h1>
    <p style="margin:0 0 16px;color:${BRAND.muted};">
      Thanks for buying <strong style="color:${BRAND.white};">${escapeHtml(opts.productName)}</strong>.
      Your download links stay active for about 7 days.
    </p>
    <table role="presentation" width="100%" style="margin:0 0 16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <tr><td style="padding:14px 16px;">
        <table role="presentation" width="100%">
          ${metaRow("Product", escapeHtml(opts.productName))}
          ${metaRow("Reference", `<code style="color:${BRAND.orange};font-size:13px;">${escapeHtml(opts.reference)}</code>`)}
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 8px;font-weight:600;color:${BRAND.white};">Downloads</p>
    <ul style="margin:0;padding-left:18px;color:${BRAND.body};">${links || "<li>See email attachments</li>"}</ul>
    ${ctaButton(BRAND.wa + "?text=" + encodeURIComponent("Hi DoyinTech, I need help with my download. Ref: " + opts.reference), "Need help on WhatsApp", "#25D366")}
    <p style="margin:16px 0 0;font-size:13px;color:${BRAND.muted};">Questions? Reply to this email or message us on WhatsApp.</p>
  `;

  return {
    subject: `Your files: ${opts.productName}`,
    html: emailLayout({
      preheader: `Your ${opts.productName} download is ready`,
      title: "Your purchase is ready",
      bodyHtml: body,
    }),
    text: [
      `Your purchase is ready: ${opts.productName}`,
      `Reference: ${opts.reference}`,
      "",
      ...opts.downloadLinks.map((l) => `${l.label}: ${l.url}`),
      "",
      "Help: WhatsApp +234 808 534 3926",
      "— DoyinTech",
    ].join("\n"),
  };
}

/** Ops: new contact form message */
export function contactNotifyTemplate(opts: {
  name: string;
  email: string;
  service?: string;
  budget?: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">Contact form</p>
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${BRAND.white};">New message from ${escapeHtml(opts.name)}</h1>
    <table role="presentation" width="100%" style="margin:0 0 16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <tr><td style="padding:14px 16px;">
        <table role="presentation" width="100%">
          ${metaRow("Name", escapeHtml(opts.name))}
          ${metaRow("Email", `<a href="mailto:${escapeHtml(opts.email)}" style="color:${BRAND.blue};">${escapeHtml(opts.email)}</a>`)}
          ${metaRow("Service", escapeHtml(opts.service || "—"))}
          ${metaRow("Budget", escapeHtml(opts.budget || "—"))}
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 6px;font-weight:600;color:${BRAND.white};">Message</p>
    <p style="margin:0;padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:12px;white-space:pre-wrap;color:${BRAND.body};">${escapeHtml(opts.message)}</p>
    ${ctaButton(`mailto:${opts.email}`, "Reply by email", BRAND.blue)}
  `;

  return {
    subject: `New Contact — ${opts.name}${opts.service ? ` (${opts.service})` : ""}`,
    html: emailLayout({
      preheader: `${opts.name}: ${(opts.message || "").slice(0, 80)}`,
      title: "New contact",
      bodyHtml: body,
      footerNote: "Internal notification · DoyinTech ops",
    }),
    text: `Contact from ${opts.name}\n${opts.email}\n${opts.service || ""}\n\n${opts.message}`,
  };
}

/** Ops: lead inbox alert */
export function leadNotifyTemplate(opts: {
  type: string;
  product: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  referral?: string;
  message?: string;
}): { subject: string; html: string; text: string } {
  const inbox = `${BRAND.site}/admin/leads`;
  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">Lead · ${escapeHtml(opts.type)}</p>
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${BRAND.white};">${escapeHtml(opts.name)}</h1>
    <table role="presentation" width="100%" style="margin:0 0 16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <tr><td style="padding:14px 16px;">
        <table role="presentation" width="100%">
          ${metaRow("Product", escapeHtml(opts.product))}
          ${metaRow("Type", escapeHtml(opts.type))}
          ${metaRow("Email", opts.email ? escapeHtml(opts.email) : "—")}
          ${metaRow("Phone", opts.phone ? escapeHtml(opts.phone) : "—")}
          ${metaRow("Source", escapeHtml(opts.source || "website"))}
          ${opts.referral ? metaRow("Referral", escapeHtml(opts.referral)) : ""}
        </table>
      </td></tr>
    </table>
    ${
      opts.message
        ? `<p style="margin:0 0 6px;font-weight:600;color:${BRAND.white};">Notes</p>
           <p style="margin:0 0 16px;padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:12px;white-space:pre-wrap;">${escapeHtml(opts.message)}</p>`
        : ""
    }
    ${ctaButton(inbox, "Open lead inbox")}
  `;

  return {
    subject: `[Lead] ${opts.type} · ${opts.product} · ${opts.name}`,
    html: emailLayout({
      preheader: `New ${opts.type} lead: ${opts.name}`,
      title: "New lead",
      bodyHtml: body,
      footerNote: "Internal notification · Clear new leads daily",
    }),
    text: [
      `Lead: ${opts.type}`,
      `Product: ${opts.product}`,
      `Name: ${opts.name}`,
      `Email: ${opts.email || "-"}`,
      `Phone: ${opts.phone || "-"}`,
      `Source: ${opts.source || ""}`,
      opts.referral ? `Referral: ${opts.referral}` : "",
      "",
      opts.message || "",
      "",
      `Inbox: ${inbox}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

/** Ops: site review submitted */
export function reviewNotifyTemplate(opts: {
  name: string;
  business?: string;
  rating: number;
  body: string;
  permission: boolean;
}): { subject: string; html: string; text: string } {
  const stars = "★".repeat(opts.rating) + "☆".repeat(5 - opts.rating);
  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">New review</p>
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:${BRAND.white};">${escapeHtml(opts.name)}</h1>
    <p style="margin:0 0 16px;font-size:18px;color:${BRAND.orange};letter-spacing:2px;">${stars}</p>
    <table role="presentation" width="100%" style="margin:0 0 16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <tr><td style="padding:14px 16px;">
        <table role="presentation" width="100%">
          ${metaRow("Business", escapeHtml(opts.business || "—"))}
          ${metaRow("Publish OK", opts.permission ? "Yes" : "No")}
        </table>
      </td></tr>
    </table>
    <p style="margin:0;padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:12px;white-space:pre-wrap;">${escapeHtml(opts.body)}</p>
  `;

  return {
    subject: `New review ${opts.rating}/5 — ${opts.name}${opts.business ? ` (${opts.business})` : ""}`,
    html: emailLayout({
      preheader: `${opts.rating}/5 from ${opts.name}`,
      title: "New review",
      bodyHtml: body,
      footerNote: "Internal notification · Consider featuring on Testimonials",
    }),
    text: `${opts.rating}/5 ${opts.name}\n${opts.business || ""}\n\n${opts.body}`,
  };
}

/** Customer: short thank-you after contact (auto-reply) */
export function contactAutoReplyTemplate(opts: { name: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const first = opts.name.split(" ")[0] || "there";
  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${BRAND.orange};text-transform:uppercase;letter-spacing:0.08em;">We got your message</p>
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${BRAND.white};">Thanks, ${escapeHtml(first)}</h1>
    <p style="margin:0 0 16px;color:${BRAND.muted};">
      Your note landed in our inbox. We usually reply within one business day —
      often faster on WhatsApp.
    </p>
    ${ctaButton(BRAND.wa + "?text=" + encodeURIComponent("Hi DoyinTech, I just sent a message on the website."), "Continue on WhatsApp", "#25D366")}
    ${ctaButton(`${BRAND.site}/hire`, "See packages & pricing")}
    <p style="margin:16px 0 0;font-size:13px;color:${BRAND.muted};">— Silas & the DoyinTech team · Jos</p>
  `;

  return {
    subject: "We received your message — DoyinTech",
    html: emailLayout({
      preheader: "Thanks — we'll reply soon",
      title: "Message received",
      bodyHtml: body,
    }),
    text: `Hi ${first},\n\nWe received your message and will reply soon.\nWhatsApp: +234 808 534 3926\n— DoyinTech`,
  };
}
