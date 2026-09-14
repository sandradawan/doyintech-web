import type { Ebook } from "@/lib/ebooks";

export function ebookToPlainText(book: Ebook): string {
  const lines = [
    book.title,
    book.subtitle,
    `By ${book.author}`,
    "",
    "─".repeat(40),
    "",
    book.blurb,
    "",
    "What you get:",
    ...book.benefits.map((b) => `• ${b}`),
    "",
    "─".repeat(40),
    "",
  ];

  for (const ch of book.chapters) {
    lines.push(ch.title, "", ch.body, "", "─".repeat(40), "");
  }

  lines.push(
    "© DoyinTech. Personal use license after purchase.",
    "https://doyintech.vercel.app/ebooks",
    "Support: doyintechnology@outlook.com"
  );

  return lines.join("\n");
}

export function ebookToHtml(book: Ebook): string {
  const chapters = book.chapters
    .map(
      (ch) =>
        `<section style="margin:28px 0;padding:20px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="font-size:18px;margin:0 0 12px">${escapeHtml(ch.title)}</h2>
  <div style="white-space:pre-wrap;line-height:1.65;color:#374151;font-size:15px">${escapeHtml(ch.body)}</div>
</section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(book.title)} — DoyinTech</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:720px;margin:0 auto;padding:32px 20px;background:#fafafa;color:#111">
  <p style="color:#ea580c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">DoyinTech Press</p>
  <h1 style="font-size:28px;margin:8px 0">${escapeHtml(book.title)}</h1>
  <p style="color:#6b7280;margin:0 0 8px">${escapeHtml(book.subtitle)}</p>
  <p style="font-size:13px;color:#9ca3af">By ${escapeHtml(book.author)} · ${escapeHtml(book.pagesLabel)}</p>
  <p style="margin-top:20px;line-height:1.6">${escapeHtml(book.blurb)}</p>
  <ul>${book.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0"/>
  ${chapters}
  <footer style="margin-top:40px;font-size:12px;color:#9ca3af">
    © DoyinTech · Personal use after purchase · https://doyintech.vercel.app/ebooks
  </footer>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

export function ebookFilename(book: Ebook, ext: "txt" | "html") {
  const base = book.slug.replace(/[^a-z0-9-]/gi, "-");
  return `doyintech-${base}.${ext}`;
}
