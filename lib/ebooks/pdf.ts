/**
 * Professional multi-page ebook PDF (no external deps).
 * Cover · table of contents · chapters · page footers.
 */
import type { Ebook } from "@/lib/ebooks";

function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "");
}

function wrapText(text: string, maxChars: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.replace(/\r\n/g, "\n").split("\n")) {
    if (!paragraph.trim()) {
      out.push("");
      continue;
    }
    let rest = paragraph.trim();
    while (rest.length > maxChars) {
      let cut = rest.lastIndexOf(" ", maxChars);
      if (cut < Math.floor(maxChars * 0.5)) cut = maxChars;
      out.push(rest.slice(0, cut).trimEnd());
      rest = rest.slice(cut).trimStart();
    }
    if (rest) out.push(rest);
  }
  return out;
}

type PageContent = { streams: string[] };

function buildPageStream(lines: { text: string; size: number; gapAfter?: number }[]): string {
  const ops: string[] = ["BT"];
  let y = 720;
  let first = true;
  for (const line of lines) {
    const size = line.size;
    if (y < 64) break;
    if (first) {
      ops.push(`/F1 ${size} Tf`);
      ops.push(`50 ${y} Td`);
      first = false;
    } else {
      const gap = line.gapAfter ?? size + 4;
      ops.push(`0 -${gap} Td`);
      ops.push(`/F1 ${size} Tf`);
    }
    ops.push(`(${esc(line.text)}) Tj`);
    y -= line.gapAfter ?? size + 4;
  }
  ops.push("ET");
  return ops.join("\n");
}

export function buildEbookPdf(book: Ebook): Buffer {
  const pages: PageContent[] = [];

  pages.push({
    streams: [
      buildPageStream([
        { text: "DOYINTECH PRESS", size: 11, gapAfter: 28 },
        { text: book.title.slice(0, 60), size: 22, gapAfter: 18 },
        ...(book.title.length > 60
          ? [{ text: book.title.slice(60, 120), size: 22, gapAfter: 18 }]
          : []),
        { text: book.subtitle.slice(0, 90), size: 12, gapAfter: 14 },
        ...(book.subtitle.length > 90
          ? [{ text: book.subtitle.slice(90, 180), size: 12, gapAfter: 14 }]
          : []),
        { text: " ", size: 10, gapAfter: 20 },
        { text: `By ${book.author}`, size: 12, gapAfter: 10 },
        { text: book.pagesLabel, size: 10, gapAfter: 8 },
        { text: book.category, size: 10, gapAfter: 24 },
        { text: " ", size: 10, gapAfter: 12 },
        ...wrapText(book.blurb, 78).slice(0, 8).map((t) => ({
          text: t,
          size: 11,
          gapAfter: 14,
        })),
        { text: " ", size: 10, gapAfter: 28 },
        { text: "Licensed to the purchaser · Personal use", size: 9, gapAfter: 10 },
        { text: "doyintech.vercel.app/ebooks", size: 9, gapAfter: 10 },
      ]),
    ],
  });

  const benefitLines = [
    { text: "What you get", size: 16, gapAfter: 20 },
    ...book.benefits.flatMap((b) =>
      wrapText(`• ${b}`, 82).map((t, i) => ({
        text: t,
        size: 11,
        gapAfter: i === 0 ? 14 : 12,
      }))
    ),
  ];
  pages.push({ streams: [buildPageStream(benefitLines)] });

  const tocLines = [
    { text: "Contents", size: 16, gapAfter: 22 },
    ...book.chapters.map((ch, i) => ({
      text: `${i + 1}. ${ch.title}`.slice(0, 85),
      size: 11,
      gapAfter: 14,
    })),
  ];
  pages.push({ streams: [buildPageStream(tocLines)] });

  for (let ci = 0; ci < book.chapters.length; ci++) {
    const ch = book.chapters[ci];
    const bodyLines = wrapText(ch.body, 84);
    const caption = ch.imageCaption
      ? wrapText(`[Illustration: ${ch.imageCaption}]`, 84)
      : [];

    const all: { text: string; size: number; gapAfter?: number }[] = [
      { text: `Chapter ${ci + 1}`, size: 10, gapAfter: 12 },
      { text: ch.title.slice(0, 80), size: 15, gapAfter: 16 },
      ...caption.map((t) => ({ text: t, size: 9, gapAfter: 12 })),
      { text: " ", size: 8, gapAfter: 8 },
    ];

    const maxBody = 36;
    let offset = 0;
    let part = 0;
    while (offset < bodyLines.length || part === 0) {
      const slice = bodyLines.slice(offset, offset + maxBody);
      const header =
        part === 0
          ? all
          : [
              {
                text: `${ch.title.slice(0, 50)}${ch.title.length > 50 ? "…" : ""} (cont.)`,
                size: 11,
                gapAfter: 16,
              },
            ];
      const lines = [
        ...header,
        ...slice.map((t) => ({ text: t || " ", size: 11, gapAfter: 13 })),
      ];
      pages.push({ streams: [buildPageStream(lines)] });
      offset += maxBody;
      part++;
      if (slice.length === 0) break;
    }
  }

  pages.push({
    streams: [
      buildPageStream([
        { text: "Thank you", size: 16, gapAfter: 18 },
        { text: "You purchased this guide from DoyinTech.", size: 11, gapAfter: 14 },
        { text: "Support: doyintechnology@outlook.com", size: 11, gapAfter: 12 },
        { text: "WhatsApp: +234 808 534 3926", size: 11, gapAfter: 12 },
        { text: " ", size: 10, gapAfter: 16 },
        {
          text: "For personal use of the purchaser. Redistribution is not permitted.",
          size: 9,
          gapAfter: 12,
        },
        { text: "© DoyinTech", size: 10, gapAfter: 10 },
      ]),
    ],
  });

  const parts: Buffer[] = [];
  const write = (s: string) => parts.push(Buffer.from(s, "utf8"));
  write("%PDF-1.4\n");
  const objOffsets: number[] = [0];

  const emitObj = (id: number, body: string) => {
    objOffsets[id] = Buffer.concat(parts).length;
    write(`${id} 0 obj\n${body}\nendobj\n`);
  };

  let nextId = 1;
  const catalogId = nextId++;
  const pagesId = nextId++;
  const fontId = nextId++;

  const pageIds: number[] = [];
  const contentIds: number[] = [];

  for (let i = 0; i < pages.length; i++) {
    const contentId = nextId++;
    const pageId = nextId++;
    contentIds.push(contentId);
    pageIds.push(pageId);

    const stream = pages[i].streams[0] || "BT /F1 11 Tf 50 700 Td ( ) Tj ET";
    const footer = `\nBT /F1 9 Tf 50 36 Td (${esc(`${book.title.slice(0, 40)} · ${i + 1} / ${pages.length}`)}) Tj ET`;
    const full = stream + footer;
    emitObj(
      contentId,
      `<< /Length ${Buffer.byteLength(full, "utf8")} >>\nstream\n${full}\nendstream`
    );
  }

  for (let i = 0; i < pageIds.length; i++) {
    emitObj(
      pageIds[i],
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Contents ${contentIds[i]} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
  }

  emitObj(fontId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  emitObj(
    pagesId,
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`
  );
  emitObj(catalogId, `<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  const maxId = nextId - 1;
  const xrefStart = Buffer.concat(parts).length;
  write(`xref\n0 ${maxId + 1}\n`);
  write("0000000000 65535 f \n");
  for (let i = 1; i <= maxId; i++) {
    write(String(objOffsets[i] || 0).padStart(10, "0") + " 00000 n \n");
  }
  write(
    `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  );

  return Buffer.concat(parts);
}

export function ebookPdfFilename(book: Ebook): string {
  return `${book.slug}-doyintech.pdf`;
}
