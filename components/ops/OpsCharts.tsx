"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { OpsWorkspace } from "@/lib/ops/types";
import { DEAL_STAGES } from "@/lib/ops/types";
import { formatNgn } from "@/lib/ops/store";

const COLORS = [
  "#ff8c14",
  "#2997ff",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#38bdf8",
];

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl";

type Props = { ws: OpsWorkspace };

export default function OpsCharts({ ws }: Props) {
  const chartData = useMemo(() => buildChartData(ws), [ws]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Pipeline by stage" subtitle="Deal value (₦)">
          <BarChart data={chartData.stageBars} />
        </GlassCard>
        <GlassCard title="Invoice mix" subtitle="Count by status">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <DonutChart segments={chartData.invoiceSegments} size={160} stroke={22} />
            <Legend items={chartData.invoiceSegments} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Revenue pulse" subtitle="Invoice amounts over time">
          <LineChart points={chartData.linePoints} />
        </GlassCard>
        <GlassCard title="Work mix" subtitle="Contacts · Deals · Quotes · Tasks">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <PieChart segments={chartData.workSegments} size={160} />
            <Legend items={chartData.workSegments} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function GlassCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={glass}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[11px] text-white/40">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function Legend({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <ul className="w-full space-y-2 sm:max-w-[180px]">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-2 text-[12px]">
          <span className="flex items-center gap-2 text-white/70">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
          <span className="font-medium text-white/90">
            {item.value}
            <span className="ml-1 text-[10px] text-white/35">
              ({Math.round((item.value / total) * 100)}%)
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-44 items-end gap-2 pt-2">
      {data.map((d, i) => {
        const h = Math.max(6, Math.round((d.value / max) * 140));
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[9px] tabular-nums text-white/45">
              {d.value > 0 ? formatNgn(d.value).replace("NGN", "").trim() : "—"}
            </span>
            <div className="relative flex h-36 w-full items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="w-[70%] max-w-[36px] rounded-t-md"
                style={{
                  background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}55 100%)`,
                  boxShadow: `0 0 24px ${d.color}33`,
                }}
                title={`${d.label}: ${formatNgn(d.value)}`}
              />
            </div>
            <span className="max-w-full truncate text-[9px] text-white/40">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function DonutChart({
  segments,
  size,
  stroke,
}: {
  segments: { label: string; value: number; color: string }[];
  size: number;
  stroke: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  let angle = 0;

  if (total === 0) {
    return (
      <svg width={size} height={size} className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-white/40 text-[11px]">
          No data
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} className="shrink-0">
      {segments.map((seg, i) => {
        if (seg.value <= 0) return null;
        const sweep = (seg.value / total) * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        if (sweep >= 359.9) {
          return (
            <motion.circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
            />
          );
        }
        const d = arcPath(cx, cy, r, start, end);
        return (
          <motion.path
            key={seg.label}
            d={d}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 4} fill="rgba(7,11,18,0.85)" />
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-white text-[18px] font-semibold">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-white/40 text-[10px]">
        invoices
      </text>
    </svg>
  );
}

function PieChart({
  segments,
  size,
}: {
  segments: { label: string; value: number; color: string }[];
  size: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  let angle = 0;

  if (total === 0) {
    return (
      <svg width={size} height={size} className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.06)" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-white/40 text-[11px]">
          No data
        </text>
      </svg>
    );
  }

  function slicePath(startAngle: number, endAngle: number) {
    const start = polar(cx, cy, r, endAngle);
    const end = polar(cx, cy, r, startAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
  }

  return (
    <svg width={size} height={size} className="shrink-0 drop-shadow-lg">
      {segments.map((seg, i) => {
        if (seg.value <= 0) return null;
        const sweep = (seg.value / total) * 360;
        const start = angle;
        const end = angle + Math.max(sweep, 0.5);
        angle = end;
        return (
          <motion.path
            key={seg.label}
            d={slicePath(start, end)}
            fill={seg.color}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.92, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.22} fill="rgba(7,11,18,0.9)" stroke="rgba(255,255,255,0.08)" />
    </svg>
  );
}

function LineChart({ points }: { points: { label: string; value: number }[] }) {
  const w = 320;
  const h = 140;
  const pad = 16;
  const max = Math.max(...points.map((p) => p.value), 1);
  const n = Math.max(points.length, 2);

  const coords = points.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / (n - 1);
    const y = h - pad - (p.value / max) * (h - pad * 2);
    return { x, y, ...p };
  });

  const lineD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaD =
    coords.length > 0
      ? `${lineD} L ${coords[coords.length - 1].x} ${h - pad} L ${coords[0].x} ${h - pad} Z`
      : "";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full">
      <defs>
        <linearGradient id="opsLineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8c14" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff8c14" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="rgba(255,255,255,0.06)"
        />
      ))}
      <motion.path
        d={areaD}
        fill="url(#opsLineFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={lineD}
        fill="none"
        stroke="#ff8c14"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      {coords.map((c, i) => (
        <motion.circle
          key={c.label + i}
          cx={c.x}
          cy={c.y}
          r={4}
          fill="#0a0f1a"
          stroke="#ff8c14"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15 + i * 0.06 }}
        />
      ))}
      {coords.map((c, i) => (
        <text
          key={`l-${i}`}
          x={c.x}
          y={h - 2}
          textAnchor="middle"
          className="fill-white/35 text-[8px]"
        >
          {c.label}
        </text>
      ))}
    </svg>
  );
}

function buildChartData(ws: OpsWorkspace) {
  const stageBars = DEAL_STAGES.filter((s) => s.id !== "lost").map((s, i) => ({
    label: s.label.slice(0, 6),
    value: ws.deals
      .filter((d) => d.stage === s.id)
      .reduce((sum, d) => sum + (d.valueNgn || 0), 0),
    color: COLORS[i % COLORS.length],
  }));

  const statusOrder = ["paid", "sent", "overdue", "draft", "cancelled"] as const;
  const statusColors: Record<string, string> = {
    paid: "#34d399",
    sent: "#ff8c14",
    overdue: "#f87171",
    draft: "#94a3b8",
    cancelled: "#64748b",
  };
  const invoiceSegments = statusOrder
    .map((st) => ({
      label: st,
      value: ws.invoices.filter((i) => i.status === st).length,
      color: statusColors[st] || COLORS[0],
    }))
    .filter((x) => x.value > 0);
  if (invoiceSegments.length === 0) {
    invoiceSegments.push({ label: "none", value: 0, color: "#475569" });
  }

  const buckets = new Map<string, number>();
  const invSorted = [...ws.invoices].sort((a, b) =>
    (a.createdAt || "").localeCompare(b.createdAt || "")
  );
  invSorted.forEach((inv) => {
    const key = (inv.createdAt || "").slice(5, 10) || "—";
    buckets.set(key, (buckets.get(key) || 0) + (inv.amountNgn || 0));
  });
  let linePoints = Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  if (linePoints.length < 2) {
    linePoints = ws.deals.slice(0, 6).map((d, i) => ({
      label: `D${i + 1}`,
      value: d.valueNgn || 0,
    }));
  }
  if (linePoints.length < 2) {
    linePoints = [
      { label: "Start", value: 0 },
      { label: "Now", value: ws.invoices.reduce((s, i) => s + (i.amountNgn || 0), 0) },
    ];
  }

  const workSegments = [
    { label: "Contacts", value: ws.contacts.length, color: COLORS[0] },
    { label: "Deals", value: ws.deals.length, color: COLORS[1] },
    { label: "Quotes", value: (ws.quotes || []).length, color: COLORS[2] },
    { label: "Tasks", value: (ws.tasks || []).length, color: COLORS[3] },
  ].filter((x) => x.value > 0);
  if (workSegments.length === 0) {
    workSegments.push({ label: "Empty", value: 1, color: "#475569" });
  }

  return { stageBars, invoiceSegments, linePoints, workSegments };
}
