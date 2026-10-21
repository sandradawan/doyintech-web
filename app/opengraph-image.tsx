import { ImageResponse } from "next/og";

export const alt = "DoyinTech — Websites that get clients. Fixed price.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default 1200×630 share card (the 512² logo was too small for summary_large_image). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a0e17 0%, #141a28 60%, #2a1a08 100%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#ff8c14",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>DoyinTech</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            Websites that get clients.
          </div>
          <div style={{ fontSize: 32, color: "#a1a1a6", maxWidth: 980 }}>
            Fixed-price sites, WhatsApp systems, care plans and digital tools for growing businesses.
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 26, color: "#ff8c14", fontWeight: 600 }}>
          <span>50% deposit</span>
          <span>·</span>
          <span>Secure Paystack</span>
          <span>·</span>
          <span>Live in days</span>
        </div>
      </div>
    ),
    size
  );
}
