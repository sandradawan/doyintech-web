function escapePdfText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function textToPdfBuffer(title: string, body: string): Buffer {
  const lines: string[] = [];
  const maxChars = 90;
  const raw = `${title}\n\n${body}`.replace(/\r\n/g, "\n").split("\n");
  for (const line of raw) {
    if (line.length <= maxChars) {
      lines.push(line);
      continue;
    }
    let rest = line;
    while (rest.length > maxChars) {
      let cut = rest.lastIndexOf(" ", maxChars);
      if (cut < 40) cut = maxChars;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut).trimStart();
    }
    if (rest) lines.push(rest);
  }

  const perPage = 45;
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += perPage) {
    pages.push(lines.slice(i, i + perPage));
  }
  if (pages.length === 0) pages.push([title]);

  const kids: number[] = [];
  let nextId = 3;
  const pageObjs: { id: number; contentId: number; stream: string }[] = [];

  for (const pageLines of pages) {
    const contentId = nextId++;
    const pageId = nextId++;
    const ops: string[] = ["BT", "/F1 11 Tf", "14 TL", "50 800 Td"];
    let y = 800;
    for (const line of pageLines) {
      ops.push(`(${escapePdfText(line.slice(0, 120))}) Tj`);
      ops.push("T*");
      y -= 14;
      if (y < 50) break;
    }
    ops.push("ET");
    pageObjs.push({ id: pageId, contentId, stream: ops.join("\n") });
    kids.push(pageId);
  }

  const parts: Buffer[] = [];
  const write = (s: string) => parts.push(Buffer.from(s, "utf8"));
  write("%PDF-1.4\n");
  const objOffsets: number[] = [0];
  const emitObj = (id: number, body: string) => {
    objOffsets[id] = Buffer.concat(parts).length;
    write(`${id} 0 obj\n${body}\nendobj\n`);
  };

  emitObj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  emitObj(
    2,
    `<< /Type /Pages /Kids [${kids.map((id) => `${id} 0 R`).join(" ")}] /Count ${kids.length} >>`
  );
  const fontId = nextId++;
  emitObj(fontId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  for (const p of pageObjs) {
    emitObj(
      p.contentId,
      `<< /Length ${Buffer.byteLength(p.stream, "utf8")} >>\nstream\n${p.stream}\nendstream`
    );
    emitObj(
      p.id,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${p.contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
  }

  const xrefStart = Buffer.concat(parts).length;
  const maxId = nextId - 1;
  write(`xref\n0 ${maxId + 1}\n`);
  write("0000000000 65535 f \n");
  for (let i = 1; i <= maxId; i++) {
    write(String(objOffsets[i] || 0).padStart(10, "0") + " 00000 n \n");
  }
  write(`trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);
  return Buffer.concat(parts);
}
