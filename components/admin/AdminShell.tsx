"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
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
      <Link href="/admin/login" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black">
        Go to admin login
      </Link>
    </div>
  );
}

type NavItem = { href: string; label: string; exact?: boolean };
type NavGroup = { label: string; items: NavItem[] };

/** Grouped by job to be done. Each table page lives at /admin/r/<table>. */
const NAV: NavGroup[] = [
  {
    label: "CRM",
    items: [
      { href: "/admin", label: "Overview", exact: true },
      { href: "/admin/pipeline", label: "Pipeline" },
      { href: "/admin/contacts", label: "Contacts" },
      { href: "/admin/r/site_leads", label: "Leads table" },
      { href: "/admin/r/crm_activities", label: "Activities & tasks" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/r/subscriptions", label: "Subscriptions" },
      { href: "/admin/r/payment_claims", label: "Payments ledger" },
      { href: "/admin/conversions", label: "Conversions" },
      { href: "/admin/pricing", label: "Pricing" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/admin/r/student_projects", label: "Student projects" },
      { href: "/admin/student-projects", label: "Student workflow" },
      { href: "/admin/r/report_orders", label: "Report orders" },
      { href: "/admin/r/report_products", label: "Report products" },
    ],
  },
  {
    label: "DoyinTech Store",
    items: [
      { href: "/admin/r/storefronts", label: "Seller shops" },
      { href: "/admin/r/storefront_orders", label: "Shop orders" },
      { href: "/admin/r/storefront_products", label: "Shop products" },
      { href: "/admin/r/storefront_discounts", label: "Discount codes" },
      { href: "/admin/r/storefront_payment_requests", label: "Payment links" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/r/email_subscribers", label: "Email subscribers" },
      { href: "/admin/r/site_events", label: "Tracking events" },
      { href: "/admin/content", label: "Content" },
      { href: "/admin/analytics", label: "Social analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/r/site_settings", label: "Site settings (JSON)" },
      { href: "/admin/r/admin_audit_log", label: "Audit log" },
      { href: "/admin/ops", label: "Ops" },
      { href: "/admin/tools", label: "AI & tools" },
    ],
  },
];

const ALL = NAV.flatMap((g) => g.items);

function navActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

/** Quick jump to a contact by name, email or phone. */
function QuickSearch({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  function go(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)
        ? `/admin/contacts?email=${encodeURIComponent(term.toLowerCase())}`
        : `/admin/contacts?q=${encodeURIComponent(term)}`
    );
    setQ("");
    onDone?.();
  }
  return (
    <form onSubmit={go} role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a contact…"
        aria-label="Find a contact"
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/60"
      />
    </form>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">{group.label}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = navActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`rounded-lg px-3 py-1.5 text-[13px] transition ${
                    active ? "bg-[#ff8c14]/12 font-semibold text-[#ffb366]" : "text-[#a1a1a6] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminSession();
  const [menu, setMenu] = useState(false);

  // Close the phone menu on navigation.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenu(false);
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (session.loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#05060a] text-[#a1a1a6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#ff8c14]" />
        <p className="text-[13px]">Verifying admin session…</p>
      </div>
    );
  }
  if (!session.authenticated || !session.isAdmin) return <AdminRedirect error={session.error} />;

  const current = ALL.filter((i) => navActive(pathname, i)).sort((a, b) => b.href.length - a.href.length)[0];
  const signOut = async () => {
    await session.signOut();
    router.replace("/admin/login");
  };

  const account = (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3">
      <p className="truncate text-[12px] font-medium text-white">{session.email}</p>
      <p className="mt-0.5 text-[11px] text-[#86868b]">Administrator · full access</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={signOut} className="flex-1 rounded-lg border border-white/10 py-1.5 text-[11px] font-medium text-[#a1a1a6] transition hover:border-white/25 hover:text-white">
          Sign out
        </button>
        <Link href="/" className="flex-1 rounded-lg border border-white/10 py-1.5 text-center text-[11px] font-medium text-[#a1a1a6] transition hover:border-white/25 hover:text-white">
          View site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05060a] text-[#f5f5f7]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/[0.07] bg-[#08090e] lg:flex">
        <div className="px-4 pb-3 pt-5">
          <Link href="/admin" className="block px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8c14]">DoyinTech</p>
            <p className="mt-0.5 text-[16px] font-semibold tracking-tight text-white">CRM</p>
          </Link>
          <div className="mt-4">
            <QuickSearch />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-white/[0.07] p-3">{account}</div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#05060a]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">DoyinTech CRM</p>
            <p className="truncate text-[15px] font-semibold text-white">{current?.label || "Admin"}</p>
          </div>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] text-white"
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
        {menu && (
          <div className="max-h-[calc(100vh-60px)] overflow-y-auto border-t border-white/[0.07] px-3 py-4">
            <QuickSearch onDone={() => setMenu(false)} />
            <div className="mt-4">
              <NavLinks pathname={pathname} onNavigate={() => setMenu(false)} />
            </div>
            <div className="mt-4">{account}</div>
          </div>
        )}
      </header>

      <div className="lg:pl-[240px]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
