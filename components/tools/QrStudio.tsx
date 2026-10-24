"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import PaidGate, { usePaidUnlock } from "@/components/tools/PaidGate";
import { track } from "@/lib/analytics/client";

type Kind = "link" | "whatsapp" | "wifi" | "contact" | "text";

const KINDS: { id: Kind; label: string }[] = [
  { id: "link", label: "Website link" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "contact", label: "Contact card" },
  { id: "text", label: "Text" },
];

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";
const label = "block text-[13px] text-[#a1a1a6]";
const EXPORT_SIZE = 1024;

/** Wi-Fi QR strings need \ ; , : " escaped. */
const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

function normalizeNgPhone(input: string) {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  return d;
}

/** Relative luminance contrast ratio between two hex colours. */
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/**
 * QR codes for links, WhatsApp chats, Wi-Fi, contact cards and text — generated in the browser.
 * Free: colours, PNG and SVG. Branded (paid or Pro): logo in the centre and a caption frame.
 */
export default function QrStudio() {
  const [kind, setKind] = useState<Kind>("link");
  const [url, setUrl] = useState("https://");
  const [waNumber, setWaNumber] = useState("");
  const [waText, setWaText] = useState("Hi, I'd like to place an order.");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [c, setC] = useState({ first: "", last: "", org: "", phone: "", email: "", site: "" });
  const [text, setText] = useState("");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");
  const [logo, setLogo] = useState<string>("");
  const [caption, setCaption] = useState("Scan to order");
  const [frameColor, setFrameColor] = useState("#ff8c14");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { unlocked: branded } = usePaidUnlock("branded-qr");

  const payload = useMemo(() => {
    switch (kind) {
      case "link":
        return /^https?:\/\/.+\..+/.test(url.trim()) ? url.trim() : "";
      case "whatsapp": {
        const n = normalizeNgPhone(waNumber);
        if (n.length < 10) return "";
        return `https://wa.me/${n}${waText.trim() ? `?text=${encodeURIComponent(waText.trim())}` : ""}`;
      }
      case "wifi":
        if (!ssid.trim()) return "";
        return `WIFI:T:${wifiSec};S:${wifiEscape(ssid.trim())};${wifiSec === "nopass" ? "" : `P:${wifiEscape(wifiPass)};`};`;
      case "contact": {
        if (!c.first.trim() && !c.org.trim()) return "";
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${c.last.trim()};${c.first.trim()};;;`,
          `FN:${[c.first.trim(), c.last.trim()].filter(Boolean).join(" ") || c.org.trim()}`,
          c.org.trim() && `ORG:${c.org.trim()}`,
          c.phone.trim() && `TEL;TYPE=CELL:${c.phone.trim()}`,
          c.email.trim() && `EMAIL:${c.email.trim()}`,
          c.site.trim() && `URL:${c.site.trim()}`,
          "END:VCARD",
        ]
          .filter(Boolean)
          .join("\n");
      }
      case "text":
        return text.trim();
    }
  }, [kind, url, waNumber, waText, ssid, wifiPass, wifiSec, c, text]);

  const useLogo = branded && Boolean(logo);
  const useFrame = branded && Boolean(caption.trim());
  const lowContrast = contrast(fg, bg) < 3;

  /** Draws the final QR (with logo and frame when branded) onto `canvas` at `size` px wide. */
  async function draw(canvas: HTMLCanvasElement, size: number) {
    const qr = document.createElement("canvas");
    await QRCode.toCanvas(qr, payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: useLogo ? "H" : "M",
      color: { dark: fg, light: bg },
    });
    const frameH = useFrame ? Math.round(size * 0.16) : 0;
    canvas.width = size;
    canvas.height = size + frameH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(qr, 0, 0);

    if (useLogo) {
      const img = new Image();
      img.src = logo;
      await img.decode();
      const box = Math.round(size * 0.22);
      const x = (size - box) / 2;
      const r = box * 0.18;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(x - size * 0.012, x - size * 0.012, box + size * 0.024, box + size * 0.024, r);
      ctx.fill();
      const scale = Math.min(box / img.width, box / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    }

    if (useFrame) {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, size, size, frameH);
      ctx.fillStyle = contrast(frameColor, "#ffffff") >= 3 ? "#ffffff" : "#111111";
      ctx.font = `600 ${Math.round(frameH * 0.42)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption.trim().slice(0, 32), size / 2, size + frameH / 2, size * 0.9);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload) return;
    let cancelled = false;
    draw(canvas, 480)
      .then(() => !cancelled && setError(""))
      .catch(() => !cancelled && setError("That's too much content for one QR code. Shorten it and try again."));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draw reads the same state listed here
  }, [payload, fg, bg, logo, caption, frameColor, branded]);

  async function downloadPng() {
    const canvas = document.createElement("canvas");
    await draw(canvas, EXPORT_SIZE);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${kind}.png`;
    a.click();
    track("tool_download", `QR ${kind} PNG${branded ? " branded" : ""}`);
  }

  async function downloadSvg() {
    const svg = await QRCode.toString(payload, { type: "svg", margin: 2, errorCorrectionLevel: "M", color: { dark: fg, light: bg } });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = `qr-${kind}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    track("tool_download", `QR ${kind} SVG`);
  }

  function onLogo(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      setError("Use a PNG, JPG, WebP or SVG logo under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="QR code type">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kind === k.id}
              onClick={() => setKind(k.id)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                kind === k.id ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/30"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {kind === "link" && (
          <label className={label}>
            Website or page link
            <input className={field} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourbusiness.com/menu" />
          </label>
        )}
        {kind === "whatsapp" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              WhatsApp number
              <input className={field} type="tel" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="0803 123 4567" />
            </label>
            <label className={label}>
              Message they&apos;ll send (optional)
              <input className={field} value={waText} onChange={(e) => setWaText(e.target.value)} />
            </label>
          </div>
        )}
        {kind === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={label}>
              Network name
              <input className={field} value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Shop_WiFi" />
            </label>
            <label className={label}>
              Password
              <input className={field} value={wifiPass} disabled={wifiSec === "nopass"} onChange={(e) => setWifiPass(e.target.value)} />
            </label>
            <label className={label}>
              Security
              <select className={field} value={wifiSec} onChange={(e) => setWifiSec(e.target.value as typeof wifiSec)}>
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            </label>
          </div>
        )}
        {kind === "contact" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["first", "First name"],
                ["last", "Last name"],
                ["org", "Business"],
                ["phone", "Phone"],
                ["email", "Email"],
                ["site", "Website"],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className={label}>
                {l}
                <input className={field} value={c[k]} onChange={(e) => setC((s) => ({ ...s, [k]: e.target.value }))} />
              </label>
            ))}
          </div>
        )}
        {kind === "text" && (
          <label className={label}>
            Text
            <textarea className={field} rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Account: 0123456789 · GTBank · Ada's Kitchen" />
          </label>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className={label}>
            QR colour
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="mt-1 block h-10 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent" />
          </label>
          <label className={label}>
            Background
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="mt-1 block h-10 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent" />
          </label>
        </div>
        {lowContrast && <p className="text-[13px] text-amber-300">These colours are too close together; some phones won&apos;t scan it. Use a dark QR on a light background.</p>}

        <PaidGate
          toolSlug="branded-qr"
          preview={
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[14px] font-semibold text-white">Branded QR codes</p>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">
                Put your logo in the middle and add a caption like &ldquo;Scan to order&rdquo; in your brand colour. Customers trust a
                branded code more and scan it more often.
              </p>
            </div>
          }
        >
          <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-[14px] font-semibold text-white">Branding</p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/5">
                {logo ? "Change logo" : "Add your logo"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
              </label>
              {logo && (
                <button type="button" onClick={() => setLogo("")} className="text-[12px] text-[#a1a1a6] underline">
                  Remove logo
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <label className={label}>
                Caption under the code (leave empty for none)
                <input className={field} value={caption} maxLength={32} onChange={(e) => setCaption(e.target.value)} />
              </label>
              <label className={label}>
                Caption colour
                <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="mt-1 block h-10 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent" />
              </label>
            </div>
          </div>
        </PaidGate>
      </div>

      <div className="h-fit rounded-2xl border border-white/10 bg-[#141a28] p-5 lg:sticky lg:top-24">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/[0.03]">
          {payload ? (
            <canvas ref={canvasRef} className="h-auto max-h-full w-full max-w-[320px] object-contain" aria-label="QR code preview" role="img" />
          ) : (
            <p className="px-6 text-center text-[14px] text-[#86868b]">Fill in the details to see your QR code.</p>
          )}
        </div>
        {error && <p className="mt-3 text-[13px] text-red-400">{error}</p>}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!payload || Boolean(error)}
            onClick={downloadPng}
            className="rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-40"
          >
            Download PNG
          </button>
          <button
            type="button"
            disabled={!payload || Boolean(error)}
            onClick={downloadSvg}
            className="rounded-full border border-white/20 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
          >
            SVG (print)
          </button>
        </div>
        <p className="mt-3 text-[12px] text-[#86868b]">
          Generated on your device: nothing you type is sent to us. Static codes never expire. Test-scan before printing.
          {branded ? " SVG export is the plain code; logo and caption are in the PNG." : ""}
        </p>
      </div>
    </div>
  );
}
