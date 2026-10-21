/**
 * Email list: welcome + automated follow-up sequence that introduces the free tools,
 * then digital products, then Pro, then websites/care plans. Sent by /api/cron/nurture.
 */
import { Resend } from "resend";
import { ctaButton, emailLayout } from "@/lib/email/templates";
import { absoluteUrl } from "@/lib/site";

export type NurtureEmail = {
  subject: string;
  preheader: string;
  paragraphs: string[];
  cta: { label: string; path: string };
};

/** Index 0 is sent on signup; each later step is sent `DAYS_AFTER_PREVIOUS` days apart. */
export const SEQUENCE: NurtureEmail[] = [
  {
    subject: "Welcome to DoyinTech — your free WhatsApp reply scripts",
    preheader: "Copy-paste replies for price questions, bookings and follow-ups.",
    paragraphs: [
      "Thanks for joining. Every week or two we'll send one practical idea for getting more enquiries and getting paid faster — nothing more.",
      "To start, here are our free WhatsApp reply scripts: ready-made answers for “how much?”, booking confirmations and polite follow-ups.",
    ],
    cta: { label: "Get the free scripts", path: "/digital-products/free-whatsapp-reply-scripts.md" },
  },
  {
    subject: "The 3-minute check that finds lost enquiries",
    preheader: "Most small-business sites lose chats in the same three places.",
    paragraphs: [
      "Most small-business websites lose enquiries in the same three places: an unclear offer at the top of the page, no one-tap WhatsApp button, and a slow mobile load.",
      "Our free tools check these for you in a few minutes: business audit, website speed and security checks, invoice and quote generators.",
    ],
    cta: { label: "Try the free tools", path: "/tools" },
  },
  {
    subject: "Ready-made kits so you don't start from a blank page",
    preheader: "Scripts, trackers and playbooks you can use today.",
    paragraphs: [
      "When you'd rather not build systems from scratch, our digital kits and ebooks give you the scripts, spreadsheets and step-by-step playbooks we use with clients.",
      "Pay once with Paystack and they're delivered to your email straight away.",
    ],
    cta: { label: "Browse kits and ebooks", path: "/products" },
  },
  {
    subject: "Every premium tool for ₦5,000 a month",
    preheader: "Contracts, invoices, PDFs, CVs and proposals — one membership.",
    paragraphs: [
      "If you use our tools more than once a month, DoyinTech Pro unlocks every premium tool on all your devices: contracts, invoices, PDF documents, CVs, proposals and more.",
      "It also backs up your DoyinOps client and invoice workspace to the cloud. Cancel any time.",
    ],
    cta: { label: "See DoyinTech Pro", path: "/pro" },
  },
  {
    subject: "When you're ready for a website that brings clients",
    preheader: "Fixed prices, 50% deposit, live in days — and we keep it running.",
    paragraphs: [
      "When you're ready for a proper website, we build at fixed prices with a 50% deposit, and most sites go live within one to two weeks.",
      "Already have a site? Our monthly care plans keep it secure, backed up and improving, from ₦50,000/month. Reply to this email with your link and we'll send a free audit.",
    ],
    cta: { label: "See packages and care plans", path: "/hire" },
  },
];

export const DAYS_AFTER_PREVIOUS = [0, 2, 3, 4, 5];

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function unsubscribeUrl(token: string): string {
  return absoluteUrl(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
}

function render(step: NurtureEmail, name: string | null, token: string) {
  const greeting = name ? `Hi ${escapeHtml(name.split(" ")[0])},` : "Hi,";
  const unsub = unsubscribeUrl(token);
  const bodyHtml = [
    `<p style="margin:0 0 14px;">${greeting}</p>`,
    ...step.paragraphs.map((p) => `<p style="margin:0 0 14px;">${escapeHtml(p)}</p>`),
    ctaButton(absoluteUrl(step.cta.path), step.cta.label),
    `<p style="margin:18px 0 0;">— Silas, DoyinTech</p>`,
    `<p style="margin:22px 0 0;font-size:12px;color:#86868b;">You're getting this because you joined the DoyinTech list. <a href="${unsub}" style="color:#86868b;">Unsubscribe</a> any time.</p>`,
  ].join("");
  const text = [
    name ? `Hi ${name.split(" ")[0]},` : "Hi,",
    "",
    ...step.paragraphs.flatMap((p) => [p, ""]),
    `${step.cta.label}: ${absoluteUrl(step.cta.path)}`,
    "",
    "— Silas, DoyinTech",
    "",
    `Unsubscribe: ${unsub}`,
  ].join("\n");
  return {
    html: emailLayout({ title: step.subject, preheader: step.preheader, bodyHtml }),
    text,
    unsub,
  };
}

export async function sendNurtureEmail(opts: {
  step: number;
  email: string;
  name: string | null;
  token: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const step = SEQUENCE[opts.step];
  if (!key || !step) return false;
  const { html, text, unsub } = render(step, opts.name, opts.token);
  const from =
    process.env.NEWSLETTER_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    process.env.DELIVERY_FROM_EMAIL ||
    "DoyinTech <onboarding@resend.dev>";
  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to: opts.email,
      subject: step.subject,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsub}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) {
      console.error("nurture send", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("nurture send", e);
    return false;
  }
}

export function nextSendAt(afterStep: number, from = new Date()): string | null {
  const days = DAYS_AFTER_PREVIOUS[afterStep + 1];
  if (days === undefined) return null;
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}
