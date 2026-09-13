"use client";

import { useState } from "react";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";
import { APP_PACKAGE_HINTS } from "@/lib/store/types";

export default function DeveloperPublishPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("android");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/store/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage(data.message);
      e.currentTarget.reset();
    } catch (err: any) {
      setStatus("err");
      setMessage(err.message || "Error");
    }
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                Developers
              </p>
              <h1 className="mt-2 text-[32px] font-semibold text-white">Publish to DoyinStore</h1>
              <p className="mt-2 text-[14px] text-[#a1a1a6]">
                Submit your app or digital product. Nothing goes public until security scan + human
                review pass.
              </p>
            </div>
            <StoreNav />
          </div>

          <div className="mb-6 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-4 text-[13px] leading-relaxed text-[#ffe0b8]">
            <strong>Android:</strong> Upload <strong>APK</strong> only — AAB is not installable by
            users outside Google Play. Desktop: signed installer preferred.
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-6">
            <label className="block text-[12px] text-[#a1a1a6]">
              Title
              <input name="title" required className={`mt-1 ${field}`} />
            </label>
            <label className="block text-[12px] text-[#a1a1a6]">
              Short description
              <input name="shortDescription" required maxLength={120} className={`mt-1 ${field}`} />
            </label>
            <label className="block text-[12px] text-[#a1a1a6]">
              Full description
              <textarea name="description" required rows={5} className={`mt-1 ${field}`} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[12px] text-[#a1a1a6]">
                Developer name
                <input name="developerName" required className={`mt-1 ${field}`} />
              </label>
              <label className="block text-[12px] text-[#a1a1a6]">
                Developer email
                <input name="developerEmail" type="email" required className={`mt-1 ${field}`} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[12px] text-[#a1a1a6]">
                Type
                <select name="kind" className={`mt-1 ${field}`}>
                  <option value="app">App (mobile/desktop)</option>
                  <option value="digital_product">Digital product</option>
                </select>
              </label>
              <label className="block text-[12px] text-[#a1a1a6]">
                Platform
                <select
                  name="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={`mt-1 ${field}`}
                >
                  <option value="android">Android</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="web">Web</option>
                  <option value="digital">Digital file</option>
                </select>
              </label>
            </div>
            <p className="text-[12px] text-[#86868b]">
              {APP_PACKAGE_HINTS[platform as keyof typeof APP_PACKAGE_HINTS]}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[12px] text-[#a1a1a6]">
                Price (NGN, 0 = free)
                <input name="priceNgn" type="number" min={0} defaultValue={0} className={`mt-1 ${field}`} />
              </label>
              <label className="block text-[12px] text-[#a1a1a6]">
                Version
                <input name="version" defaultValue="1.0.0" className={`mt-1 ${field}`} />
              </label>
            </div>
            <label className="block text-[12px] text-[#a1a1a6]">
              Category
              <input name="category" defaultValue="Business" className={`mt-1 ${field}`} />
            </label>
            <label className="block text-[12px] text-[#a1a1a6]">
              Package type
              <select name="packageType" className={`mt-1 ${field}`}>
                <option value="apk">APK (Android)</option>
                <option value="exe">EXE / MSI (Windows)</option>
                <option value="dmg">DMG (macOS)</option>
                <option value="deb">DEB / AppImage</option>
                <option value="zip">ZIP</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block text-[12px] text-[#a1a1a6]">
              Binary file name (upload hosting in phase 2 — declare name now)
              <input name="fileName" placeholder="my-app-release.apk" className={`mt-1 ${field}`} />
            </label>
            <label className="block text-[12px] text-[#a1a1a6]">
              Privacy policy URL (recommended)
              <input name="privacyPolicyUrl" type="url" className={`mt-1 ${field}`} />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-60"
            >
              {status === "loading" ? "Submitting…" : "Submit for security review"}
            </button>
            {message && (
              <p className={`text-[13px] ${status === "err" ? "text-red-400" : "text-emerald-400"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
