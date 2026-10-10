import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  LISTINGS,
  type DealType,
  type PropertyListing,
  type PropertyType,
} from "@/lib/real-estate/listings";

export type DbListingRow = {
  id: string;
  title: string;
  deal_type: DealType;
  property_type: string;
  location: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  price_usd: number;
  price_ngn?: number | null;
  price_period?: string | null;
  description: string;
  features: string[] | unknown;
  image_url: string;
  video_url?: string | null;
  agent_name: string;
  agent_phone: string;
  agent_whatsapp: string;
  status: string;
  verified?: boolean;
  source?: string;
  created_at?: string;
};

export function rowToListing(row: DbListingRow): PropertyListing {
  const features = Array.isArray(row.features)
    ? (row.features as string[])
    : typeof row.features === "string"
      ? (() => {
          try {
            return JSON.parse(row.features as string);
          } catch {
            return [];
          }
        })()
      : [];

  return {
    id: row.id,
    title: row.title,
    dealType: row.deal_type,
    propertyType: row.property_type as PropertyType,
    location: row.location,
    city: row.city || "",
    state: row.state || "",
    beds: Number(row.beds) || 0,
    baths: Number(row.baths) || 0,
    priceUsd: Number(row.price_usd) || 0,
    priceNgn: row.price_ngn != null ? Number(row.price_ngn) : undefined,
    pricePeriod: (row.price_period as PropertyListing["pricePeriod"]) || "total",
    description: row.description || "",
    features,
    imageUrl:
      row.image_url ||
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    videoUrl: row.video_url || undefined,
    agentName: row.agent_name || "Agent",
    agentPhone: row.agent_phone || "",
    agentWhatsApp: row.agent_whatsapp || "",
    verified: Boolean(row.verified),
  };
}

/** Public catalog = seed demos + approved DB rows */
export async function getPublicListings(): Promise<PropertyListing[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [...LISTINGS];

  try {
    const { data, error } = await sb
      .from("property_listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !data?.length) return [...LISTINGS];

    const fromDb = (data as DbListingRow[]).map(rowToListing);
    // Prefer DB over seed when same id (unlikely); seed first then DB
    const map = new Map<string, PropertyListing>();
    for (const l of LISTINGS) map.set(l.id, l);
    for (const l of fromDb) map.set(l.id, l);
    return Array.from(map.values());
  } catch {
    return [...LISTINGS];
  }
}

export async function listAllForAdmin(status?: string): Promise<{
  rows: DbListingRow[];
  configured: boolean;
  error?: string;
}> {
  const sb = getSupabaseAdmin();
  if (!sb) return { rows: [], configured: false, error: "Supabase not configured" };

  let q = sb
    .from("property_listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return { rows: [], configured: true, error: error.message };
  return { rows: (data || []) as DbListingRow[], configured: true };
}

export async function insertListing(input: {
  title: string;
  dealType: DealType;
  propertyType: string;
  location: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  priceUsd: number;
  priceNgn?: number;
  pricePeriod?: string;
  description: string;
  features: string[];
  imageUrl: string;
  videoUrl?: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp: string;
  status?: string;
}): Promise<{ id?: string; error?: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      error:
        "Database not configured. Run docs/property-listings.sql and set Supabase keys.",
    };
  }

  const { data, error } = await sb
    .from("property_listings")
    .insert({
      title: input.title,
      deal_type: input.dealType,
      property_type: input.propertyType,
      location: input.location,
      city: input.city,
      state: input.state,
      beds: input.beds,
      baths: input.baths,
      price_usd: input.priceUsd,
      price_ngn: input.priceNgn ?? null,
      price_period: input.pricePeriod || (input.dealType === "rent" ? "year" : "total"),
      description: input.description,
      features: input.features,
      image_url: input.imageUrl,
      video_url: input.videoUrl || null,
      agent_name: input.agentName,
      agent_phone: input.agentPhone,
      agent_whatsapp: input.agentWhatsApp,
      status: input.status || "pending",
      verified: false,
      source: "agent-submit",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data?.id };
}

export async function updateListingStatus(
  id: string,
  status: "pending" | "approved" | "rejected" | "archived",
  verified?: boolean
): Promise<{ error?: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Supabase not configured" };

  const patch: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (typeof verified === "boolean") patch.verified = verified;

  const { error } = await sb.from("property_listings").update(patch).eq("id", id);
  if (error) return { error: error.message };
  return {};
}
