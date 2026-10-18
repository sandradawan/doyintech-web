import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { buildDefaultCatalog, type CatalogPriceItem } from "./catalog";

export type PriceOverride = {
  amountKobo?: number | null;
  priceNgn?: number | null;
  displayLabel?: string | null;
};

export type PricingOverridesMap = Record<string, PriceOverride>;

const SETTINGS_KEY = "pricing_overrides";

export async function loadPricingOverrides(): Promise<PricingOverridesMap> {
  const sb = getSupabaseAdmin();
  if (!sb) return {};
  try {
    const { data, error } = await sb
      .from("site_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .maybeSingle();
    if (error || !data?.value) return {};
    const v = data.value as PricingOverridesMap | { items?: PricingOverridesMap };
    if (v && typeof v === "object" && "items" in v && v.items) return v.items;
    return (v as PricingOverridesMap) || {};
  } catch {
    return {};
  }
}

export async function savePricingOverrides(
  overrides: PricingOverridesMap
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { error } = await sb.from("site_settings").upsert(
    {
      key: SETTINGS_KEY,
      value: overrides,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getEffectiveCatalog(): Promise<
  Array<CatalogPriceItem & { overridden: boolean; defaultAmountKobo: number | null }>
> {
  const defaults = buildDefaultCatalog();
  const overrides = await loadPricingOverrides();
  return defaults.map((item) => {
    const o = overrides[item.key];
    const amountKobo =
      o?.amountKobo != null ? Number(o.amountKobo) : item.amountKobo;
    const priceNgn =
      o?.priceNgn != null
        ? Number(o.priceNgn)
        : amountKobo != null
          ? Math.round(amountKobo / 100)
          : item.priceNgn;
    const displayLabel =
      o?.displayLabel != null && String(o.displayLabel).trim()
        ? String(o.displayLabel)
        : item.displayLabel;
    return {
      ...item,
      amountKobo,
      priceNgn,
      displayLabel,
      overridden: Boolean(o),
      defaultAmountKobo: item.amountKobo,
    };
  });
}

export async function resolveAmountKobo(productId: string): Promise<number | null> {
  const overrides = await loadPricingOverrides();
  const prefixes = ["service", "product", "student", "tool", "ebook", "component", "template"];
  for (const p of prefixes) {
    const key = `${p}:${productId}`;
    if (overrides[key]?.amountKobo != null) {
      return Number(overrides[key].amountKobo);
    }
  }
  for (const [key, o] of Object.entries(overrides)) {
    if (key.endsWith(`:${productId}`) && o.amountKobo != null) {
      return Number(o.amountKobo);
    }
  }
  return null;
}
