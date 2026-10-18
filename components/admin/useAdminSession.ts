"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type AdminSessionState = {
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  accessToken: string | null;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  authHeaders: () => HeadersInit;
};

export function useAdminSession(): AdminSessionState {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const sb = getSupabaseBrowser();
    if (!sb) {
      setAuthenticated(false);
      setIsAdmin(false);
      setEmail(null);
      setAccessToken(null);
      setError("Supabase is not configured");
      setLoading(false);
      return;
    }

    const { data } = await sb.auth.getSession();
    const session = data.session;
    if (!session?.access_token) {
      setAuthenticated(false);
      setIsAdmin(false);
      setEmail(null);
      setAccessToken(null);
      setLoading(false);
      return;
    }

    setAuthenticated(true);
    setAccessToken(session.access_token);
    setEmail(session.user.email ?? null);

    try {
      const res = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setIsAdmin(false);
        setError(json.error || "Not authorized as admin");
      } else {
        setIsAdmin(true);
        setError(null);
      }
    } catch {
      setIsAdmin(false);
      setError("Could not verify admin access");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    setAuthenticated(false);
    setIsAdmin(false);
    setEmail(null);
    setAccessToken(null);
  }, []);

  const authHeaders = useCallback((): HeadersInit => {
    if (!accessToken) return {};
    return { Authorization: `Bearer ${accessToken}` };
  }, [accessToken]);

  return {
    loading,
    authenticated,
    isAdmin,
    email,
    accessToken,
    error,
    refresh,
    signOut,
    authHeaders,
  };
}
