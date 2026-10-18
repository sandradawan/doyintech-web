"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

function AdminRedirect({ error }: { error: string | null }) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#05060a] px-6 text-center">
      <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#ff8c14]/20" />
      <p className="text-[15px] text-[#a1a1a6]">{error || "Admin sign-in required"}</p>
      <Link
        href="/admin/login"
        className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
      >
        Go to admin login
      </Link>
    </div>
  );
}

const NAV = [
  { href: "/admin", label: "Overview", exact: true, icon: "◈" },
  { href: "/admin/leads", label: "Leads", exact: false, icon: "◎" },
  { href: "/admin/student-projects", label: "Students", exact: false, icon: "◇" },
  { href: "/admin/analytics", label: "Analytics", exact: false, icon: "▣" },
];

function navActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminSession();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  if (session.loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#05060a] text-[#a1a1a6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#ff8c14]" />
        <p className="text-[13px]">Verifying admin session…</p>
      </div>
    );
  }

  if (!session.authenticated || !session.isAdmin) {
    return <AdminRedirect error={session.error} />;
  }

  const pageTitle =
    NAV.find((n) => navActive(pathname, n.href, n.exact))?.label || "Admin";

  return (
    <div className="min-h-screen bg-[#05060a] text-[#f5f5f7]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/[0.07] bg-[#0a0b10] lg:flex">
        <div className="border-b border-white/[0.07] px-5 py-5">
          <Link href="/admin" className="block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8c14]">
              DoyinTech
            </p>
            <p className="mt-1 font-display text-[17px] font-semibold tracking-tight text-white">
              Command center
            </p>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  active
                    ? "bg-[#ff8c14]/12 text-[#ff8c14] ring-1 ring-[#ff8c14]/25"
                    : "text-[#a1a1a6] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-[14px] opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/[0.07] p-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3">
            <p className="truncate text-[12px] font-medium text-white">{session.email}</p>
            <p className="mt-0.5 text-[11px] text-[#86868b]">Administrator</p>
            <button
              type="button"
              onClick={async () => {
                await session.signOut();
                router.replace("/admin/login");
              }}
              className="mt-3 w-full rounded-lg border border-white/10 py-1.5 text-[11px] font-medium text-[#a1a1a6] transition hover:border-white/25 hover:text-white"
            >
              Sign out
            </button>
          </div>
          <Link href="/" className="mt-3 block text-center text-[11px] text-[#86868b] hover:text-[#2997ff]">
            ← Public site
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#05060a]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Admin</p>
            <p className="font-display text-[15px] font-semibold text-white">{pageTitle}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await session.signOut();
              router.replace("/admin/login");
            }}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white"
          >
            Sign out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium ${
                  active ? "bg-[#ff8c14]/15 text-[#ff8c14]" : "bg-white/[0.04] text-[#a1a1a6]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="lg:pl-[240px]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}

export { useAdminSession };
