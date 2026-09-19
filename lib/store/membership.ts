import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Developer membership registration
// ---------------------------------------------------------------------------
export async function dbRegisterDeveloper(input: {
  displayName: string;
  email: string;
  phone?: string;
  website?: string;
  bio?: string;
  companyName?: string;
  country?: string;
  agreedTerms: boolean;
}): Promise<{ id: string; membershipStatus: string } | { error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  if (!input.agreedTerms) return { error: "You must accept the developer terms." };
  const email = input.email.toLowerCase().trim();
  if (!email.includes("@") || !input.displayName.trim()) {
    return { error: "Display name and valid email are required." };
  }

  const { data: existing } = await sb
    .from("store_developers")
    .select("id, membership_status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return {
      id: existing.id,
      membershipStatus: existing.membership_status || "pending",
    };
  }

  const { data, error } = await sb
    .from("store_developers")
    .insert({
      display_name: input.displayName.trim().slice(0, 120),
      email,
      phone: input.phone?.slice(0, 40) || null,
      website: input.website?.slice(0, 300) || null,
      bio: input.bio?.slice(0, 1000) || null,
      company_name: input.companyName?.slice(0, 120) || null,
      country: (input.country || "NG").slice(0, 4),
      membership_status: "pending",
      membership_tier: "free",
      agreed_terms_at: new Date().toISOString(),
    })
    .select("id, membership_status")
    .single();

  if (error || !data) {
    console.error("dbRegisterDeveloper", error?.message);
    return { error: error?.message || "Registration failed" };
  }
  return { id: data.id, membershipStatus: data.membership_status };
}

export async function dbRegisterMember(input: {
  email: string;
  displayName?: string;
  phone?: string;
}): Promise<{ id: string } | { error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const email = input.email.toLowerCase().trim();
  if (!email.includes("@")) return { error: "Valid email required" };

  const { data: existing } = await sb
    .from("store_members")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return { id: existing.id };

  const { data, error } = await sb
    .from("store_members")
    .insert({
      email,
      display_name: input.displayName?.slice(0, 120) || null,
      phone: input.phone?.slice(0, 40) || null,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("dbRegisterMember", error?.message);
    return { error: error?.message || "Registration failed" };
  }
  return { id: data.id };
}

export async function dbAttachScreenshots(
  listingId: string,
  urls: string[]
): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb || !urls.length) return false;

  const rows = urls.slice(0, 8).map((url, i) => ({
    listing_id: listingId,
    storage_path: url,
    public_url: url,
    sort_order: i,
  }));

  await sb.from("store_screenshots").insert(rows);
  await sb
    .from("store_listings")
    .update({ screenshots: urls.slice(0, 8) })
    .eq("id", listingId);
  return true;
}
