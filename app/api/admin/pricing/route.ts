import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getEffectiveCatalog,
  loadPricingOverrides,
  savePricingOverrides,
  type PricingOverridesMap,
  type PriceOverride,
} from "@/lib/pricing/overrides";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  const catalog = await getEffectiveCatalog();
  const overrides = await loadPricingOverrides();
  return NextResponse.json({
    ok: true,
    catalog,
    overrideCount: Object.keys(overrides).length,
    note:
      "Overrides apply to Paystack charges via getPayItem. Run docs SQL for site_settings if saves fail.",
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const key = String(body.key || "").trim();
    if (!key || !key.includes(":")) {
      return NextResponse.json({ error: "key required (e.g. product:xyz)" }, { status: 400 });
    }

    const overrides = await loadPricingOverrides();
    const next: PricingOverridesMap = { ...overrides };

    if (body.clear === true) {
      delete next[key];
    } else {
      const entry: PriceOverride = {
        ...(next[key] || {}),
      };
      if (body.amountKobo != null && body.amountKobo !== "") {
        const kobo = Math.max(0, Math.round(Number(body.amountKobo)));
        entry.amountKobo = kobo;
        entry.priceNgn = Math.round(kobo / 100);
      } else if (body.priceNgn != null && body.priceNgn !== "") {
        const ngn = Math.max(0, Math.round(Number(body.priceNgn)));
        entry.priceNgn = ngn;
        entry.amountKobo = ngn * 100;
      }
      if (body.displayLabel != null) {
        entry.displayLabel = String(body.displayLabel).slice(0, 200);
      }
      next[key] = entry;
    }

    const saved = await savePricingOverrides(next);
    if (!saved.ok) {
      return NextResponse.json(
        {
          error: saved.error || "Save failed",
          hint: "Create public.site_settings (see docs/site-settings.sql)",
        },
        { status: 500 }
      );
    }

    const catalog = await getEffectiveCatalog();
    return NextResponse.json({ ok: true, catalog, key });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
