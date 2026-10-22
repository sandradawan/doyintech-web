"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/admin/client";
import { ActivityTimeline } from "@/components/admin/crm/RecordDrawer";
import { Badge, ErrorNote, PageHeader, Spinner, btn, formatDate, inputCls, naira, panel, relativeTime } from "@/components/admin/crm/ui";

type Person = { email: string; name: string | null; detail: string | null };
type R = Record<string, unknown>;
type Contact = {
  email: string;
  name: string | null;
  phone: string | null;
  company: string | null;
  productSpendKobo: number;
  leads: R[];
  subscriber: R | null;
  subscriptions: R[];
  payments: R[];
  reports: R[];
  students: R[];
  shops: R[];
  shopOrders: R[];
};

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

/** Search people, then see everything about one person across the site on a single page. */
export default function ContactView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [q, setQ] = useState(params.get("q") || "");
  const [people, setPeople] = useState<Person[]>([]);
  const [searching, setSearching] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (email) return;
    const term = q.trim();
    if (term.length < 2) return;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await adminApi<{ people: Person[] }>(`/api/admin/crm/contact?q=${encodeURIComponent(term)}`);
        setPeople(data.people);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, email]);

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      setContact(await adminApi<Contact>(`/api/admin/crm/contact?email=${encodeURIComponent(email)}`));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load contact");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
     
    void load();
  }, [load]);

  function open(e: string) {
    router.push(`${pathname}?email=${encodeURIComponent(e)}`);
  }

  if (!email) {
    return (
      <div>
        <PageHeader eyebrow="CRM" title="Contacts" description="Search by name, email, phone or company to see someone's full history: enquiries, purchases, subscriptions, shops and notes." />
        <div className="relative max-w-xl">
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q.trim())) open(q.trim().toLowerCase());
            }}
            placeholder="Name, email, phone or company"
            aria-label="Search contacts"
            className={`${inputCls} !py-3 !text-[15px]`}
          />
          {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner /></span>}
        </div>
        {error && <div className="mt-3"><ErrorNote message={error} /></div>}
        {q.trim().length >= 2 && people.length > 0 && (
          <ul className={`${panel} mt-4 max-w-xl divide-y divide-white/[0.05]`}>
            {people.map((p) => (
              <li key={p.email}>
                <button type="button" onClick={() => open(p.email)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03]">
                  <Avatar name={p.name || p.email} />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium text-white">{p.name || p.email}</span>
                    <span className="block truncate text-[12px] text-[#86868b]">
                      {p.email}
                      {p.detail ? ` · ${p.detail}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {q.trim().length >= 2 && !searching && people.length === 0 && (
          <p className="mt-4 text-[13px] text-[#86868b]">No matches. Press Enter on a full email address to open it anyway.</p>
        )}
      </div>
    );
  }

  const c = contact;
  const lastLead = c?.leads[0];
  const phone = s(c?.phone).replace(/\D/g, "").replace(/^0/, "234");

  return (
    <div>
      <Link href={pathname} className="text-[13px] text-[#8ab4ff] hover:underline">
        ← All contacts
      </Link>
      {loading && !c && <p className="mt-6 text-[13px] text-[#86868b]">Loading…</p>}
      {error && <div className="mt-4"><ErrorNote message={error} /></div>}
      {c && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Avatar name={c.name || c.email} large />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[24px] font-semibold tracking-tight text-white">{c.name || c.email}</h1>
              <p className="text-[13px] text-[#a1a1a6]">
                {c.email}
                {c.phone ? ` · ${c.phone}` : ""}
                {c.company ? ` · ${c.company}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {phone && (
                <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
                  WhatsApp
                </a>
              )}
              <a href={`mailto:${c.email}`} className={btn.ghost}>
                Email
              </a>
              <Link href={`/admin/r/site_leads?q=${encodeURIComponent(c.email)}`} className={btn.ghost}>
                Leads table
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Stage" value={lastLead ? <Badge value={s(lastLead.status) || "new"} /> : "—"} />
            <Stat label="Spent on products" value={naira(c.productSpendKobo / 100)} />
            <Stat label="Subscriptions" value={String(c.subscriptions.filter((x) => x.status === "active").length || "None")} />
            <Stat label="Email sequence" value={c.subscriber ? (c.subscriber.unsubscribed_at ? "Unsubscribed" : s(c.subscriber.sequence)) : "Not subscribed"} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <Section title="Enquiries & deals" count={c.leads.length}>
                {c.leads.map((l) => (
                  <Item
                    key={s(l.id)}
                    href={`/admin/r/site_leads?open=${s(l.id)}`}
                    title={s(l.product) || "Enquiry"}
                    meta={`${s(l.type)} · ${relativeTime(l.created_at)}${l.value_ngn ? ` · ${naira(Number(l.value_ngn))}` : ""}`}
                    badge={s(l.status) || "new"}
                    body={s(l.message)}
                  />
                ))}
              </Section>
              <Section title="Subscriptions" count={c.subscriptions.length}>
                {c.subscriptions.map((x) => (
                  <Item
                    key={s(x.id)}
                    href={`/admin/r/subscriptions?open=${s(x.id)}`}
                    title={s(x.plan_id)}
                    meta={`${naira(Number(x.amount_kobo || 0) / 100)} · next ${formatDate(x.next_payment_date) || "—"}`}
                    badge={s(x.status)}
                  />
                ))}
              </Section>
              <Section title="Payments" count={c.payments.length}>
                {c.payments.map((p) => (
                  <Item
                    key={s(p.reference)}
                    title={s(p.product_id) || "Subscription / shop payment"}
                    meta={`${naira(Number(p.amount_kobo || 0) / 100)} · ${formatDate(p.created_at, true)} · ${s(p.reference)}`}
                  />
                ))}
              </Section>
              <Section title="Shops" count={c.shops.length}>
                {c.shops.map((x) => (
                  <Item key={s(x.id)} href={`/admin/r/storefronts?open=${s(x.id)}`} title={s(x.name)} meta={`/s/${s(x.slug)}`} badge={s(x.payments_status)} />
                ))}
              </Section>
              <Section title="Report Studio" count={c.reports.length}>
                {c.reports.map((x) => (
                  <Item key={s(x.id)} href={`/admin/r/report_orders?open=${s(x.id)}`} title={s(x.product_name)} meta={`${s(x.order_id)} · ${naira(Number(x.price_ngn || 0))}`} badge={s(x.status)} />
                ))}
              </Section>
              <Section title="Student projects" count={c.students.length}>
                {c.students.map((x) => (
                  <Item key={s(x.id)} href={`/admin/r/student_projects?open=${s(x.id)}`} title={s(x.package_name)} meta={`${s(x.request_id)} · ${naira(Number(x.amount_ngn || 0))}`} badge={s(x.status)} />
                ))}
              </Section>
              <Section title="Orders from seller shops" count={c.shopOrders.length}>
                {c.shopOrders.map((x) => (
                  <Item key={s(x.id)} href={`/admin/r/storefront_orders?open=${s(x.id)}`} title={s(x.reference)} meta={naira(Number(x.amount_kobo || 0) / 100)} badge={s(x.status)} />
                ))}
              </Section>
            </div>
            <aside className={`${panel} h-fit p-4`}>
              <ActivityTimeline email={c.email} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function Avatar({ name, large }: { name: string; large?: boolean }) {
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#ff8c14]/15 font-semibold text-[#ffb366] ring-1 ring-[#ff8c14]/25 ${large ? "h-14 w-14 text-[18px]" : "h-9 w-9 text-[12px]"}`}>
      {initials || "?"}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={`${panel} px-4 py-3`}>
      <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
      <div className="mt-1 text-[16px] font-semibold capitalize text-white">{value}</div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  if (!count) return null;
  return (
    <section className={panel}>
      <h2 className="border-b border-white/[0.06] px-4 py-3 text-[13px] font-semibold text-white">
        {title} <span className="text-[#86868b]">({count})</span>
      </h2>
      <ul className="divide-y divide-white/[0.05]">{children}</ul>
    </section>
  );
}

function Item({ title, meta, badge, body, href }: { title: string; meta: string; badge?: string; body?: string; href?: string }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-[13px] font-medium text-white">{title}</p>
        {badge && <Badge value={badge} />}
      </div>
      <p className="mt-0.5 text-[12px] text-[#86868b]">{meta}</p>
      {body && <p className="mt-1 line-clamp-2 text-[12px] text-[#a1a1a6]">{body}</p>}
    </>
  );
  return <li>{href ? <Link href={href} className="block px-4 py-3 hover:bg-white/[0.03]">{inner}</Link> : <div className="px-4 py-3">{inner}</div>}</li>;
}
