/** One-time Paystack unlock products for paid tools */
export type PaidToolDef = {
  toolSlug: string;
  productId: string;
  title: string;
  priceNgn: string;
  amountKobo: number;
  unlockKey: string;
  short: string;
};

export const PAID_TOOLS: PaidToolDef[] = [
  {
    toolSlug: "pdf-studio",
    productId: "pdf-studio-unlock",
    title: "PDF Studio",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    unlockKey: "doyintech_pdf_studio_unlocked",
    short: "Letters, quotes, reports → PDF",
  },
  {
    toolSlug: "whatsapp-builder",
    productId: "tool-whatsapp-builder",
    title: "WhatsApp Auto-Reply Builder",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    unlockKey: "doyintech_wa_builder_unlocked",
    short: "Scripts & flows — pay to copy full pack",
  },
  {
    toolSlug: "branded-invoice",
    productId: "tool-branded-invoice",
    title: "Branded Invoice PDF",
    priceNgn: "₦3,500",
    amountKobo: 350000,
    unlockKey: "doyintech_branded_invoice_unlocked",
    short: "Logo-ready invoice — pay to export",
  },
  {
    toolSlug: "proposal-export",
    productId: "tool-proposal-export",
    title: "Proposal PDF Export",
    priceNgn: "₦4,000",
    amountKobo: 400000,
    unlockKey: "doyintech_proposal_export_unlocked",
    short: "Polished client proposal PDF",
  },
  {
    toolSlug: "contract-export",
    productId: "tool-contract-export",
    title: "Contract / NDA Export",
    priceNgn: "₦3,500",
    amountKobo: 350000,
    unlockKey: "doyintech_contract_export_unlocked",
    short: "Service agreement or NDA PDF",
  },
  {
    toolSlug: "security-report",
    productId: "tool-security-report",
    title: "Full Security PDF Report",
    priceNgn: "₦8,000",
    amountKobo: 800000,
    unlockKey: "doyintech_security_report_unlocked",
    short: "Detailed scan report + fix list",
  },
  {
    toolSlug: "uptime-monitor",
    productId: "tool-uptime-monitor",
    title: "Uptime & SSL Monitor",
    priceNgn: "₦4,000",
    amountKobo: 400000,
    unlockKey: "doyintech_uptime_monitor_unlocked",
    short: "Domain health dashboard unlock",
  },
  {
    toolSlug: "seo-audit",
    productId: "tool-seo-audit",
    title: "SEO Meta Audit Report",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    unlockKey: "doyintech_seo_audit_unlocked",
    short: "Full SEO checklist export",
  },
  {
    toolSlug: "ai-copy",
    productId: "tool-ai-copy",
    title: "AI Business Copy Suite",
    priceNgn: "₦4,500",
    amountKobo: 450000,
    unlockKey: "doyintech_ai_copy_unlocked",
    short: "Ads, captions, emails — full pack",
  },
  {
    toolSlug: "cv-premium",
    productId: "tool-cv-premium",
    title: "CV Premium Export",
    priceNgn: "₦2,500",
    amountKobo: 250000,
    unlockKey: "doyintech_cv_premium_unlocked",
    short: "Premium CV / cover letter PDF",
  },
  {
    toolSlug: "qr-pro",
    productId: "tool-qr-pro",
    title: "QR Pro + Landing",
    priceNgn: "₦3,000",
    amountKobo: 300000,
    unlockKey: "doyintech_qr_pro_unlocked",
    short: "Branded QR + tracking notes",
  },
  {
    toolSlug: "rent-receipt",
    productId: "tool-rent-receipt",
    title: "Rent / Fee Receipt",
    priceNgn: "₦2,000",
    amountKobo: 200000,
    unlockKey: "doyintech_rent_receipt_unlocked",
    short: "Landlord receipt PDF",
  },
  {
    toolSlug: "dues-receipt",
    productId: "tool-dues-receipt",
    title: "School / Church Dues Receipt",
    priceNgn: "₦2,000",
    amountKobo: 200000,
    unlockKey: "doyintech_dues_receipt_unlocked",
    short: "Institution receipt PDF",
  },
  {
    toolSlug: "offer-letter",
    productId: "tool-offer-letter",
    title: "Salary & Offer Letter",
    priceNgn: "₦3,000",
    amountKobo: 300000,
    unlockKey: "doyintech_offer_letter_unlocked",
    short: "Offer letter + breakdown PDF",
  },
  {
    toolSlug: "hosting-export",
    productId: "tool-hosting-export",
    title: "Hosting Plan Export",
    priceNgn: "₦2,000",
    amountKobo: 200000,
    unlockKey: "doyintech_hosting_export_unlocked",
    short: "Domain + hosting cost PDF",
  },
  {
    toolSlug: "interview-pack",
    productId: "tool-interview-pack",
    title: "Tech Interview Pack",
    priceNgn: "₦3,500",
    amountKobo: 350000,
    unlockKey: "doyintech_interview_pack_unlocked",
    short: "Full question bank unlock",
  },
];

export function getPaidTool(slug: string) {
  return PAID_TOOLS.find((t) => t.toolSlug === slug);
}

export function getPaidToolByProductId(productId: string) {
  return PAID_TOOLS.find((t) => t.productId === productId);
}

export function isUnlocked(unlockKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(unlockKey) === "1";
  } catch {
    return false;
  }
}

export function setUnlocked(unlockKey: string) {
  try {
    localStorage.setItem(unlockKey, "1");
  } catch {
    /* ignore */
  }
}
