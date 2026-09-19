import { textToPdfBuffer } from "./pdf";
import { issueDeliveryToken } from "./tokens";
import { resolveProductDelivery, readPublicFile } from "./resolve";
import { sendProductDeliveryEmail } from "./email";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { dbCreateOrder } from "@/lib/store/db";
import { issueDownloadToken } from "@/lib/store/tokens";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { buildEbookPdf, ebookPdfFilename } from "@/lib/ebooks/pdf";
import { formatEbookDocument } from "@/lib/ebooks/delivery";

export type FulfillResult = {
  ok: boolean;
  productName: string;
  email: string;
  downloadLinks: { label: string; url: string }[];
  emailed: boolean;
  error?: string;
};

export async function fulfillPaidProduct(opts: {
  productId: string;
  email: string;
  reference: string;
  amountKobo?: number;
  origin?: string;
  customerName?: string;
}): Promise<FulfillResult> {
  const email = opts.email.toLowerCase().trim();
  const origin =
    opts.origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://doyintech.vercel.app";

  const book = findAnyEbook(opts.productId);
  if (book) {
    const pdfBuffer = buildEbookPdf(book);
    const mdText = formatEbookDocument(book);
    const token = issueDeliveryToken({
      email,
      productId: book.id,
      paths: [],
    });

    const downloadLinks = [
      {
        label: `${book.title} — Professional PDF`,
        url: `${origin}/api/delivery/file?token=${encodeURIComponent(token)}&format=ebook-pdf&product=${encodeURIComponent(book.id)}`,
      },
    ];

    const emailResult = await sendProductDeliveryEmail({
      to: email,
      productName: book.title,
      reference: opts.reference,
      downloadLinks,
      attachments: [
        { filename: ebookPdfFilename(book), content: pdfBuffer },
        {
          filename: `${book.slug}.md`,
          content: Buffer.from(mdText, "utf8"),
        },
      ],
    });

    try {
      const admin = getSupabaseAdmin();
      if (admin) {
        await admin.from("site_leads").insert({
          type: "purchase_fulfilled",
          product: book.title,
          name: opts.customerName || email,
          email,
          message: `Ebook auto-PDF. Ref ${opts.reference}. Email=${emailResult.ok}`,
          source: "paystack-ebook-fulfill",
          status: "won",
        });
      }
    } catch (e) {
      console.error("ebook fulfill persist", e);
    }

    return {
      ok: true,
      productName: book.title,
      email,
      downloadLinks,
      emailed: emailResult.ok,
      error: emailResult.ok ? undefined : emailResult.error,
    };
  }

  const resolved = resolveProductDelivery(opts.productId);
  const productName = resolved?.productName || opts.productId;
  const mdPaths = resolved?.mdPaths || [];
  const token = issueDeliveryToken({
    email,
    productId: opts.productId,
    paths: mdPaths,
  });

  const downloadLinks: { label: string; url: string }[] = [];
  downloadLinks.push({
    label: `${productName} — PDF`,
    url: `${origin}/api/delivery/file?token=${encodeURIComponent(token)}&format=pdf`,
  });
  downloadLinks.push({
    label: `${productName} — Markdown`,
    url: `${origin}/api/delivery/file?token=${encodeURIComponent(token)}&format=md`,
  });

  for (const p of mdPaths) {
    const name = p.split("/").pop() || p;
    downloadLinks.push({
      label: name,
      url: `${origin}/api/delivery/file?token=${encodeURIComponent(token)}&format=raw&path=${encodeURIComponent(p)}`,
    });
  }

  const attachments: { filename: string; content: Buffer }[] = [];
  let combinedMd = `# ${productName}\n\nPayment ref: ${opts.reference}\n\n`;
  for (const p of mdPaths) {
    const content = await readPublicFile(p);
    if (content) {
      const base = p.split("/").pop() || "file.md";
      combinedMd += `\n\n---\n\n## ${base}\n\n${content}`;
      attachments.push({
        filename: base.endsWith(".md") ? base : `${base}.md`,
        content: Buffer.from(content, "utf8"),
      });
    }
  }
  if (!mdPaths.length) {
    combinedMd +=
      "\nYour product is unlocked on the success page. Contact support with your payment reference if files are missing.\n";
  }
  try {
    const pdf = textToPdfBuffer(productName, combinedMd.slice(0, 50000));
    attachments.push({
      filename: `${opts.productId || "product"}.pdf`,
      content: pdf,
    });
  } catch (e) {
    console.error("pdf build", e);
  }

  const emailResult = await sendProductDeliveryEmail({
    to: email,
    productName,
    reference: opts.reference,
    downloadLinks: downloadLinks.slice(0, 12),
    attachments: attachments.slice(0, 8),
  });

  try {
    const admin = getSupabaseAdmin();
    if (admin) {
      const storeToken = issueDownloadToken(opts.productId, email, 7 * 24 * 60);
      await dbCreateOrder({
        listingId: opts.productId,
        listingSlug: opts.productId,
        buyerEmail: email,
        amountKobo: opts.amountKobo || 0,
        paystackReference: opts.reference,
        status: "paid",
        downloadToken: storeToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await admin.from("site_leads").insert({
        type: "purchase_fulfilled",
        product: productName,
        name: opts.customerName || email,
        email,
        message: `Auto-delivered. Ref ${opts.reference}. Email=${emailResult.ok}`,
        source: "paystack-fulfill",
        status: "won",
      });
    }
  } catch (e) {
    console.error("fulfill persist", e);
  }

  return {
    ok: true,
    productName,
    email,
    downloadLinks,
    emailed: emailResult.ok,
    error: emailResult.ok ? undefined : emailResult.error,
  };
}
