/** Draws a horizontal bar chart to a PNG in the browser, for the Word report. */
import type { ChartImage } from "./report-docx";

export async function barChartPng(labels: string[], values: number[]): Promise<ChartImage | null> {
  if (typeof document === "undefined") return null;
  const scale = 2;
  const W = 1040;
  const rowH = 46;
  const H = 24 + labels.length * rowH;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const total = values.reduce((a, b) => a + b, 0) || 1;
  const max = Math.max(...values, 1);
  const labelW = 300;
  const barX = labelW + 14;
  const barMax = W - barX - 170;
  ctx.font = "22px 'Times New Roman', Times, serif";
  ctx.textBaseline = "middle";

  labels.forEach((lab, i) => {
    const y = 12 + i * rowH;
    const w = Math.max(2, (values[i] / max) * barMax);
    let name = lab;
    while (ctx.measureText(name).width > labelW - 8 && name.length > 3) name = name.slice(0, -2);
    if (name !== lab) name = name.trimEnd() + "…";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    ctx.fillText(name, labelW, y + rowH / 2 - 3);
    ctx.fillStyle = "#1F4E79";
    ctx.fillRect(barX, y + 4, w, rowH - 14);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText(`${values[i]} (${((values[i] / total) * 100).toFixed(1)}%)`, barX + w + 10, y + rowH / 2 - 3);
  });
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(barX, 8);
  ctx.lineTo(barX, H - 8);
  ctx.stroke();

  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return null;
  return { data: new Uint8Array(await blob.arrayBuffer()), width: W, height: H };
}
