import { NextRequest, NextResponse } from "next/server";
import {
  ebookFilename,
  findEbookByProductId,
  formatEbookDocument,
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
    const mode = String(body.mode || "download").toLowerCase(); // download | email
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

    // Optional: amount check (allow small variance)
    if (tx.amount && book.amountKobo && Math.abs(tx.amount - book.amountKobo) > 100) {
      // soft warning only — metadata is source of truth for product
    }

    const document = formatEbookDocument(book);
    const filename = ebookFilename(book);
    const buyerEmail = (tx.customer?.email || body.email || "").toLowerCase();

    if (mode === "email") {
      if (!buyerEmail || !buyerEmail.includes("@")) {
        return NextResponse.json(
          { error: "A valid email is required for email delivery." },
          { status: 400 }
        );
      }

      if (!RESEND_KEY) {
        // Still allow download fallback message
        return NextResponse.json({
          ok: false,
          code: "NO_EMAIL_PROVIDER",
          message:
            "Email delivery is not configured yet. Use Download, or message WhatsApp with your reference.",
          downloadAvailable: true,
          book: { title: book.title, slug: book.slug },
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
          text: `Hi,\n\nThank you for purchasing "${book.title}".\n\nYour ebook is attached as a text file, and you can also read it online after unlocking:\nhttps://doyintech.vercel.app/ebooks/${book.slug}?paid=1\n\nPayment reference: ${reference}\n\n— DoyinTech\ndoyintechnology@outlook.com`,
          attachments: [
            {
              filename,
              content: Buffer.from(document, "utf-8").toString("base64"),
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

    // Default: download payload (client saves as file)
    return NextResponse.json({
      ok: true,
      mode: "download",
      filename,
      contentType: "text/plain; charset=utf-8",
      content: document,
      book: { title: book.title, slug: book.slug },
      email: buyerEmail || null,
    });
  } catch {
    return NextResponse.json({ error: "Delivery failed." }, { status: 500 });
  }
}
