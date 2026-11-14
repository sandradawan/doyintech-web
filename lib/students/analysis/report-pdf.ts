/** Renders a Chapter Four report as a PDF (A4, Times, 1.5 line spacing). */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Block, Report, Table } from "./analyze";
import { columnWeights } from "./report-docx";

const MARGIN = 25; // mm
const PAGE_W = 210;
const PAGE_H = 297;
const WIDTH = PAGE_W - 2 * MARGIN;
const PT = 0.3528; // mm per point

/** The built-in PDF fonts only cover Western characters. */
export function pdfSafe(s: string): string {
  return s
    .replace(/χ²/g, "X²")
    .replace(/χ/g, "X")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/₦/g, "N")
    .replace(/[^\x00-\xFF]/g, "?");
}

export function reportToPdf(report: Report): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setProperties({ title: report.title, creator: "DoyinTech Data Analysis Tool" });
  let y = MARGIN;

  const ensure = (h: number) => {
    if (y + h > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  /** Spread the words of one line across the full width. */
  const justifyLine = (line: string, x: number, baseline: number, width: number) => {
    const words = line.trim().split(/\s+/);
    if (words.length < 2) {
      doc.text(line, x, baseline);
      return;
    }
    const used = words.reduce((a, w) => a + doc.getTextWidth(w), 0);
    const gap = (width - used) / (words.length - 1);
    let cx = x;
    for (const w of words) {
      doc.text(w, cx, baseline);
      cx += doc.getTextWidth(w) + gap;
    }
  };

  const text = (s: string, opts: { size?: number; bold?: boolean; italic?: boolean; align?: "left" | "center" | "justify"; after?: number; spacing?: number; indent?: number } = {}) => {
    const size = opts.size ?? 12;
    const style = opts.bold ? (opts.italic ? "bolditalic" : "bold") : opts.italic ? "italic" : "normal";
    doc.setFont("times", style);
    doc.setFontSize(size);
    const indent = opts.indent ?? 0;
    const lh = size * PT * (opts.spacing ?? 1.5);
    const lines: string[] = doc.splitTextToSize(pdfSafe(s), WIDTH - indent);
    lines.forEach((line, i) => {
      ensure(lh);
      const last = i === lines.length - 1;
      if (opts.align === "center") doc.text(line, PAGE_W / 2, y + size * PT, { align: "center" });
      else if (opts.align === "justify" && !last) justifyLine(line, MARGIN + indent, y + size * PT, WIDTH - indent);
      else doc.text(line, MARGIN + indent, y + size * PT);
      y += lh;
    });
    y += opts.after ?? 0;
  };

  const table = (t: Table) => {
    ensure(30);
    text(t.caption, { bold: true, spacing: 1.2, after: 1.5 });
    const small = t.head.length > 8;
    const weights = columnWeights(t);
    const total = weights.reduce((a, b) => a + b, 0);
    const isTextCol = (j: number) => j === 0 || t.head[j] === "Item" || t.head[j] === "Variables";
    const columnStyles: Record<number, { cellWidth: number; halign: "left" | "center" }> = {};
    weights.forEach((w, j) => (columnStyles[j] = { cellWidth: (w / total) * WIDTH, halign: isTextCol(j) ? "left" : "center" }));
    autoTable(doc, {
      startY: y,
      head: [t.head.map(pdfSafe)],
      body: t.rows.map((r) => t.head.map((_, j) => pdfSafe(r[j] ?? ""))),
      theme: "grid",
      margin: { left: MARGIN, right: MARGIN, top: MARGIN, bottom: MARGIN },
      styles: { font: "times", fontSize: small ? 8.5 : 10, textColor: 0, lineColor: 0, lineWidth: 0.2, cellPadding: 1.2, valign: "middle" },
      headStyles: { fillColor: [231, 230, 230], textColor: 0, fontStyle: "bold", halign: "center" },
      columnStyles,
      rowPageBreak: "avoid",
      didParseCell: (d) => {
        if (d.section === "body" && t.boldLast && d.row.index === t.rows.length - 1) d.cell.styles.fontStyle = "bold";
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 2;
    if (t.note) text(t.note, { italic: true, size: 10, spacing: 1.2 });
    y += 4;
  };

  const chart = (title: string, labels: string[], values: number[]) => {
    const rowH = 7;
    const h = 12 + labels.length * rowH;
    ensure(h + 8);
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const max = Math.max(...values, 1);
    const labelW = 48;
    const barX = MARGIN + labelW + 2;
    const barMax = WIDTH - labelW - 30;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    labels.forEach((lab, i) => {
      const by = y + 4 + i * rowH;
      const w = Math.max(0.5, (values[i] / max) * barMax);
      const name = doc.splitTextToSize(pdfSafe(lab), labelW)[0] as string;
      doc.setTextColor(0);
      doc.text(name, MARGIN + labelW, by + 4.2, { align: "right" });
      doc.setFillColor(31, 78, 121);
      doc.rect(barX, by, w, rowH - 2, "F");
      doc.text(`${values[i]} (${((values[i] / total) * 100).toFixed(1)}%)`, barX + w + 1.5, by + 4.2);
    });
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(barX, y + 2, barX, y + 6 + labels.length * rowH);
    y += 8 + labels.length * rowH;
    text(`Figure: Respondents by ${title.toLowerCase()}`, { italic: true, size: 10, align: "center", spacing: 1.2, after: 4 });
  };

  for (const b of report.blocks as Block[]) {
    switch (b.type) {
      case "h1":
        text(b.text, { size: 14, bold: true, align: "center", after: 1 });
        break;
      case "h2":
        ensure(45); // keep a heading with what follows it
        y += 2;
        text(b.text, { bold: true, after: 1 });
        break;
      case "h3":
        ensure(45);
        text(b.text, { bold: true, after: 1 });
        break;
      case "p":
        text(b.text, { align: "justify", after: 2.5 });
        break;
      case "bullets":
        b.items.forEach((item, i) => {
          ensure(8);
          doc.setFont("times", "normal");
          doc.setFontSize(12);
          doc.text(`${i + 1}.`, MARGIN, y + 12 * PT);
          text(item, { align: "justify", indent: 8, after: 1 });
        });
        y += 2;
        break;
      case "table":
        table(b.table);
        break;
      case "chart":
        chart(b.title, b.labels, b.values);
        break;
    }
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(String(i), PAGE_W / 2, PAGE_H - 12, { align: "center" });
  }
  return doc.output("blob");
}
