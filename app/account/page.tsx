"use client";

import { Suspense, useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { getPlan } from "@/lib/subscriptions/plans";
import SavedTools from "@/components/account/SavedTools";

type Membership = {
  planId: string;
  name: string;
  status: string;
  nextPaymentDate: string | null;
  manageable: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  "non-renewing": "Cancelled — access until period ends",
  attention: "Payment failed — update your card",
};

function AccountInner() {
  const params = useSearchParams();
  const justSubscribed = params.get("subscribed");
  const subscribedPlan = justSubscribed ? getPlan(justSubscribed) : undefined;

  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setChecking(false);
      return;
    }
    const { data } = await sb.auth.getSession();
    const session = data.session;
    setEmail(session?.user.email || null);
    if (session) {
      // Sign-in links always land here; go back to the page that asked for the sign-in.
      try {
        const back = localStorage.getItem("dt-after-login");
        localStorage.removeItem("dt-after-login");
        if (back && /^\/(?!\/)/.test(back)) return window.location.replace(back);
      } catch {
        /* stay on the account page */
      }
      const res = await fetch("/api/subscriptions/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setMemberships(json.subscriptions || []);
      }
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    load();
    const sb = getSupabaseBrowser();
    const sub = sb?.auth.onAuthStateChange(() => {
      load();
    });
    return () => sub?.data.subscription.unsubscribe();
  }, [load]);

  async function sendLink(e: FormEvent) {
    e.preventDefault();
    setError("");
    const sb = getSupabaseBrowser();
    if (!sb) return setError("Sign-in is not configured.");
    setBusy("login");
    const { error: err } = await sb.auth.signInWithOtp({
      email: loginEmail.trim(),
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    setBusy("");
    if (err) return setError(err.message);
    setLinkSent(true);
  }

  async function manage(planId: string) {
    setBusy(planId);
    setError("");
    try {
      const { data } = (await getSupabaseBrowser()?.auth.getSession()) || { data: null };
      const res = await fetch("/api/subscriptions/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session?.access_token || ""}`,
        },
        body: JSON.stringify({ planId }),
      });
      const json = await res.json();
      if (!res.ok || !json.link) throw new Error(json.error || "Could not open billing");
      window.location.href = json.link;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open billing");
      setBusy("");
    }
  }

  async function signOut() {
    await getSupabaseBrowser()?.auth.signOut();
    setEmail(null);
    setMemberships([]);
  }

  return (
    <main className="min-h-screen bg-brand-deep px-6 pb-24 pt-28">
      <div className="mx-auto max-w-[560px]">
        <h1 className="text-[30px] font-semibold tracking-tight text-brand-ink">Your account</h1>

        {subscribedPlan && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-[14px] text-emerald-200">
            Thanks for subscribing to <strong>{subscribedPlan.name}</strong>. It can take a minute
            for Paystack to confirm.
            {!email && " Sign in below with the email you paid with to use your membership."}
          </div>
        )}

        {checking ? (
          <p className="mt-8 text-[14px] text-brand-subtle">Loading…</p>
        ) : !email ? (
          <form onSubmit={sendLink} className="mt-8 rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
            <p className="text-[15px] font-semibold text-brand-ink">Sign in with your email</p>
            <p className="mt-1 text-[13px] text-brand-muted">
              We&apos;ll email you a one-time sign-in link. No password needed.
            </p>
            {linkSent ? (
              <p className="mt-4 text-[14px] text-emerald-300">
                Check your inbox for the sign-in link (and your spam folder).
              </p>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email"
                  className="mt-4 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-link"
                />
                <button
                  type="submit"
                  disabled={busy === "login"}
                  className="mt-3 w-full rounded-full bg-brand-accent py-3 text-[14px] font-semibold text-black disabled:opacity-60"
                >
                  {busy === "login" ? "Sending…" : "Email me a sign-in link"}
                </button>
              </>
            )}
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <p className="text-[14px] text-brand-muted">
              Signed in as <span className="text-brand-ink">{email}</span> ·{" "}
              <button type="button" onClick={signOut} className="text-brand-link hover:underline">
                Sign out
              </button>
            </p>

            {memberships.length === 0 ? (
              <div className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
                <p className="text-[15px] text-brand-ink">No active memberships on this email yet.</p>
                <p className="mt-1 text-[13px] text-brand-muted">
                  Just paid? Confirmation can take a minute; refresh shortly.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[14px]">
                  <Link href="/pro" className="text-brand-link hover:underline">
                    DoyinTech Pro
                  </Link>
                  <Link href="/care-plans" className="text-brand-link hover:underline">
                    Website care plans
                  </Link>
                </div>
              </div>
            ) : (
              memberships.map((m) => (
                <div key={m.planId} className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-brand-ink">{m.name}</p>
                      <p className="mt-1 text-[13px] text-brand-muted">
                        {STATUS_LABEL[m.status] || m.status}
                        {m.nextPaymentDate &&
                          ` · ${m.status === "non-renewing" ? "ends" : "renews"} ${new Date(
                            m.nextPaymentDate
                          ).toLocaleDateString()}`}
                      </p>
                    </div>
                    {m.manageable && (
                      <button
                        type="button"
                        onClick={() => manage(m.planId)}
                        disabled={busy === m.planId}
                        className="shrink-0 rounded-full border border-brand-ink/20 px-4 py-2 text-[12px] font-semibold text-brand-ink hover:border-brand-link/60 disabled:opacity-60"
                      >
                        {busy === m.planId ? "Opening…" : "Manage billing"}
                      </button>
                    )}
                  </div>
                  {getPlan(m.planId)?.family === "pro" && (
                    <p className="mt-3 text-[13px] text-emerald-300">
                      Premium tools unlock automatically while you&apos;re signed in.{" "}
                      <Link href="/tools" className="text-brand-link hover:underline">
                        Open tools
                      </Link>
                    </p>
                  )}
                </div>
              ))
            )}
            <SavedTools />
          </div>
        )}

        {error && <p className="mt-4 text-[13px] text-red-400">{error}</p>}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <>
      <Suspense fallback={<main className="min-h-screen bg-brand-deep pt-28" />}>
        <AccountInner />
      </Suspense>
      <Footer />
    </>
  );
}
