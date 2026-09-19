import { NextRequest, NextResponse } from "next/server";
import {
  ebookFilename,
  ebookPayload,
  findEbookByProductId,
  formatEbookDocument,
  formatEbookHtml,
} from "@/lib/ebooks/delivery";
import { buildEbookPdf, ebookPdfFilename } from "@/lib/ebooks/pdf";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL =
  process.env.EBOOK_FROM_EMAIL ||
  process.env.DELIVERY_FROM_EMAIL ||
  process.env.RESEND_FROM ||
  "DoyinTech <onboarding@resend.dev>";

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
    const mode = String(body.mode || "pdf").toLowerCase();
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

    const pdfBuffer = buildEbookPdf(book);
    const pdfBase64 = pdfBuffer.toString("base64");
    const filenamePdf = ebookPdfFilename(book);
    const html = formatEbookHtml(book);
    const text = formatEbookDocument(book);
    const filenameHtml = ebookFilename(book, "html");
    const buyerEmail = (tx.customer?.email || body.email || "").toLowerCase();
    const payload = ebookPayload(book);

    if (mode === "pdf") {
      return NextResponse.json({
        ok: true,
        mode: "pdf",
        filename: filenamePdf,
        contentType: "application/pdf",
        contentBase64: pdfBase64,
        book: { title: book.title, slug: book.slug },
        email: buyerEmail || null,
      });
    }

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
            "Email is not configured. Your professional PDF is ready to download.",
          downloadAvailable: true,
          book: { title: book.title, slug: book.slug },
          filename: filenamePdf,
          contentType: "application/pdf",
          contentBase64: pdfBase64,
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
          subject: `Your ebook PDF: ${book.title} — DoyinTech`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
            <p>Hi,</p>
            <p>Thanks for purchasing <strong>${book.title}</strong>.</p>
            <p>Your <strong>professional PDF</strong> is attached to this email.</p>
            <p>You can also read online:
              <a href="https://doyintech.vercel.app/ebooks/${book.slug}?paid=1&reference=${encodeURIComponent(reference)}">Open ebook</a>
            </p>
            <p style="color:#64748b;font-size:13px">Ref: ${reference}</p>
            <p>— DoyinTech</p>
          </div>`,
          attachments: [{ filename: filenamePdf, content: pdfBase64 }],
        }),
      });

      const emailData = await emailRes.json();
      if (!emailRes.ok) {
        return NextResponse.json(
          {
            error: emailData.message || "Could not send email.",
            downloadAvailable: true,
            filename: filenamePdf,
            contentType: "application/pdf",
            contentBase64: pdfBase64,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        ok: true,
        mode: "email",
        email: buyerEmail,
        book: { title: book.title, slug: book.slug },
        pdfAttached: true,
      });
    }

    if (mode === "html" || mode === "download") {
      return NextResponse.json({
        ok: true,
        mode: "download",
        filename: filenameHtml,
        contentType: "text/html; charset=utf-8",
        content: html,
        textFallback: text,
        pdfFilename: filenamePdf,
        contentBase64: pdfBase64,
        pdfContentType: "application/pdf",
        payload,
        book: { title: book.title, slug: book.slug },
        email: buyerEmail || null,
      });
    }

    return NextResponse.json({ error: "Unknown mode." }, { status: 400 });
  } catch (e) {
    console.error("ebook deliver", e);
    return NextResponse.json({ error: "Delivery failed." }, { status: 500 });
  }
}
