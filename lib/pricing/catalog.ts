/**
 * Canonical list of every chargeable / display price on the site.
 * Defaults come from code; admin overrides live in site_settings.pricing_overrides.
 */
import { DIGITAL_PRODUCTS } from "@/lib/products";
import { SERVICE_ADDONS, SERVICE_OFFERS } from "@/lib/service-offers";
import { STUDENT_PACKAGES } from "@/lib/students/packages";
import { PAID_TOOLS } from "@/lib/tools/paid";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import { UI_COMPONENTS } from "@/lib/ui-components";
import { PAGE_TEMPLATES } from "@/lib/page-templates";
import { PACKAGES } from "@/lib/packages";

export type PriceCategory =
  | "service"
  | "product"
  | "student"
  | "tool"
  | "ebook"
  | "component"
  | "template"
  | "package";

export type CatalogPriceItem = {
  key: string;
  category: PriceCategory;
  id: string;
  name: string;
  amountKobo: number | null;
  priceNgn: number | null;
  displayLabel?: string;
  note?: string;
};

export function buildDefaultCatalog(): CatalogPriceItem[] {
  const items: CatalogPriceItem[] = [];

  for (const s of SERVICE_OFFERS) {
    items.push({
      key: `service:${s.id}`,
      category: "service",
      id: s.id,
      name: s.name,
      amountKobo: s.amountKobo,
      priceNgn: Math.round(s.amountKobo / 100),
      displayLabel: `${s.depositNgn} deposit · total ${s.totalNgn}`,
      note: "Paystack deposit",
    });
  }

  for (const a of SERVICE_ADDONS) {
    items.push({
      key: `service:${a.id}`,
      category: "service",
      id: a.id,
      name: `Add-on: ${a.name}`,
      amountKobo: a.amountKobo,
      priceNgn: Math.round(a.amountKobo / 100),
      displayLabel: `₦${Math.round(a.amountKobo / 100).toLocaleString("en-NG")}`,
      note: "Paid in full",
    });
  }

  for (const p of DIGITAL_PRODUCTS) {
    if (p.type === "waitlist") continue;
    items.push({
      key: `product:${p.id}`,
      category: "product",
      id: p.id,
      name: p.name,
      amountKobo: p.amountKobo,
      priceNgn: Math.round(p.amountKobo / 100),
      displayLabel: p.priceNgn,
      note: p.type,
    });
  }

  for (const s of STUDENT_PACKAGES) {
    items.push({
      key: `student:${s.id}`,
      category: "student",
      id: s.id,
      name: s.name,
      amountKobo: s.amountKobo,
      priceNgn: s.priceNgn,
      displayLabel: `₦${s.priceNgn.toLocaleString("en-NG")}`,
      note: `${s.depositPercent}% deposit`,
    });
  }

  for (const t of PAID_TOOLS) {
    items.push({
      key: `tool:${t.productId}`,
      category: "tool",
      id: t.productId,
      name: t.title,
      amountKobo: t.amountKobo,
      priceNgn: Math.round(t.amountKobo / 100),
      displayLabel: t.priceNgn,
      note: t.toolSlug,
    });
  }

  for (const e of ALL_EBOOKS) {
    items.push({
      key: `ebook:${e.id}`,
      category: "ebook",
      id: e.id,
      name: e.title,
      amountKobo: e.amountKobo,
      priceNgn: e.priceNgn,
      displayLabel: `₦${e.priceNgn.toLocaleString("en-NG")}`,
    });
  }

  for (const c of UI_COMPONENTS) {
    items.push({
      key: `component:${c.id}`,
      category: "component",
      id: c.id,
      name: c.name,
      amountKobo: c.amountKobo,
      priceNgn: c.priceNgn,
      displayLabel: `₦${c.priceNgn.toLocaleString("en-NG")}`,
    });
  }

  for (const t of PAGE_TEMPLATES) {
    items.push({
      key: `template:${t.id}`,
      category: "template",
      id: t.id,
      name: t.name,
      amountKobo: t.amountKobo,
      priceNgn: t.priceNgn,
      displayLabel: `₦${t.priceNgn.toLocaleString("en-NG")}`,
    });
  }

  for (const p of PACKAGES) {
    items.push({
      key: `package:${p.id}`,
      category: "package",
      id: p.id,
      name: p.name,
      amountKobo: null,
      priceNgn: null,
      displayLabel: `${p.priceUsd} · ${p.priceNgn}`,
      note: "Display range (quote after discovery)",
    });
  }

  return items;
}
