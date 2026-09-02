"use client";

export default function ScoreRing({
  score,
  size = 140,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;
  const color =
    clamped >= 80
      ? "#22c55e"
      : clamped >= 60
        ? "#3B82F6"
        : clamped >= 40
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-white">{clamped}</span>
        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          {label || "/ 100"}
        </span>
      </div>
    </div>
  );
}
