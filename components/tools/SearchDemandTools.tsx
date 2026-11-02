"use client";

import { useMemo, useState } from "react";

const box = "rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8 space-y-4";
const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";
const labelCls = "block text-xs text-gray-500 mb-1";
const btn =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50";

function Field({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input {...rest} className={input} />
    </label>
  );
}

function Area({
  label,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea {...rest} className={input} />
    </label>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={btn}
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

function escAttr(s: string): string {
  return s.replace(/&/g, "&").replace(/"/g, "&#34;").replace(/</g, "<");
}

export function WhatsAppLinkGeneratorTool() {
  const [phone, setPhone] = useState("234");
  const [message, setMessage] = useState("");
  const digits = phone.replace(/\D/g, "");
  const link = digits
    ? `https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`
    : "";
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Create a clickable WhatsApp link (wa.me) with an optional pre-filled message.
      </p>
      <Field
        label="Phone with country code (e.g. 2348012345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        inputMode="tel"
      />
      <Area
        label="Pre-filled message (optional)"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {link ? (
        <div className="space-y-2">
          <p className="break-all rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-primary">
            {link}
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyBtn text={link} />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function NigeriaVatCalculatorTool() {
  const [amount, setAmount] = useState("100000");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const rate = 0.075;
  const a = Math.max(0, Number(amount) || 0);
  const base = mode === "exclusive" ? a : a / (1 + rate);
  const vat = base * rate;
  const total = base + vat;
  const fmt = (n: number) =>
    "NGN " + n.toLocaleString("en-NG", { maximumFractionDigits: 2 });
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">Nigeria VAT at 7.5%. Exclusive or inclusive amount.</p>
      <Field label="Amount (NGN)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      <div className="flex flex-wrap gap-2">
        {(["exclusive", "inclusive"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              "rounded-full border px-4 py-1.5 text-xs font-semibold " +
              (mode === m
                ? "border-primary bg-primary/20 text-white"
                : "border-white/15 text-gray-400")
            }
          >
            {m === "exclusive" ? "VAT exclusive" : "VAT inclusive"}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-gray-500">Net / base</p>
          <p className="mt-1 text-lg font-semibold text-white">{fmt(base)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-gray-500">VAT 7.5%</p>
          <p className="mt-1 text-lg font-semibold text-amber-200">{fmt(vat)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-gray-500">Gross total</p>
          <p className="mt-1 text-lg font-semibold text-emerald-300">{fmt(total)}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">Informational only - confirm with your accountant for filing.</p>
    </div>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paras = text.split(/\n+/).filter((p) => p.trim()).length;
  const readingMin = Math.max(1, Math.ceil(words / 200));
  return (
    <div className={box}>
      <Area label="Paste your text" rows={8} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Words", words],
          ["Characters", chars],
          ["Chars (no spaces)", charsNoSpace],
          ["Sentences", sentences],
          ["Paragraphs", paras],
          ["~Read time", readingMin + " min"],
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-xs text-gray-500">{k}</p>
            <p className="mt-1 text-lg font-semibold text-white">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("https://www.example.com");
  const html =
    "<title>" +
    escAttr(title || "Your page title") +
    "</title>\n" +
    '<meta name="description" content="' +
    escAttr(desc || "Your description") +
    '" />\n' +
    '<link rel="canonical" href="' +
    escAttr(url) +
    '" />';
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        SEO title and meta description with length checks (~50-60 / ~150-160).
      </p>
      <Field label="Page title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70} />
      <p className={"text-xs " + (title.length > 60 ? "text-amber-300" : "text-gray-500")}>
        {title.length}/60 recommended
      </p>
      <Area label="Meta description" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={180} />
      <p className={"text-xs " + (desc.length > 160 ? "text-amber-300" : "text-gray-500")}>
        {desc.length}/160 recommended
      </p>
      <Field label="Canonical URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <div className="rounded-xl border border-white/10 bg-white p-4 text-left text-black">
        <p className="text-sm text-blue-700">{title || "Page title preview"}</p>
        <p className="text-xs text-emerald-700">{url}</p>
        <p className="mt-1 text-sm text-gray-700">{desc || "Description preview appears here."}</p>
      </div>
      <pre className="overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-gray-300">{html}</pre>
      <CopyBtn text={html} />
    </div>
  );
}

export function PercentageCalculatorTool() {
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const x = Number(a) || 0;
  const y = Number(b) || 0;
  const of = (x / 100) * y;
  const isWhat = y !== 0 ? (x / y) * 100 : 0;
  const change = y !== 0 ? ((x - y) / y) * 100 : 0;
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="X" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
        <Field label="Y" value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
      </div>
      <ul className="space-y-2 text-sm text-gray-200">
        <li>
          <strong className="text-white">{x}%</strong> of <strong className="text-white">{y}</strong> ={" "}
          <span className="text-emerald-300">
            {of.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </span>
        </li>
        <li>
          <strong className="text-white">{x}</strong> is{" "}
          <span className="text-sky-300">{isWhat.toFixed(2)}%</span> of{" "}
          <strong className="text-white">{y}</strong>
        </li>
        <li>
          Change from {y} to {x}:{" "}
          <span className={change >= 0 ? "text-emerald-300" : "text-red-300"}>
            {change.toFixed(2)}%
          </span>
        </li>
      </ul>
    </div>
  );
}

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const variants = useMemo(
    () => ({
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      title: text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
      sentence: text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "",
    }),
    [text]
  );
  return (
    <div className={box}>
      <Area label="Your text" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      {(
        [
          ["UPPERCASE", variants.upper],
          ["lowercase", variants.lower],
          ["Title Case", variants.title],
          ["Sentence case", variants.sentence],
        ] as const
      ).map(([name, val]) => (
        <div key={name} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">{name}</p>
            <p className="break-words text-sm text-white">{val || "-"}</p>
          </div>
          {val ? <CopyBtn text={val} /> : null}
        </div>
      ))}
    </div>
  );
}

export function UrlEncoderTool() {
  const [text, setText] = useState("https://www.doyintech.com/tools?q=hello world");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  let out = "";
  let err = "";
  try {
    out = mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
  } catch {
    err = "Could not decode - check the string.";
  }
  return (
    <div className={box}>
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              "rounded-full border px-4 py-1.5 text-xs font-semibold capitalize " +
              (mode === m
                ? "border-primary bg-primary/20 text-white"
                : "border-white/15 text-gray-400")
            }
          >
            {m}
          </button>
        ))}
      </div>
      <Area label="Input" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
      <pre className="overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-gray-300">
        {out}
      </pre>
      {out ? <CopyBtn text={out} /> : null}
    </div>
  );
}
