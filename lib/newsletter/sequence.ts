/**
 * Email follow-up sequences, sent by /api/cron/nurture. Each subscriber is on one sequence:
 * - general: newsletter sign-ups (tools → kits → Pro → websites)
 * - tools:   people who used a free tool (branded invoices → e-invoicing → Pro → shop → website)
 * - lead:    people who asked about a website or audit (what happens next → proof → price → call)
 * - store:   new DoyinTech Store sellers (first sale → photos → sharing → paid plan → website)
 */
import { Resend } from "resend";
import { ctaButton, emailLayout } from "@/lib/email/templates";
import { absoluteUrl } from "@/lib/site";

export type NurtureEmail = {
  subject: string;
  preheader: string;
  paragraphs: string[];
  /** Site path, or a full https URL (e.g. WhatsApp). */
  cta: { label: string; path: string };
};

export type SequenceId = "general" | "tools" | "lead" | "store";

type Sequence = {
  emails: NurtureEmail[];
  /** days[i] = days after email i-1 that email i is sent; days[0] is 0 (sent on enrolment). */
  days: number[];
  /** A higher-priority sequence replaces a lower one when someone enrols again. */
  priority: number;
};

const WHATSAPP_CALL = `https://wa.me/2348085343926?text=${encodeURIComponent(
  "Hi DoyinTech, I'd like a free 15-minute call about a website."
)}`;

export const SEQUENCES: Record<SequenceId, Sequence> = {
  general: {
    priority: 0,
    days: [0, 2, 3, 4, 5],
    emails: [
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
    ],
  },

  tools: {
    priority: 1,
    days: [0, 2, 3, 4, 4, 5],
    emails: [
      {
        subject: "Your free business tools, all in one place",
        preheader: "Invoices, receipts, PAYE and company tax — bookmark these.",
        paragraphs: [
          "Thanks for using our tools. Here they are in one place so you can find them next time: the invoice and receipt generator, the 2026 PAYE calculator, the small company tax checker and the freelancer tax calculator.",
          "They're free and work on your phone.",
        ],
        cta: { label: "Open the free tools", path: "/tools" },
      },
      {
        subject: "Make your invoices look like a big company's",
        preheader: "Your logo and brand colour on every invoice, quote and receipt.",
        paragraphs: [
          "Customers pay faster when an invoice looks professional. For a one-off ₦3,500 you can add your logo and brand colour to every invoice, quote and receipt you make with our generator, and remove our footer.",
          "It unlocks on your device straight after payment. No subscription.",
        ],
        cta: { label: "Brand my invoices", path: "/tools/invoice-generator-nigeria" },
      },
      {
        subject: "E-invoicing is coming for small businesses",
        preheader: "What changes, when, and what to do this year.",
        paragraphs: [
          "Nigeria is moving businesses onto electronic invoicing in phases, with smaller businesses following the large ones. Businesses that keep clean, numbered invoices now will find the switch far easier.",
          "We've put the deadlines and a two-minute readiness check on one page.",
        ],
        cta: { label: "Check your e-invoicing readiness", path: "/e-invoicing-nigeria" },
      },
      {
        subject: "Every premium tool for ₦5,000 a month",
        preheader: "Branded invoices, contracts, payslips, proposals and more.",
        paragraphs: [
          "If you're back on our tools every month, DoyinTech Pro unlocks all of the premium ones on every device: branded invoices and receipts, payslip PDFs, contracts, proposals, CVs and more.",
          "It's ₦5,000 a month and you can cancel any time.",
        ],
        cta: { label: "See DoyinTech Pro", path: "/pro" },
      },
      {
        subject: "Sell online with one link — free",
        preheader: "A shop page for your products, orders straight to WhatsApp.",
        paragraphs: [
          "If you sell products, you can open a free online shop on DoyinTech in two minutes: add your products with photos and prices, then share one link on WhatsApp, Instagram and TikTok.",
          "Customers order straight into your WhatsApp. When you're ready, they can pay online and the money goes to your bank.",
        ],
        cta: { label: "Open my free shop", path: "/stores" },
      },
      {
        subject: "When you're ready for a website that brings clients",
        preheader: "Fixed prices, 50% deposit, live in one to two weeks.",
        paragraphs: [
          "When your business is ready for a proper website, we build at fixed prices with a 50% deposit, and most sites go live within one to two weeks, with WhatsApp enquiries and Paystack payments built in.",
          "Reply to this email with your business name and we'll suggest the right package.",
        ],
        cta: { label: "See website packages", path: "/hire" },
      },
    ],
  },

  lead: {
    priority: 3,
    days: [0, 1, 2, 2, 3],
    emails: [
      {
        subject: "We've got your request — here's what happens next",
        preheader: "A reply within one business day, plus a fixed price.",
        paragraphs: [
          "Thanks for getting in touch with DoyinTech. We'll reply within one business day, usually on WhatsApp.",
          "What happens next: we ask a few questions about your business, recommend one package with a fixed price, and start once the 50% deposit is paid. Most websites go live within one to two weeks.",
          "If it's urgent, message us on WhatsApp now and mention this email.",
        ],
        cta: { label: "Message us on WhatsApp", path: WHATSAPP_CALL },
      },
      {
        subject: "What our clients got",
        preheader: "Real projects: hotels, shops, games and schools.",
        paragraphs: [
          "While we prepare your recommendation, here's some of what we've built: booking sites for hotels, online shops, school CBT platforms and more, each with the results the owner cared about.",
        ],
        cta: { label: "See our work", path: "/case-studies" },
      },
      {
        subject: "What a website really costs in Nigeria (2026)",
        preheader: "Honest price ranges, and what you get at each level.",
        paragraphs: [
          "The most common question we get is “how much?”. We've written down honest 2026 price ranges for business websites in Nigeria: what you get at each level, and what's worth paying for.",
          "There's also a calculator, so you can see a price for exactly what you need before we talk.",
        ],
        cta: { label: "See website prices", path: "/website-cost-nigeria" },
      },
      {
        subject: "Questions people ask before they start",
        preheader: "Deposits, timelines, who owns the site, and what happens after launch.",
        paragraphs: [
          "Do I pay everything up front? No: 50% to start and 50% when you're happy. Who owns the website? You do, including the domain. What happens after launch? You can manage it yourself or add a monthly care plan for security, backups and updates.",
          "Every package, price and timeline is on one page.",
        ],
        cta: { label: "See packages and prices", path: "/hire" },
      },
      {
        subject: "Still thinking it over?",
        preheader: "A free 15-minute call, no obligation.",
        paragraphs: [
          "If you haven't decided yet, that's fine. A free 15-minute call is usually the quickest way to know whether a website is worth it for your business right now, and what it would cost.",
          "Tap below to message us on WhatsApp and we'll find a time that suits you.",
        ],
        cta: { label: "Book a free call on WhatsApp", path: WHATSAPP_CALL },
      },
    ],
  },

  store: {
    priority: 2,
    days: [0, 1, 2, 3, 5],
    emails: [
      {
        subject: "Your shop is ready — 3 steps to your first order",
        preheader: "Add products, add photos, share your link.",
        paragraphs: [
          "Welcome to DoyinTech Store. Three steps get most sellers their first order: add your best products with clear prices, give every product a photo, and share your shop link where your customers already are.",
          "Your dashboard shows a checklist so you can see what's left.",
        ],
        cta: { label: "Open my shop dashboard", path: "/stores/dashboard" },
      },
      {
        subject: "Product photos that sell, taken on your phone",
        preheader: "Daylight, a plain background, and one product per photo.",
        paragraphs: [
          "Products with good photos get far more orders. You don't need a camera: stand near a window in daylight, use a plain background, fill the frame with one product, and take the photo square.",
          "Upload JPG, PNG or WebP under 1 MB. A screenshot of your photo usually brings it under the limit.",
        ],
        cta: { label: "Update my product photos", path: "/stores/dashboard" },
      },
      {
        subject: "Share your shop link in these 5 places",
        preheader: "Where sellers get their first customers.",
        paragraphs: [
          "Put your shop link in your WhatsApp Business profile and status, your Instagram bio, your TikTok bio, your WhatsApp groups (once, with a short note), and at the end of every reply to a price enquiry.",
          "Customers see everything you sell with prices, so you spend less time answering “how much?”.",
        ],
        cta: { label: "Copy my shop link", path: "/stores/dashboard" },
      },
      {
        subject: "Let customers pay online, straight to your bank",
        preheader: "Card and transfer payments, unlimited products, no badge.",
        paragraphs: [
          "On the Store plan your customers can pay by card or bank transfer at checkout, and the money settles straight into your bank account through Paystack. You also get unlimited products and no DoyinTech badge.",
          "It's ₦3,500 a month, or ₦35,000 a year. Cancel any time.",
        ],
        cta: { label: "Upgrade my shop", path: "/stores/dashboard" },
      },
      {
        subject: "Ready for your own website?",
        preheader: "Your own domain, your brand, and payments built in.",
        paragraphs: [
          "When your shop outgrows a single page, we build full websites and online stores at fixed prices with a 50% deposit: your own domain, your brand, WhatsApp orders and Paystack payments built in.",
        ],
        cta: { label: "See website packages", path: "/hire" },
      },
    ],
  },
};

export function isSequenceId(id: unknown): id is SequenceId {
  return typeof id === "string" && id in SEQUENCES;
}

export function sequenceFor(id: string | null | undefined): Sequence {
  return SEQUENCES[isSequenceId(id) ? id : "general"];
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function unsubscribeUrl(token: string): string {
  return absoluteUrl(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
}

function ctaUrl(path: string) {
  return path.startsWith("http") ? path : absoluteUrl(path);
}

function render(step: NurtureEmail, name: string | null, token: string) {
  const greeting = name ? `Hi ${escapeHtml(name.split(" ")[0])},` : "Hi,";
  const unsub = unsubscribeUrl(token);
  const bodyHtml = [
    `<p style="margin:0 0 14px;">${greeting}</p>`,
    ...step.paragraphs.map((p) => `<p style="margin:0 0 14px;">${escapeHtml(p)}</p>`),
    ctaButton(ctaUrl(step.cta.path), step.cta.label),
    `<p style="margin:18px 0 0;">— Silas, DoyinTech</p>`,
    `<p style="margin:22px 0 0;font-size:12px;color:#86868b;">You're getting this because you used DoyinTech or joined our list. <a href="${unsub}" style="color:#86868b;">Unsubscribe</a> any time.</p>`,
  ].join("");
  const text = [
    name ? `Hi ${name.split(" ")[0]},` : "Hi,",
    "",
    ...step.paragraphs.flatMap((p) => [p, ""]),
    `${step.cta.label}: ${ctaUrl(step.cta.path)}`,
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
  sequence?: string | null;
  step: number;
  email: string;
  name: string | null;
  token: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const step = sequenceFor(opts.sequence).emails[opts.step];
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

/** When the email after `afterStep` is due, or null when the sequence is finished. */
export function nextSendAt(afterStep: number, sequence?: string | null, from = new Date()): string | null {
  const days = sequenceFor(sequence).days[afterStep + 1];
  if (days === undefined) return null;
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}
