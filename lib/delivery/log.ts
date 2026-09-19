import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Best-effort delivery log (non-blocking). */
export async function logDelivery(entry: {
  reference: string;
  email: string;
  productId: string;
  productName: string;
  channel: "email" | "download" | "fulfill";
  ok: boolean;
  detail?: string;
}) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return;
    await admin.from("site_leads").insert({
      type: "delivery_log",
      product: entry.productName,
      name: entry.email,
      email: entry.email,
      message: `[${entry.channel}] ref=${entry.reference} product=${entry.productId} ok=${entry.ok} ${entry.detail || ""}`.slice(0, 1800),
      source: "delivery-log",
      status: entry.ok ? "won" : "new",
    });
  } catch (e) {
    console.error("delivery log", e);
  }
}
