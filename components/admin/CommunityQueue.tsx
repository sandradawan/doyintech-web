"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin/client";

type Post = { id: number; display_name: string; topic: string; title: string; body: string };
type Reply = { id: number; display_name: string; body: string; community_posts: { title: string } | null };
type Report = { id: number; kind: "post" | "reply"; item_id: number; reason: string; text: string };
type Queue = { posts: Post[]; replies: Reply[]; reports: Report[] };

const card = "rounded-xl border border-white/10 bg-white/[0.03] p-4";
const yes = "min-h-10 rounded-full bg-[#ff8c14] px-4 text-[13px] font-semibold text-black";
const no = "min-h-10 rounded-full border border-white/20 px-4 text-[13px] font-semibold text-white";

export default function CommunityQueue() {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminApi<Queue>("/api/admin/community").then(setQueue).catch((e: Error) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function decide(kind: string, id: number, action: string) {
    setError("");
    try {
      await adminApi("/api/admin/community", { method: "POST", body: JSON.stringify({ kind, id, action }) });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't work.");
    }
  }

  if (error && !queue) return <p role="alert" className="text-[14px] text-red-300">{error}</p>;
  if (!queue) return <p className="text-[13px] text-brand-subtle">Loading…</p>;
  const empty = !queue.posts.length && !queue.replies.length && !queue.reports.length;

  return (
    <div className="space-y-8">
      <h1 className="text-[24px] font-semibold text-white">Community</h1>
      {error && <p role="alert" className="text-[14px] text-red-300">{error}</p>}
      {empty && <p className="text-[14px] text-brand-muted">Nothing is waiting for you.</p>}

      {queue.reports.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[16px] font-semibold text-white">Reported ({queue.reports.length})</h2>
          {queue.reports.map((r) => (
            <article key={r.id} className={card}>
              <p className="text-[13px] font-semibold text-red-300">Reason: {r.reason}</p>
              <p className="mt-2 whitespace-pre-line break-words text-[14px] text-brand-soft">{r.text}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => decide(r.kind, r.item_id, "reject")} className={yes}>Remove it</button>
                <button type="button" onClick={() => decide("report", r.id, "dismiss")} className={no}>Keep it</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {queue.posts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[16px] font-semibold text-white">Questions to approve ({queue.posts.length})</h2>
          {queue.posts.map((p) => (
            <article key={p.id} className={card}>
              <p className="text-[12px] text-brand-muted">{p.display_name} · {p.topic}</p>
              <h3 className="mt-1 text-[15px] font-semibold text-white">{p.title}</h3>
              <p className="mt-1 whitespace-pre-line break-words text-[14px] text-brand-soft">{p.body}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => decide("post", p.id, "approve")} className={yes}>Approve</button>
                <button type="button" onClick={() => decide("post", p.id, "reject")} className={no}>Reject</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {queue.replies.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[16px] font-semibold text-white">Replies to approve ({queue.replies.length})</h2>
          {queue.replies.map((r) => (
            <article key={r.id} className={card}>
              <p className="text-[12px] text-brand-muted">{r.display_name} · on &quot;{r.community_posts?.title}&quot;</p>
              <p className="mt-1 whitespace-pre-line break-words text-[14px] text-brand-soft">{r.body}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => decide("reply", r.id, "approve")} className={yes}>Approve</button>
                <button type="button" onClick={() => decide("reply", r.id, "reject")} className={no}>Reject</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
