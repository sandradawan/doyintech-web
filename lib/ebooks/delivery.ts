import { EBOOKS, type Ebook } from "@/lib/ebooks";

export function findEbookByProductId(productId: string): Ebook | undefined {
  return EBOOKS.find((e) => e.id === productId || e.slug === productId);
}

function esc(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

/** Illustrated HTML document — open and Print → Save as PDF, or used by client PDF builder. */
export function formatEbookHtml(book: Ebook): string {
  const chapters = book.chapters
    .map((ch) => {
      const img = ch.image
        ? `<figure style="margin:16px 0 20px">
  <img src="${esc(ch.image)}" alt="" style="width:100%;max-height:280px;object-fit:cover;border-radius:12px"/>
  ${ch.imageCaption ? `<figcaption style="font-size:12px;color:#6b7280;margin-top:6px">${esc(ch.imageCaption)}</figcaption>` : ""}
</figure>`
        : "";
      return `<section style="page-break-inside:avoid;margin:28px 0;padding:20px;border:1px solid #e5e7eb;border-radius:14px;background:#fff">
  <h2 style="font-size:18px;margin:0 0 12px;color:#111">${esc(ch.title)}</h2>
  ${img}
  <div style="white-space:pre-wrap;line-height:1.7;color:#374151;font-size:15px">${esc(ch.body)}</div>
</section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(book.title)} — DoyinTech</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @media print {
    body { background: #fff !important; }
    .no-print { display: none !important; }
    section { break-inside: avoid; }
  }
</style>
</head>
<body style="font-family:Georgia,system-ui,sans-serif;max-width:720px;margin:0 auto;padding:32px 20px;background:#f8fafc;color:#111">
  <div style="border-radius:16px;overflow:hidden;margin-bottom:28px;box-shadow:0 12px 40px rgba(0,0,0,.12)">
    <img src="${esc(book.coverImage)}" alt="" style="width:100%;height:280px;object-fit:cover;display:block"/>
    <div style="padding:24px;background:linear-gradient(135deg,${esc(book.coverFrom)},${esc(book.coverTo)});color:#fff">
      <p style="margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">DoyinTech Press</p>
      <h1 style="margin:8px 0 6px;font-size:28px">${esc(book.title)}</h1>
      <p style="margin:0;opacity:.9;font-size:15px">${esc(book.subtitle)}</p>
      <p style="margin:12px 0 0;font-size:13px;opacity:.75">By ${esc(book.author)} · ${esc(book.pagesLabel)}</p>
    </div>
  </div>
  <p style="line-height:1.65;font-size:16px">${esc(book.blurb)}</p>
  <ul style="line-height:1.6">${book.benefits.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0"/>
  ${chapters}
  <footer style="margin-top:40px;font-size:12px;color:#9ca3af">
    © DoyinTech · Personal use after purchase · https://doyintech.vercel.app/ebooks<br/>
    Support: doyintechnology@outlook.com · WhatsApp +234 808 534 3926
  </footer>
  <p class="no-print" style="margin-top:24px;padding:12px;background:#fff7ed;border-radius:8px;font-size:13px;color:#9a3412">
    Tip: Use your browser Print → Save as PDF for a portable PDF copy.
  </p>
</body>
</html>`;
}

export function formatEbookDocument(book: Ebook): string {
  const lines: string[] = [
    book.title.toUpperCase(),
    book.subtitle,
    `By ${book.author}`,
    `Category: ${book.category}`,
    "",
    "— DoyinTech Press —",
    "https://doyintech.vercel.app/ebooks",
    "",
    book.blurb,
    "",
    "WHAT YOU GET",
    ...book.benefits.map((b) => `• ${b}`),
    "",
    "========================================",
    "",
  ];

  for (const ch of book.chapters) {
    lines.push(ch.title, "");
    if (ch.imageCaption) lines.push(`[Image: ${ch.imageCaption}]`, "");
    lines.push(ch.body, "", "----------------------------------------", "");
  }

  lines.push(
    "",
    "Thank you for your purchase.",
    "Support: doyintechnology@outlook.com | WhatsApp +234 808 534 3926",
    "© DoyinTech — for personal use of the purchaser."
  );

  return lines.join("\n");
}

export function ebookFilename(book: Ebook, ext: "html" | "txt" = "html"): string {
  return `${book.slug}-doyintech.${ext}`;
}

/** Serializable payload for client-side PDF generation */
export function ebookPayload(book: Ebook) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    coverImage: book.coverImage,
    coverFrom: book.coverFrom,
    coverTo: book.coverTo,
    accent: book.accent,
    blurb: book.blurb,
    benefits: book.benefits,
    pagesLabel: book.pagesLabel,
    chapters: book.chapters.map((c) => ({
      title: c.title,
      body: c.body,
      image: c.image || null,
      imageCaption: c.imageCaption || null,
    })),
  };
}
