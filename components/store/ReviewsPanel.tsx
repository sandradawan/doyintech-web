"use client";

import { useCallback, useEffect, useState } from "react";
import { trackStoreEvent } from "@/lib/store/analytics";

type Review = {
  id: string;
  rating: number;
  body: string | null;
  reviewerName: string;
  createdAt?: string;
};

export function ReviewsPanel({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/store/reviews?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/store/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email, name, rating, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg("Thanks — your review was saved.");
      setBody("");
      trackStoreEvent("review_submit", { slug, rating });
      void load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <h2 className="text-lg font-semibold text-white">Reviews</h2>

      {loading ? (
        <p className="mt-4 text-sm text-[#64748b]">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-sm text-[#64748b]">No reviews yet. Be the first.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <span className="text-[#ff8c14]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className="text-sm font-medium text-white">{r.reviewerName}</span>
                {r.createdAt && (
                  <span className="text-xs text-[#64748b]">{r.createdAt}</span>
                )}
              </div>
              {r.body && <p className="mt-2 text-sm text-[#cbd5e1]">{r.body}</p>}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-white/10 bg-[#0c1220] p-5">
        <p className="text-sm font-medium text-white">Write a review</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name (optional)"
            className="rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          />
        </div>
        <label className="mt-3 block text-xs text-[#94a3b8]">
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="What did you like?"
          className="mt-3 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Submit review"}
        </button>
        {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      </form>
    </section>
  );
}
