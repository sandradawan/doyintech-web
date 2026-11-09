"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

export const fieldClass = "mt-1 min-h-12 w-full rounded-xl border border-white/15 bg-brand-deep px-3 text-[16px] text-white";

export function useSignedIn() {
  const [state, setState] = useState({ checking: isSupabaseConfigured(), email: null as string | null });

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setState({ checking: false, email: data.session?.user.email ?? null }));
    const sub = sb.auth.onAuthStateChange((_event, session) => setState({ checking: false, email: session?.user.email ?? null }));
    return () => sub.data.subscription.unsubscribe();
  }, []);

  return state;
}

/** Posts to a community API route as the signed-in member; throws the route's error message. */
export async function sendAsMember(path: string, body: unknown) {
  const { data } = (await getSupabaseBrowser()?.auth.getSession()) || { data: null };
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data?.session?.access_token ?? ""}` },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
}

/**
 * Emails a sign-in link. The link lands on /account, the address already allowed in Supabase,
 * and the account page sends the member back here.
 */
export default function SignIn({ prompt }: { prompt: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabaseBrowser();
    if (!sb) return setError("Sign-in isn't available right now.");
    setBusy(true);
    setError("");
    try {
      localStorage.setItem("dt-after-login", window.location.pathname);
    } catch {
      /* they'll land on their account page instead */
    }
    const { error: err } = await sb.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/account` } });
    setBusy(false);
    if (err) return setError(err.message);
    setSent(true);
  }

  if (sent) return <p role="status" className="text-[15px] text-white">Check your email and open the sign-in link on this device. It brings you back here.</p>;

  return (
    <form onSubmit={submit}>
      <label className="block text-[14px] font-semibold text-white">
        {prompt}
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={fieldClass} />
      </label>
      {error && <p role="alert" className="mt-2 text-[14px] text-red-300">{error}</p>}
      <button type="submit" disabled={busy} className="mt-3 min-h-12 rounded-full bg-[#ff8c14] px-6 text-[15px] font-semibold text-black disabled:opacity-60">{busy ? "Sending…" : "Email me a sign-in link"}</button>
    </form>
  );
}
