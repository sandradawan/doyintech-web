import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export type DeliveryAttachment = {
  filename: string;
  content: Buffer;
};

export async function sendProductDeliveryEmail(opts: {
  to: string;
  productName: string;
  reference: string;
  downloadLinks: { label: string; url: string }[];
  attachments?: DeliveryAttachment[];
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  const from =
    process.env.DELIVERY_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "DoyinTech <onboarding@resend.dev>";

  const linkHtml = opts.downloadLinks
    .map(
      (l) =>
        `<li style="margin:8px 0"><a href="${l.url}" style="color:#ff8c14;font-weight:600">${l.label}</a></li>`
    )
    .join("");

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <h1 style="font-size:20px;margin:0 0 12px">Your purchase is ready</h1>
    <p style="color:#475569;line-height:1.5">
      Payment confirmed for <strong>${opts.productName}</strong>.
      Reference: <code>${opts.reference}</code>
    </p>
    <p style="color:#475569">Download your files (PDF + Markdown). Links stay active for 7 days:</p>
    <ul style="padding-left:18px">${linkHtml || "<li>See attachments</li>"}</ul>
    <p style="color:#64748b;font-size:13px;margin-top:24px">
      Need help? Reply to this email or WhatsApp +234 808 534 3926.<br/>
      — DoyinTech
    </p>
  </div>`;

  if (!resend) {
    console.log(
      JSON.stringify({
        event: "delivery_email_skipped_no_resend",
        to: opts.to,
        product: opts.productName,
        links: opts.downloadLinks.length,
        at: new Date().toISOString(),
      })
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: `Your files: ${opts.productName}`,
      html,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    if (error) {
      console.error("resend delivery", error);
      return { ok: false, error: String(error.message || error) };
    }
    console.log(
      JSON.stringify({
        event: "delivery_email_sent",
        to: opts.to.slice(0, 3) + "***",
        product: opts.productName,
        at: new Date().toISOString(),
      })
    );
    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "email failed";
    console.error("delivery email", msg);
    return { ok: false, error: msg };
  }
}
