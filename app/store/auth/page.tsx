"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { saveSession } from "@/lib/store/session";

type Mode = "login" | "register";

export default function StoreAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const field =
    "w-full rounded-xl border border-white/12 bg-[#0a0f1a] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#ff8c14]/60 focus:ring-1 focus:ring-[#ff8c14]/30 placeholder:text-white/20";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | boolean> = { action: mode };
    fd.forEach((v, k) => {
      if (typeof v === "string") body[k] = v;
    });
    if (mode === "register") {
      body.agreedTerms = fd.get("agreedTerms") === "on";
      const pass = String(body.password || "");
      const confirm = String(body.passwordConfirm || "");
      if (pass !== confirm) {
        setStatus("err");
        setMessage("Passwords do not match.");
        return;
      }
      delete body.passwordConfirm;
    }

    try {
      const res = await fetch("/api/store/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      if (data.session) {
        saveSession(data.session);
      }
      setStatus("ok");
      setMessage(data.message || "Success");

      if (data.role === "admin") {
        router.push("/store/admin");
      } else {
        router.push("/store/dashboard");
      }
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-24 pb-24">
        <div className="mx-auto max-w-[480px] px-6">
          <div className="mb-8 text-center">
            <Link
              href="/store"
              className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]"
            >
              DoyinStore
            </Link>
            <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">
              {mode === "login" ? "Sign in" : "Register as developer"}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#94a3b8]">
              {mode === "login"
                ? "Sign in with your email and password. Admins use the staff password."
                : "Create an account with a strong password. Admin approval is required before publishing."}
            </p>
          </div>

          <div className="mb-6 flex rounded-full border border-white/10 bg-[#0c1220] p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setMessage("");
                  setStatus("idle");
                }}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                  mode === m
                    ? "bg-[#ff8c14] text-black shadow-sm"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-white/10 bg-[#0c1220] p-6 shadow-xl shadow-black/40"
            autoComplete={mode === "login" ? "on" : "off"}
          >
            {mode === "register" && (
              <label className="block text-[12px] font-medium text-[#94a3b8]">
                Full name / studio name *
                <input
                  name="displayName"
                  required
                  autoComplete="name"
                  placeholder="e.g. Ada Studios"
                  className={`mt-1.5 ${field}`}
                />
              </label>
            )}

            <label className="block text-[12px] font-medium text-[#94a3b8]">
              Email *
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className={`mt-1.5 ${field}`}
              />
            </label>

            <label className="block text-[12px] font-medium text-[#94a3b8]">
              Password *
              <div className="relative mt-1.5">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "login" ? "Your password" : "Min 8 chars, letters + numbers"}
                  className={`${field} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#64748b] hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {mode === "register" && (
              <>
                <label className="block text-[12px] font-medium text-[#94a3b8]">
                  Confirm password *
                  <input
                    name="passwordConfirm"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className={`mt-1.5 ${field}`}
                  />
                </label>
                <label className="block text-[12px] font-medium text-[#94a3b8]">
                  Website / portfolio
                  <input
                    name="website"
                    type="url"
                    placeholder="https://"
                    className={`mt-1.5 ${field}`}
                  />
                </label>
                <label className="block text-[12px] font-medium text-[#94a3b8]">
                  Company (optional)
                  <input name="companyName" placeholder="Optional" className={`mt-1.5 ${field}`} />
                </label>
                <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#cbd5e1]">
                  <input
                    name="agreedTerms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-[#0a0f1a] text-[#ff8c14] focus:ring-[#ff8c14]/40"
                  />
                  <span>
                    I agree to DoyinStore terms: accurate metadata, no malware, security review
                    before publish, and responsible updates.
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black shadow-lg shadow-[#ff8c14]/15 transition hover:bg-[#ffa03a] disabled:opacity-60"
            >
              {status === "loading"
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>

            {message && (
              <p
                className={`text-center text-sm ${
                  status === "ok" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-[#64748b]">
            <strong className="text-[#94a3b8]">Security:</strong> Passwords are hashed with scrypt.
            Sessions are signed. Never share your password. Staff sign in with the admin staff
            password configured on the server.
          </div>

          <div className="mt-6 space-y-2 text-center text-[13px] text-[#64748b]">
            <p>
              {mode === "login" ? (
                <>
                  New developer?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-medium text-[#ff8c14] hover:underline"
                  >
                    Register free
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-medium text-[#ff8c14] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
            <p>
              <Link href="/store" className="text-[#94a3b8] hover:text-white hover:underline">
                ← Back to store
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
