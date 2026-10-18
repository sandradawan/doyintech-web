import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getReportPackage } from "@/lib/reports/packages";
import {
  generateDeliveryToken,
  generateReportOrderId,
} from "@/lib/reports/order-id";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const packageId = String(body.packageId || "").trim();
    const profileUrl = String(body.profileUrl || "").trim();
    const businessCategory = String(body.businessCategory || "").trim();
    const businessObjective = String(body.businessObjective || "").trim();
    const targetAudience = String(body.targetAudience || "").trim();
    const notes = String(body.notes || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    const pkg = getReportPackage(packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: "Select a valid report package." },
        { status: 400 }
      );
    }

    if (pkg.reportType === "instagram_audit" && !profileUrl) {
      return NextResponse.json(
        { error: "Instagram profile URL is required for this package." },
        { status: 400 }
      );
    }

    const orderId = generateReportOrderId();
    const deliveryToken = generateDeliveryToken();
    const sb = getSupabaseAdmin();
    let rowId: string | null = null;

    if (sb) {
      const { data, error } = await sb
        .from("report_orders")
        .insert({
          order_id: orderId,
          product_id: pkg.id,
          product_name: pkg.name,
          price_ngn: pkg.priceNgn,
          status: "pending_payment",
          name,
          email,
          phone: phone || null,
          profile_url: profileUrl || null,
          business_category: businessCategory || null,
          business_objective: businessObjective || null,
          target_audience: targetAudience || null,
          notes: notes || null,
          delivery_token: deliveryToken,
        })
        .select("id")
        .single();

      if (error) {
        console.error("report_orders insert", error.message);
        return NextResponse.json(
          {
            error:
              "Could not create order. Ensure docs/report-studio.sql has been run in Supabase.",
            detail: error.message,
          },
          { status: 503 }
        );
      }
      rowId = data?.id || null;
      if (rowId) {
        await sb.from("report_events").insert({
          order_uuid: rowId,
          order_id: orderId,
          status: "pending_payment",
          note: "Order created — awaiting payment",
        });
      }
    }

    if (!SECRET) {
      const wa = `https://wa.me/2348085343926?text=${encodeURIComponent(
        `Hi DoyinTech — I want ${pkg.name} (${orderId}). Email: ${email}. Profile: ${profileUrl || "n/a"}`
      )}`;
      return NextResponse.json({
        orderId,
        whatsapp: wa,
        note: "Paystack not configured — complete via WhatsApp.",
      });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://doyintech.vercel.app";

    const payload = {
      email,
      amount: pkg.amountKobo,
      currency: "NGN",
      callback_url: `${origin}/reports/success?order=${encodeURIComponent(orderId)}`,
      metadata: {
        kind: "report_studio",
        product_id: pkg.id,
        product_name: pkg.name,
        order_id: orderId,
        customer_name: name,
        profile_url: profileUrl || undefined,
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        {
          orderId,
          error: data.message || "Could not start payment.",
        },
        { status: 400 }
      );
    }

    const reference = data.data?.reference as string | undefined;
    if (sb && rowId && reference) {
      await sb
        .from("report_orders")
        .update({ paystack_ref: reference, updated_at: new Date().toISOString() })
        .eq("id", rowId);
    }

    return NextResponse.json({
      orderId,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Order failed";
    console.error("reports/orders", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId")?.trim();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await sb
    .from("report_orders")
    .select(
      "order_id, product_name, price_ngn, status, name, email, profile_url, created_at, delivered_at, delivery_token"
    )
    .eq("order_id", orderId)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (email && data.email !== email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const canView =
    data.status === "completed" || data.status === "delivered";

  return NextResponse.json({
    orderId: data.order_id,
    productName: data.product_name,
    priceNgn: data.price_ngn,
    status: data.status,
    name: data.name,
    profileUrl: data.profile_url,
    createdAt: data.created_at,
    deliveredAt: data.delivered_at,
    viewUrl:
      canView && data.delivery_token
        ? `/reports/view/${data.delivery_token}`
        : null,
  });
}
