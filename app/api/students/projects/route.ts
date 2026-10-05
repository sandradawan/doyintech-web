import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getStudentPackage,
  depositNgn,
  balanceNgn,
  depositKobo,
} from "@/lib/students/packages";
import { generateProjectRequestId } from "@/lib/students/project-id";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`student-proj:${ip}`, 12, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (body.website || body.company) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const school = String(body.school || "").trim().slice(0, 160);
    const level = String(body.level || "").trim().slice(0, 80);
    const topic = String(body.topic || "").trim().slice(0, 500);
    const deadline = String(body.deadline || "").trim().slice(0, 80);
    const notes = String(body.notes || "").trim().slice(0, 2000);
    const packageId = String(body.packageId || "").trim();

    if (!name || !email.includes("@") || !topic || topic.length < 10) {
      return NextResponse.json(
        { error: "Name, valid email, and research topic (10+ chars) are required." },
        { status: 400 }
      );
    }

    const pkg = getStudentPackage(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Select a valid package." }, { status: 400 });
    }

    const depNgn = depositNgn(pkg);
    const balNgn = balanceNgn(pkg);
    const requestId = generateProjectRequestId();
    const sb = getSupabaseAdmin();
    let projectRowId: string | null = null;

    if (sb) {
      const { data, error } = await sb
        .from("student_projects")
        .insert({
          request_id: requestId,
          package_id: pkg.id,
          package_name: pkg.name,
          amount_ngn: pkg.priceNgn,
          deposit_ngn: depNgn,
          balance_ngn: balNgn,
          amount_paid_ngn: 0,
          stage: "received",
          status: "pending_payment",
          delivery_unlocked: false,
          name,
          email,
          phone: phone || null,
          school: school || null,
          level: level || null,
          topic,
          deadline: deadline || null,
          notes: notes || null,
        })
        .select("id")
        .single();
      if (!error && data?.id) {
        projectRowId = data.id;
        await sb.from("student_project_events").insert({
          project_id: data.id,
          request_id: requestId,
          stage: "received",
          note: `Request created — pay 50% deposit (₦${depNgn.toLocaleString()}) to start`,
        });
      } else if (error) {
        console.log(
          JSON.stringify({ event: "student_project_insert_error", error: error.message })
        );
      }
    }

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const to = process.env.CONTACT_TO_EMAIL || "hello@doyintech.com";
        const from =
          process.env.CONTACT_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>";
        await resend.emails.send({
          from,
          to: [to],
          subject: `[Student project] ${requestId} · ${pkg.name} · ${name}`,
          text: [
            `Request ID: ${requestId}`,
            `Package: ${pkg.name} (₦${pkg.priceNgn.toLocaleString()} total)`,
            `Deposit due now (50%): ₦${depNgn.toLocaleString()}`,
            `Balance on completion (50%): ₦${balNgn.toLocaleString()}`,
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "-"}`,
            `School: ${school || "-"}`,
            `Level: ${level || "-"}`,
            `Topic: ${topic}`,
            `Deadline: ${deadline || "-"}`,
            notes || "",
            "",
            "Track: https://www.doyintech.com/students/projects/track",
          ].join("\n"),
        });
      }
    } catch (e) {
      console.log(JSON.stringify({ event: "student_project_email_error", error: String(e) }));
    }

    if (!SECRET) {
      return NextResponse.json({
        ok: true,
        requestId,
        projectId: projectRowId,
        depositNgn: depNgn,
        balanceNgn: balNgn,
        payment: null,
        message:
          "Request saved. Paystack is not configured — complete deposit via WhatsApp.",
        whatsapp: `https://wa.me/2348085343926?text=${encodeURIComponent(
          `Student project ${requestId}\nPackage: ${pkg.name}\nDeposit 50%: ₦${depNgn.toLocaleString()}\nTopic: ${topic}\nName: ${name}`
        )}`,
      });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.doyintech.com";

    const payload = {
      email,
      amount: depositKobo(pkg),
      currency: "NGN",
      callback_url: `${origin}/students/projects/track?id=${encodeURIComponent(requestId)}&paid=1`,
      metadata: {
        kind: "student_project",
        payment_phase: "deposit",
        request_id: requestId,
        package_id: pkg.id,
        product_id: pkg.id,
        product_name: pkg.name,
        customer_name: name,
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
      return NextResponse.json({
        ok: true,
        requestId,
        depositNgn: depNgn,
        payment: null,
        error: data.message || "Could not start payment",
        whatsapp: `https://wa.me/2348085343926?text=${encodeURIComponent(
          `Student project ${requestId} — deposit payment link failed. Package ${pkg.name}`
        )}`,
      });
    }

    if (sb && projectRowId && data.data?.reference) {
      await sb
        .from("student_projects")
        .update({
          paystack_ref: data.data.reference,
          paystack_ref_deposit: data.data.reference,
        })
        .eq("id", projectRowId);
    }

    return NextResponse.json({
      ok: true,
      requestId,
      projectId: projectRowId,
      depositNgn: depNgn,
      balanceNgn: balNgn,
      totalNgn: pkg.priceNgn,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
