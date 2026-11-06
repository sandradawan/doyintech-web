"use client";

import { useState } from "react";
import Link from "next/link";
import { postPath, shortDate, TOPICS, type PublicPost } from "@/lib/community/rules";

export default function PostList({ posts }: { posts: PublicPost[] }) {
  const [topic, setTopic] = useState("All");
  const shown = topic === "All" ? posts : posts.filter((p) => p.topic === topic);
  const chip = (t: string) => `min-h-11 shrink-0 rounded-full border px-4 text-[14px] font-semibold ${t === topic ? "border-[#ff8c14] bg-[#ff8c14] text-black" : "border-white/15 text-white"}`;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        {["All", ...TOPICS].map((t) => (
          <button key={t} type="button" aria-pressed={t === topic} onClick={() => setTopic(t)} className={chip(t)}>{t}</button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="mt-5 text-[15px] text-[#c7cdd8]">No questions here yet. Be the first to ask.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {shown.map((p) => (
            <li key={p.id}>
              <Link href={postPath(p)} className="block rounded-2xl border border-white/10 bg-[#141a28] p-4 hover:border-[#ff8c14]">
                <span className="text-[13px] font-semibold text-[#ffb366]">{p.topic}</span>
                <span className="mt-0.5 block text-[17px] font-semibold leading-snug text-white">{p.title}</span>
                <span className="mt-1 line-clamp-2 block text-[14px] text-[#c7cdd8]">{p.body}</span>
                <span className="mt-2 block text-[13px] text-[#a1a1a6]">{p.display_name} · {shortDate(p.created_at)} · {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
