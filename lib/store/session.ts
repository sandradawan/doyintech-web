/** Client-side store session (localStorage). Role from server login. */

export type StoreRole = "admin" | "developer";

export type StoreSession = {
  email: string;
  role: StoreRole;
  displayName: string;
  developerId?: string;
  membershipStatus?: string;
  loggedInAt: string;
};

const KEY = "doyinstore_session_v1";

export function saveSession(s: StoreSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function loadSession(): StoreSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as StoreSession;
    if (!s?.email || !s?.role) return null;
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
