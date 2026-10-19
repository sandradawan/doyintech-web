"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Floating tip when the browser goes offline — invites users to play Signal Runner. */
export default function OfflinePlayHint() {
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[90] mx-auto max-w-md rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-4 shadow-xl shadow-cyan-500/20 backdrop-blur md:left-auto md:right-6">
      <p className="text-sm font-semibold text-white">Network issue detected</p>
      <p className="mt-1 text-xs text-gray-400">
        Stay on the site — play Signal Runner while you wait for the connection.
      </p>
      <div className="mt-3 flex gap-2">
        <Link
          href="/play"
          className="rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950"
        >
          Play game
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
