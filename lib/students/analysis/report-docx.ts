/** Renders a Chapter Four report as a Word document (.docx). */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageNumber,
  Paragraph,
  Table as DocxTable,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import type { Block, Report, Table } from "./analyze";

export type ChartImage = { data: Uint8Array; width: number; height: number };

const FONT = "Times New Roman";
const BODY = 24; // 12 pt, in half-points
const CONTENT_WIDTH = 9026; // A4 width minus 1-inch margins, in twips
const LINE_15 = 360;

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

function bodyPara(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE_15, after: 160 },
    children: [new TextRun({ text })],
  });
}

/** Relative column widths from content length, so the Item column gets the room. */
export function columnWeights(t: Table): number[] {
  return t.head.map((h, j) => {
    const texts = [h, ...t.rows.map((r) => r[j] || "")];
    const lines = texts.flatMap((s) => s.split("\n"));
    const longestLine = Math.max(...lines.map((s) => s.length));
    // Never narrower than the longest single word, so words are not broken.
    const longestWord = Math.max(
      ...h.split(/\s+/).map((w) => w.length * 1.3), // headers are bold
      ...lines.flatMap((s) => s.split(/\s+/)).map((w) => w.length),
    );
    return Math.max(longestWord + 3, Math.min(longestLine, 36));
  });
}

function tableBlock(t: Table): (Paragraph | DocxTable)[] {
  const small = t.head.length > 8;
  const size = small ? 18 : 20;
  const weights = columnWeights(t);
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.round((w / total) * CONTENT_WIDTH));

  const cell = (text: string, opts: { bold?: boolean; shade?: boolean; first?: boolean; width: number }) =>
    new TableCell({
      borders,
      width: { size: opts.width, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: opts.shade ? { fill: "E7E6E6" } : undefined,
      margins: { top: 40, bottom: 40, left: 70, right: 70 },
      children: (text === "" ? [""] : text.split("\n")).map(
        (line) =>
          new Paragraph({
            alignment: opts.first ? AlignmentType.LEFT : AlignmentType.CENTER,
            children: [new TextRun({ text: line, bold: opts.bold, size })],
          }),
      ),
    });

  const isTextCol = (j: number) => j === 0 || t.head[j] === "Item" || t.head[j] === "Variables";
  const rows = [
    new TableRow({
      tableHeader: true,
      children: t.head.map((h, j) => cell(h, { bold: true, shade: true, first: false, width: widths[j] })),
    }),
    ...t.rows.map(
      (r, i) =>
        new TableRow({
          cantSplit: true,
          children: t.head.map((_, j) =>
            cell(r[j] ?? "", { bold: t.boldLast && i === t.rows.length - 1, first: isTextCol(j), width: widths[j] }),
          ),
        }),
    ),
  ];

  const out: (Paragraph | DocxTable)[] = [
    new Paragraph({
      keepNext: true,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: t.caption, bold: true })],
    }),
    new DocxTable({ rows, width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED }),
  ];
  if (t.note)
    out.push(new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: t.note, italics: true, size: 20 })] }));
  out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  return out;
}

function chartBlock(img: ChartImage | null | undefined, title: string): Paragraph[] {
  if (!img) return [];
  const width = 520; // px at 96 dpi, about 13.8 cm
  const height = Math.round((img.height / img.width) * width);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      keepNext: true,
      children: [new ImageRun({ type: "png", data: img.data, transformation: { width, height }, altText: { name: title, title, description: `Bar chart of ${title}` } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `Figure: Respondents by ${title.toLowerCase()}`, italics: true, size: 20 })],
    }),
  ];
}

/** Build the .docx. `charts` holds one image per chart block, in order (null to skip). */
export async function reportToDocx(report: Report, charts: (ChartImage | null)[] = []): Promise<Blob> {
  const children: (Paragraph | DocxTable)[] = [];
  let chartNo = 0;
  for (const b of report.blocks as Block[]) {
    switch (b.type) {
      case "h1":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, children: [new TextRun(b.text)] }));
        break;
      case "h2":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(b.text)] }));
        break;
      case "h3":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: [new TextRun(b.text)] }));
        break;
      case "p":
        children.push(bodyPara(b.text));
        break;
      case "bullets":
        b.items.forEach((item, i) =>
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: LINE_15, after: 80 },
              indent: { left: 567, hanging: 567 },
              children: [new TextRun({ text: `${i + 1}.\t${item}` })],
            }),
          ),
        );
        break;
      case "table":
        children.push(...tableBlock(b.table));
        break;
      case "chart":
        children.push(...chartBlock(charts[chartNo++], b.title));
        break;
    }
  }

  const heading = (size: number) => ({
    run: { font: FONT, size, bold: true, color: "000000" },
    paragraph: { spacing: { before: 240, after: 160, line: LINE_15 } },
  });

  const doc = new Document({
    creator: "DoyinTech Data Analysis Tool",
    title: report.title,
    description: "Chapter Four: data presentation, analysis and interpretation",
    styles: {
      default: {
        document: { run: { font: FONT, size: BODY } },
        heading1: heading(28),
        heading2: heading(24),
        heading3: heading(24),
      },
    },
    sections: [
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })] })],
          }),
        },
        children,
      },
    ],
  });
  return Packer.toBlob(doc);
}
