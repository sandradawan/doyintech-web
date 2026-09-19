"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { clearSession, loadSession, type StoreSession } from "@/lib/store/session";

const devLinks = [
  { href: "/store/dashboard", label: "Overview", exact: true },
  { href: "/store/dashboard/submit", label: "Submit app" },
  { href: "/store", label: "Public store" },
  { href: "/store/security", label: "Security policy" },
];

const adminLinks = [
  { href: "/store/admin", label: "Review queue", exact: true },
  { href: "/store/admin?tab=developers", label: "Developers" },
  { href: "/store", label: "Public store" },
];

export function DashboardShell({
  role,
  children,
}: {
  role: "admin" | "developer";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<StoreSession | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s || s.role !== role) {
      router.replace("/store/auth");
      return;
    }
    setSession(s);
  }, [role, router]);

  const links = role === "admin" ? adminLinks : devLinks;

  function logout() {
    clearSession();
    router.push("/store/auth");
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b12] text-[#94a3b8]">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm text-[#cbd5e1]"
        >
          Menu
        </button>
        <span className="text-sm font-semibold text-[#ff8c14]">DoyinStore</span>
        <button type="button" onClick={logout} className="text-sm text-[#94a3b8]">
          Log out
        </button>
      </div>

      <div className="mx-auto flex max-w-[1400px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#0c1220] transition lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-5">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
                DoyinStore
              </p>
              <h1 className="mt-1 text-lg font-semibold">
                {role === "admin" ? "Admin" : "Developer"}
              </h1>
              <p className="mt-1 truncate text-xs text-[#64748b]">{session.email}</p>
              {session.membershipStatus && role === "developer" && (
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    session.membershipStatus === "active"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-300"
                  }`}
                >
                  {session.membershipStatus}
                </span>
              )}
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              {links.map((l) => {
                const active = l.exact
                  ? pathname === l.href
                  : pathname.startsWith(l.href.split("?")[0]);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-[#ff8c14]/15 font-medium text-[#ff8c14]"
                        : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="mt-4 hidden rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm text-[#94a3b8] transition hover:border-white/20 hover:text-white lg:block"
            >
              Sign out
            </button>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-h-screen flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
