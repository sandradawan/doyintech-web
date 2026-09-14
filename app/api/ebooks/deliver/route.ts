import { NextRequest, NextResponse } from "next/server";
import {
  ebookFilename,
  ebookPayload,
  findEbookByProductId,
  formatEbookDocument,
  formatEbookHtml,
} from "@/lib/ebooks/delivery";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL =
  process.env.EBOOK_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>";

async function verifyPaystack(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${SECRET}` },
      cache: "no-store",
    }
  );
  const data = await res.json();
  if (!res.ok || !data.status || data.data?.status !== "success") {
    return null;
  }
  return data.data as {
    reference: string;
    amount: number;
    customer?: { email?: string };
    metadata?: Record<string, string>;
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json(
        { error: "Paystack is not configured.", code: "NO_KEYS" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const reference = String(body.reference || "").trim();
    const mode = String(body.mode || "download").toLowerCase();
    const productHint = String(body.productId || "").trim();

    if (!reference) {
      return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
    }

    const tx = await verifyPaystack(reference);
    if (!tx) {
      return NextResponse.json(
        { error: "Payment not verified. Complete payment first." },
        { status: 403 }
      );
    }

    const productId =
      productHint ||
      String(tx.metadata?.product_id || tx.metadata?.product_name || "");

    const book = findEbookByProductId(productId);
    if (!book) {
      return NextResponse.json(
        {
          error:
            "This payment is not linked to an ebook. Contact support with your reference.",
        },
        { status: 400 }
      );
    }

    const html = formatEbookHtml(book);
    const text = formatEbookDocument(book);
    const filenameHtml = ebookFilename(book, "html");
    const buyerEmail = (tx.customer?.email || body.email || "").toLowerCase();
    const payload = ebookPayload(book);

    if (mode === "email") {
      if (!buyerEmail || !buyerEmail.includes("@")) {
        return NextResponse.json(
          { error: "A valid email is required for email delivery." },
          { status: 400 }
        );
      }

      if (!RESEND_KEY) {
        return NextResponse.json({
          ok: false,
          code: "NO_EMAIL_PROVIDER",
          message:
            "Email delivery is not configured yet. Use Download PDF / HTML, or message WhatsApp with your reference.",
          downloadAvailable: true,
          book: { title: book.title, slug: book.slug },
          content: html,
          filename: filenameHtml,
          contentType: "text/html; charset=utf-8",
          payload,
        });
      }

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [buyerEmail],
          subject: `Your ebook: ${book.title} — DoyinTech`,
          html: `<p>Hi,</p><p>Thanks for purchasing <strong>${book.title}</strong>.</p>
            <p>Open online: <a href="https://doyintech.vercel.app/ebooks/${book.slug}?paid=1&reference=${encodeURIComponent(reference)}">Read ebook</a></p>
            <p>An illustrated HTML copy is attached — open it and use <strong>Print → Save as PDF</strong>.</p>
            <p>Ref: ${reference}</p><p>— DoyinTech</p>`,
          attachments: [
            {
              filename: filenameHtml,
              content: Buffer.from(html, "utf-8").toString("base64"),
            },
          ],
        }),
      });

      const emailData = await emailRes.json();
      if (!emailRes.ok) {
        return NextResponse.json(
          {
            error: emailData.message || "Could not send email.",
            downloadAvailable: true,
            content: html,
            filename: filenameHtml,
            contentType: "text/html; charset=utf-8",
            payload,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        ok: true,
        mode: "email",
        email: buyerEmail,
        book: { title: book.title, slug: book.slug },
      });
    }

    return NextResponse.json({
      ok: true,
      mode: "download",
      filename: filenameHtml,
      contentType: "text/html; charset=utf-8",
      content: html,
      textFallback: text,
      payload,
      book: { title: book.title, slug: book.slug },
      email: buyerEmail || null,
    });
  } catch {
    return NextResponse.json({ error: "Delivery failed." }, { status: 500 });
  }
}
