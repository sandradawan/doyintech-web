import { Resend } from "resend";
import { productDeliveryTemplate } from "@/lib/email/templates";

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

  const tpl = productDeliveryTemplate({
    productName: opts.productName,
    reference: opts.reference,
    downloadLinks: opts.downloadLinks,
  });

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
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
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
