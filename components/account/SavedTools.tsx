"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SAVED_TOOL_PAGES } from "@/lib/tools/cloud-save";

type Saved = { tool: string; updated_at: string };

/** Signed-in account: tools whose work is saved to the account, newest first, plus the get-paid shortcut. */
export default function SavedTools() {
  const [saved, setSaved] = useState<Saved[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sb = getSupabaseBrowser();
      const { data } = sb ? await sb.auth.getSession() : { data: { session: null } };
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch("/api/tools/saved", { headers: { Authorization: `Bearer ${token}` } });
      const json = res.ok ? await res.json() : { tools: [] };
      if (!cancelled) setSaved(json.tools || []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
        <p className="text-[16px] font-semibold text-white">Your saved tools</p>
        {saved === null ? (
          <p className="mt-2 text-[13px] text-[#a1a1a6]">Loading…</p>
        ) : saved.length === 0 ? (
          <p className="mt-2 text-[13px] text-[#a1a1a6]">
            Nothing saved yet. Use any business tool while signed in (cash flow forecast, staff cost, bid evaluation…) and your work is kept here on every device.{" "}
            <Link href="/business-solutions" className="text-[#ff8c14] hover:underline">Find a tool</Link>
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5">
            {saved.map((s) => {
              const page = SAVED_TOOL_PAGES[s.tool];
              return (
                <li key={s.tool} className="flex min-h-11 items-center justify-between gap-3 py-2 text-[14px]">
                  {page ? <Link href={page.href} className="text-white hover:text-[#ff8c14]">{page.title}</Link> : <span className="text-white">{s.tool}</span>}
                  <span className="text-[12px] text-[#8b919c]">{new Date(s.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="rounded-2xl border border-[#3ddc97]/30 bg-[#3ddc97]/5 p-5">
        <p className="text-[16px] font-semibold text-white">Get paid online</p>
        <p className="mt-1 text-[13px] text-[#c7cdd8]">Turn invoices into Pay now links that settle to your bank, with automatic reminders.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-[14px]">
          <Link href="/tools/invoice-generator-nigeria" className="text-[#3ddc97] hover:underline">Make an invoice</Link>
          <Link href="/stores/dashboard" className="text-[#3ddc97] hover:underline">Payments dashboard</Link>
        </div>
      </div>
    </div>
  );
}
