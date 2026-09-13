import type { ComponentType } from "react";
import {
  WhatsAppBuilderTool,
  BrandedInvoiceTool,
  ProposalExportTool,
  ContractExportTool,
  SecurityReportTool,
  UptimeMonitorTool,
  SeoAuditTool,
  AiCopyTool,
  CvPremiumTool,
  QrProTool,
  RentReceiptTool,
  DuesReceiptTool,
  OfferLetterTool,
  HostingExportTool,
  InterviewPackTool,
} from "@/components/tools/PaidToolKit";

export const PAID_PAGE_COMPONENTS: Record<
  string,
  { title: string; subtitle: string; Component: ComponentType }
> = {
  "whatsapp-builder": {
    title: "WhatsApp Auto-Reply Builder",
    subtitle: "Build scripts and flows. Pay once to unlock full copy/export.",
    Component: WhatsAppBuilderTool,
  },
  "branded-invoice": {
    title: "Branded Invoice PDF",
    subtitle: "Create invoices. Payment required before PDF export.",
    Component: BrandedInvoiceTool,
  },
  "proposal-export": {
    title: "Proposal PDF Export",
    subtitle: "Draft free. Unlock to export polished proposal PDF.",
    Component: ProposalExportTool,
  },
  "contract-export": {
    title: "Contract / NDA Export",
    subtitle: "Service agreement or NDA — pay to export PDF.",
    Component: ContractExportTool,
  },
  "security-report": {
    title: "Full Security PDF Report",
    subtitle: "Compile findings into a client-ready PDF report.",
    Component: SecurityReportTool,
  },
  "uptime-monitor": {
    title: "Uptime & SSL Monitor Unlock",
    subtitle: "Unlock monitoring workflow for your domains.",
    Component: UptimeMonitorTool,
  },
  "seo-audit": {
    title: "SEO Meta Audit Report",
    subtitle: "SEO checklist report — pay to export.",
    Component: SeoAuditTool,
  },
  "ai-copy": {
    title: "AI Business Copy Suite",
    subtitle: "Ads, WhatsApp, and email copy packs — unlock full output.",
    Component: AiCopyTool,
  },
  "cv-premium": {
    title: "CV Premium Export",
    subtitle: "Build your CV — pay to export premium PDF.",
    Component: CvPremiumTool,
  },
  "qr-pro": {
    title: "QR Pro + Landing Brief",
    subtitle: "Branded QR brief — unlock to print.",
    Component: QrProTool,
  },
  "rent-receipt": {
    title: "Rent / Fee Receipt",
    subtitle: "Landlord receipts — pay to export PDF.",
    Component: RentReceiptTool,
  },
  "dues-receipt": {
    title: "School / Church Dues Receipt",
    subtitle: "Institution receipts — pay to export.",
    Component: DuesReceiptTool,
  },
  "offer-letter": {
    title: "Salary & Offer Letter",
    subtitle: "Offer letters — unlock PDF export.",
    Component: OfferLetterTool,
  },
  "hosting-export": {
    title: "Hosting Plan Export",
    subtitle: "Domain + hosting plan PDF unlock.",
    Component: HostingExportTool,
  },
  "interview-pack": {
    title: "Tech Interview Pack",
    subtitle: "Full question bank — pay to unlock and print.",
    Component: InterviewPackTool,
  },
};
