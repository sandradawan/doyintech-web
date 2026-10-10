"use client";

import { useState } from "react";
import { PROPERTY_TYPES } from "@/lib/real-estate/listings";

export default function ListPropertyForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    dealType: "rent",
    propertyType: "flat",
    location: "",
    city: "",
    state: "",
    beds: "3",
    baths: "2",
    priceUsd: "",
    description: "",
    features: "",
    imageUrl: "",
    videoUrl: "",
    agentName: "",
    agentPhone: "",
    agentWhatsApp: "",
    website: "",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDone("");
    try {
      const res = await fetch("/api/real-estate/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          beds: Number(form.beds) || 0,
          baths: Number(form.baths) || 0,
          priceUsd: Number(form.priceUsd) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(
        data.message ||
          data.note ||
          "Submitted. An admin will review it in the CRM."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const types = PROPERTY_TYPES.filter((t) => t.value !== "any");

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 space-y-4 rounded-[28px] border border-white/10 bg-[#141416] p-6 sm:p-8"
    >
      {/* honeypot */}
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
      />

      <Field label="Listing title *">
        <input
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="3-bed flat · Lekki Phase 1"
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rent or buy *">
          <select
            value={form.dealType}
            onChange={(e) => set("dealType", e.target.value)}
            className={inputCls}
          >
            <option value="rent">For rent</option>
            <option value="buy">For sale</option>
          </select>
        </Field>
        <Field label="Property type *">
          <select
            value={form.propertyType}
            onChange={(e) => set("propertyType", e.target.value)}
            className={inputCls}
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Location *">
        <input
          required
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="Lekki Phase 1, Lagos"
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City">
          <input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Beds">
          <input
            value={form.beds}
            onChange={(e) => set("beds", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Baths">
          <input
            value={form.baths}
            onChange={(e) => set("baths", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Price (USD) *">
        <input
          required
          value={form.priceUsd}
          onChange={(e) => set("priceUsd", e.target.value)}
          placeholder={form.dealType === "rent" ? "1200 (per year)" : "85000"}
          className={inputCls}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Features (comma-separated)">
        <input
          value={form.features}
          onChange={(e) => set("features", e.target.value)}
          placeholder="POP, prepaid meter, gated"
          className={inputCls}
        />
      </Field>

      <Field label="Photo URL">
        <input
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>

      <Field label="Walkthrough video URL">
        <input
          value={form.videoUrl}
          onChange={(e) => set("videoUrl", e.target.value)}
          placeholder="https://youtube.com/..."
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Agent name *">
          <input
            required
            value={form.agentName}
            onChange={(e) => set("agentName", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Phone *">
          <input
            required
            value={form.agentPhone}
            onChange={(e) => set("agentPhone", e.target.value)}
            placeholder="+234..."
            className={inputCls}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            value={form.agentWhatsApp}
            onChange={(e) => set("agentWhatsApp", e.target.value)}
            placeholder="23480..."
            className={inputCls}
          />
        </Field>
      </div>

      {error ? <p className="text-[13px] text-red-400">{error}</p> : null}
      {done ? <p className="text-[13px] text-[#25D366]">{done}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit for admin review"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50";
