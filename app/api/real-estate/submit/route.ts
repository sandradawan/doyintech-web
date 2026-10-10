import { NextRequest, NextResponse } from "next/server";
import { insertListing } from "@/lib/real-estate/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`re-submit:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many submissions. Try later." }, { status: 429 });
    }

    const body = await req.json();
    // honeypot
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }

    const title = String(body.title || "").trim().slice(0, 160);
    const dealType = String(body.dealType || "rent") as "rent" | "buy";
    const propertyType = String(body.propertyType || "flat").trim().slice(0, 40);
    const location = String(body.location || "").trim().slice(0, 160);
    const city = String(body.city || "").trim().slice(0, 80);
    const state = String(body.state || "").trim().slice(0, 80);
    const beds = Math.max(0, Number(body.beds) || 0);
    const baths = Math.max(0, Number(body.baths) || 0);
    const priceUsd = Math.max(0, Number(body.priceUsd) || 0);
    const description = String(body.description || "").trim().slice(0, 2000);
    const imageUrl = String(body.imageUrl || "").trim().slice(0, 500);
    const videoUrl = String(body.videoUrl || "").trim().slice(0, 500);
    const agentName = String(body.agentName || "").trim().slice(0, 100);
    const agentPhone = String(body.agentPhone || "").trim().slice(0, 40);
    const agentWhatsApp = String(body.agentWhatsApp || agentPhone || "")
      .replace(/\D/g, "")
      .slice(0, 20);
    const features = String(body.features || "")
      .split(/[,;]/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 12);

    if (!title || !location || !agentName || !agentPhone || !priceUsd) {
      return NextResponse.json(
        { error: "Title, location, agent name, phone, and price are required." },
        { status: 400 }
      );
    }
    if (dealType !== "rent" && dealType !== "buy") {
      return NextResponse.json({ error: "dealType must be rent or buy" }, { status: 400 });
    }

    const result = await insertListing({
      title,
      dealType,
      propertyType,
      location,
      city: city || location.split(",")[0]?.trim() || "",
      state,
      beds,
      baths,
      priceUsd,
      pricePeriod: dealType === "rent" ? "year" : "total",
      description:
        description ||
        `${dealType === "rent" ? "For rent" : "For sale"}: ${title} in ${location}.`,
      features,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      videoUrl: videoUrl || undefined,
      agentName,
      agentPhone,
      agentWhatsApp: agentWhatsApp || agentPhone.replace(/\D/g, ""),
      status: "pending",
    });

    if (result.error) {
      // Fallback: still capture as CRM lead
      const sb = getSupabaseAdmin();
      if (sb) {
        await sb.from("site_leads").insert({
          type: "waitlist",
          product: "Property listing submission",
          name: agentName,
          email: null,
          phone: agentPhone,
          message: JSON.stringify({
            title,
            dealType,
            propertyType,
            location,
            priceUsd,
            description,
            imageUrl,
            videoUrl,
          }),
          source: "real-estate-submit",
          status: "new",
        });
      }
      return NextResponse.json({
        ok: true,
        pending: true,
        note:
          result.error.includes("Database") || result.error.includes("relation")
            ? "Saved as a lead. Run docs/property-listings.sql in Supabase to enable full property CRM."
            : result.error,
      });
    }

    // Also log a lead for notification pipeline
    try {
      const sb = getSupabaseAdmin();
      if (sb) {
        await sb.from("site_leads").insert({
          type: "waitlist",
          product: "Property listing (pending review)",
          name: agentName,
          phone: agentPhone,
          message: `${title} · ${dealType} · ${location} · $${priceUsd} · id=${result.id}`,
          source: "real-estate-submit",
          status: "new",
        });
      }
    } catch {
      /* ignore */
    }

    return NextResponse.json({
      ok: true,
      id: result.id,
      message: "Listing submitted for admin review. It goes live after approval in CRM.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
