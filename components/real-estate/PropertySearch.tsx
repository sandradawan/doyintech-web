"use client";

import { useEffect, useState } from "react";
import {
  PROPERTY_TYPES,
  formatListingPrice,
  whatsappListingLink,
  type PropertyListing,
} from "@/lib/real-estate/listings";

export default function PropertySearch() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("any");
  const [deal, setDeal] = useState("any");
  const [beds, setBeds] = useState("0");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PropertyListing[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const q = new URLSearchParams({
        location,
        type,
        deal,
        beds,
      });
      const res = await fetch(`/api/real-estate/search?${q.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runSearch();
    // initial load shows all
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10">
      <form
        onSubmit={runSearch}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block lg:col-span-2">
            <span className="text-[12px] font-medium text-[#a1a1a6]">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos, Lekki, Abuja, Jos"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-[#a1a1a6]">House type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-[#a1a1a6]">Rent or buy</span>
            <select
              value={deal}
              onChange={(e) => setDeal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
            >
              <option value="any">Any</option>
              <option value="rent">For rent</option>
              <option value="buy">For sale</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-[#a1a1a6]">Min beds</span>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
            >
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {loading ? "Searching..." : "Search homes"}
        </button>
        {error ? <p className="mt-3 text-[13px] text-red-400">{error}</p> : null}
      </form>

      {searched && (
        <p className="mt-6 text-[13px] text-[#a1a1a6]">
          {results.length} listing{results.length === 1 ? "" : "s"} found
          {location ? ` near "${location}"` : ""}
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {results.map((l) => (
          <article
            key={l.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          >
            <div className="relative aspect-[16/10] bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l.imageUrl}
                alt={l.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    l.dealType === "rent"
                      ? "bg-[#2997ff] text-white"
                      : "bg-[#25D366] text-white"
                  }`}
                >
                  {l.dealType === "rent" ? "For rent" : "For sale"}
                </span>
                {l.verified ? (
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
                    Verified
                  </span>
                ) : null}
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1.5 text-[14px] font-semibold text-white">
                {formatListingPrice(l)}
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-[17px] font-semibold text-white">{l.title}</h2>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">
                {l.location} · {l.beds > 0 ? `${l.beds} bed` : "Commercial"}
                {l.baths ? ` · ${l.baths} bath` : ""}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#d1d5db]">{l.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {l.features.slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#a1a1a6]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={whatsappListingLink(l)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold text-white sm:flex-none"
                >
                  WhatsApp agent
                </a>
                <a
                  href={`tel:${l.agentPhone}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-[13px] font-semibold text-white"
                >
                  Call
                </a>
                {l.videoUrl ? (
                  <a
                    href={l.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[#ff8c14]/40 px-4 py-2.5 text-[13px] font-semibold text-[#ff8c14]"
                  >
                    Walkthrough video
                  </a>
                ) : null}
              </div>
              <p className="mt-3 text-[12px] text-[#6b7280]">
                Agent: {l.agentName} · {l.agentPhone}
              </p>
            </div>
          </article>
        ))}
      </div>

      {searched && results.length === 0 ? (
        <p className="mt-8 text-center text-[14px] text-[#a1a1a6]">
          No homes match those filters. Try a broader location (e.g. Lagos) or clear the type.
        </p>
      ) : null}
    </div>
  );
}
