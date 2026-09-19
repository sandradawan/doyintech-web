import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function dbRegisterDeveloper(input: {
  displayName: string;
  email: string;
  passwordHash: string;
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
  if (!input.passwordHash) return { error: "Password is required." };
  const email = input.email.toLowerCase().trim();
  if (!email.includes("@") || !input.displayName.trim()) {
    return { error: "Display name and valid email are required." };
  }

  const { data: existing } = await sb
    .from("store_developers")
    .select("id, membership_status, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return { error: "An account with this email already exists. Please sign in." };
  }

  const { data, error } = await sb
    .from("store_developers")
    .insert({
      display_name: input.displayName.trim().slice(0, 120),
      email,
      password_hash: input.passwordHash,
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
    if (error?.code === "23505") {
      return { error: "An account with this email already exists. Please sign in." };
    }
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

export async function dbGetDeveloperByEmail(email: string): Promise<{
  id: string;
  displayName: string;
  email: string;
  website: string | null;
  membershipStatus: string;
  membershipTier: string;
  passwordHash: string | null;
} | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from("store_developers")
    .select("id, display_name, email, website, membership_status, membership_tier, password_hash")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    email: data.email,
    website: data.website,
    membershipStatus: data.membership_status || "pending",
    membershipTier: data.membership_tier || "free",
    passwordHash: data.password_hash || null,
  };
}

export async function dbListDevelopers(): Promise<
  Array<{
    id: string;
    displayName: string;
    email: string;
    website: string | null;
    membershipStatus: string;
    membershipTier: string;
    createdAt: string;
  }>
> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("store_developers")
    .select("id, display_name, email, website, membership_status, membership_tier, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data.map((d) => ({
    id: d.id,
    displayName: d.display_name,
    email: d.email,
    website: d.website,
    membershipStatus: d.membership_status || "pending",
    membershipTier: d.membership_tier || "free",
    createdAt: d.created_at,
  }));
}

export async function dbSetDeveloperStatus(
  id: string,
  status: "pending" | "active" | "suspended" | "rejected",
  reason?: string
): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb) return false;
  const patch: Record<string, unknown> = {
    membership_status: status,
    updated_at: new Date().toISOString(),
  };
  if (status === "active") patch.verified_at = new Date().toISOString();
  if (reason) patch.rejection_reason = reason;
  const { error } = await sb.from("store_developers").update(patch).eq("id", id);
  return !error;
}

export async function dbListingsByDeveloperEmail(email: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("store_listings")
    .select("*")
    .eq("developer_email", email.toLowerCase().trim())
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data;
}
