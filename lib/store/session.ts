/** Client-side store session (localStorage) + signed token from server. */

export type StoreRole = "admin" | "developer";

export type StoreSession = {
  email: string;
  role: StoreRole;
  displayName: string;
  developerId?: string;
  membershipStatus?: string;
  loggedInAt: string;
  /** HMAC-signed token — required for authenticated API calls */
  token?: string;
};

const KEY = "doyinstore_session_v2";
const LEGACY_KEY = "doyinstore_session_v1";

export function saveSession(s: StoreSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  localStorage.removeItem(LEGACY_KEY);
}

export function loadSession(): StoreSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as StoreSession;
    if (!s?.email || !s?.role) return null;
    if (!s.token) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(LEGACY_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function authHeaders(): HeadersInit {
  const s = loadSession();
  if (!s?.token) return {};
  return {
    Authorization: `Bearer ${s.token}`,
    "x-store-session": s.token,
  };
}
