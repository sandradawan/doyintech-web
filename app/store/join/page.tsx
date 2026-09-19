"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";

type Mode = "developer" | "member";

export default function StoreJoinPage() {
  const [mode, setMode] = useState<Mode>("developer");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  const field =
    "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    if (mode === "developer") {
      body.agreedTerms = fd.get("agreedTerms") === "on" ? true : false;
    }

    try {
      const path =
        mode === "developer"
          ? "/api/store/register-developer"
          : "/api/store/register-member";
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage(data.message || "Registered.");
      e.currentTarget.reset();
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[640px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                Membership
              </p>
              <h1 className="mt-2 text-[32px] font-semibold text-white">Join DoyinStore</h1>
              <p className="mt-2 text-[14px] text-[#a1a1a6]">
                Register as a developer to publish, or as a member for purchases and updates.
              </p>
            </div>
            <StoreNav />
          </div>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("developer")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                mode === "developer"
                  ? "bg-[#ff8c14] text-black"
                  : "border border-white/15 text-[#a1a1a6]"
              }`}
            >
              Developer
            </button>
            <button
              type="button"
              onClick={() => setMode("member")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                mode === "member"
                  ? "bg-[#ff8c14] text-black"
                  : "border border-white/15 text-[#a1a1a6]"
              }`}
            >
              Buyer / member
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-6"
          >
            {mode === "developer" ? (
              <>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Display name *
                  <input name="displayName" required className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Email *
                  <input name="email" type="email" required className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Phone
                  <input name="phone" className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Company / studio
                  <input name="companyName" className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Website
                  <input name="website" type="url" className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Short bio
                  <textarea name="bio" rows={3} className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Country
                  <input name="country" defaultValue="NG" className={`mt-1 ${field}`} />
                </label>
                <label className="flex items-start gap-2 text-[13px] text-[#c7cdd8]">
                  <input name="agreedTerms" type="checkbox" required className="mt-1" />
                  <span>
                    I agree to DoyinStore developer terms: no malware, honest metadata, security
                    review before publish, and responsible updates.
                  </span>
                </label>
              </>
            ) : (
              <>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Display name
                  <input name="displayName" className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Email *
                  <input name="email" type="email" required className={`mt-1 ${field}`} />
                </label>
                <label className="block text-[12px] text-[#a1a1a6]">
                  Phone
                  <input name="phone" className={`mt-1 ${field}`} />
                </label>
                <p className="text-[12px] text-[#86868b]">
                  Use this email when buying apps so we can match your downloads.
                </p>
              </>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black disabled:opacity-60"
            >
              {status === "loading"
                ? "Saving…"
                : mode === "developer"
                  ? "Apply as developer"
                  : "Join as member"}
            </button>

            {message && (
              <p
                className={`text-sm ${
                  status === "ok" ? "text-emerald-400" : status === "err" ? "text-red-400" : ""
                }`}
              >
                {message}
              </p>
            )}

            {mode === "developer" && status === "ok" && (
              <Link href="/store/developer" className="block text-center text-sm text-[#ff8c14]">
                Continue to publish →
              </Link>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
