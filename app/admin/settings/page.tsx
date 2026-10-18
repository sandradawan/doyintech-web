"use client";

import { useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Me = { ok?: boolean; email?: string | null; via?: string; allowlistConfigured?: boolean; error?: string };

export default function AdminSettingsPage() {
  const session = useAdminSession();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    async function run() {
      if (!session.accessToken) return;
      const res = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const json = await res.json().catch(() => ({}));
      setMe(json);
    }
    void run();
  }, [session.accessToken]);

  const checks = [
    { label: "Signed-in email", value: session.email || "—" },
    { label: "Admin allowlist", value: me?.allowlistConfigured ? "Configured" : "Missing ADMIN_EMAILS" },
    { label: "Auth path", value: me?.via || "session" },
    { label: "Session", value: session.authenticated ? "Active" : "None" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">System</p>
        <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Settings</h1>
        <p className="mt-1 text-[13px] text-[#86868b]">Admin access is email/password + ADMIN_EMAILS. Lead secret is not required in the UI.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{c.label}</p>
            <p className="mt-2 text-[15px] font-medium text-white">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#121214] p-5 text-[13px] leading-relaxed text-[#a1a1a6]">
        <p className="font-semibold text-white">Required Vercel env</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>ADMIN_EMAILS — your admin email(s), comma-separated</li>
          <li>NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>SUPABASE_SERVICE_ROLE_KEY — server reads for CRM data</li>
          <li>OPENAI_API_KEY — AI tools polish (optional but recommended)</li>
        </ul>
      </div>
    </div>
  );
}
