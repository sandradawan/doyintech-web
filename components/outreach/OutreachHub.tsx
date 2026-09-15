"use client";

import { useEffect, useMemo, useState } from "react";
import TemplatesLibrary from "@/components/outreach/TemplatesLibrary";

type Market = "US" | "UK";
type Status =
  | "new"
  | "contacted"
  | "audit_sent"
  | "replied"
  | "call_booked"
  | "won"
  | "lost"
  | "nurture";

type Prospect = {
  id: string;
  market: Market;
  city: string;
  businessName: string;
  industry: string;
  website: string;
  contactName: string;
  email: string;
  issue1: string;
  issue2: string;
  status: Status;
  notes: string;
  createdAt: string;
};

const STORAGE_KEY = "doyintech_outreach_prospects_v1";

const input =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

const STATUSES: Status[] = [
  "new",
  "contacted",
  "audit_sent",
  "replied",
  "call_booked",
  "won",
  "lost",
  "nurture",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function OutreachHub() {
  const [tab, setTab] = useState<
    "prospects" | "messages" | "templates" | "audit" | "checklist" | "queries"
  >("prospects");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [form, setForm] = useState({
    market: "US" as Market,
    city: "",
    businessName: "",
    industry: "Beauty salon",
    website: "",
    contactName: "",
    email: "",
    issue1: "",
    issue2: "",
  });

  const [msgMarket, setMsgMarket] = useState<Market>("US");
  const [msgBiz, setMsgBiz] = useState("");
  const [msgCity, setMsgCity] = useState("");
  const [msgName, setMsgName] = useState("");
  const [msgIndustry, setMsgIndustry] = useState("local business");
  const [msgIssue, setMsgIssue] = useState("the site is hard to use on mobile");

  const [auditBiz, setAuditBiz] = useState("");
  const [audit1, setAudit1] = useState("");
  const [audit1Impact, setAudit1Impact] = useState("");
  const [audit2, setAudit2] = useState("");
  const [audit2Impact, setAudit2Impact] = useState("");
  const [auditFix, setAuditFix] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProspects(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
    } catch {
      /* ignore */
    }
  }, [prospects]);

  const stats = useMemo(() => {
    const c = (s: Status) => prospects.filter((p) => p.status === s).length;
    return {
      total: prospects.length,
      contacted: c("contacted") + c("audit_sent") + c("replied") + c("call_booked") + c("won"),
      replied: c("replied") + c("call_booked") + c("won"),
      won: c("won"),
    };
  }, [prospects]);

  function addProspect(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    const row: Prospect = {
      id: String(Date.now()),
      market: form.market,
      city: form.city.trim(),
      businessName: form.businessName.trim(),
      industry: form.industry.trim(),
      website: form.website.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      issue1: form.issue1.trim(),
      issue2: form.issue2.trim(),
      status: "new",
      notes: "",
      createdAt: today(),
    };
    setProspects((p) => [row, ...p]);
    setForm((f) => ({
      ...f,
      businessName: "",
      website: "",
      contactName: "",
      email: "",
      issue1: "",
      issue2: "",
    }));
  }

  function updateStatus(id: string, status: Status) {
    setProspects((list) => list.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function removeProspect(id: string) {
    setProspects((list) => list.filter((p) => p.id !== id));
  }

  function exportCsv() {
    const header =
      "date,market,city,business,industry,website,contact,email,issue1,issue2,status\n";
    const body = prospects
      .map((p) =>
        [
          p.createdAt,
          p.market,
          p.city,
          p.businessName,
          p.industry,
          p.website,
          p.contactName,
          p.email,
          p.issue1,
          p.issue2,
          p.status,
        ]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doyintech-outreach-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const coldEmail = useMemo(() => {
    const name = msgName || "there";
    const biz = msgBiz || "[Business Name]";
    const city = msgCity || "[City]";
    const issue = msgIssue || "[specific issue]";
    if (msgMarket === "UK") {
      return `Subject: ${biz} — small digital observation\n\nHello ${name},\n\nI was researching ${msgIndustry} businesses in ${city} and found ${biz}.\n\nOne thing stood out: ${issue}. Many UK microbusinesses have a site that works, but still lose leads because booking or mobile experience is weak.\n\nI'm with DoyinTech. We offer a complimentary 3-minute digital audit — two specific points and one practical next step.\n\nHappy to send it over if useful.\n\nKind regards,\nSilas · DoyinTech\nhttps://doyintech.vercel.app\ndoyintechnology@outlook.com`;
    }
    return `Subject: Quick note on ${biz}'s website\n\nHi ${name},\n\nI came across ${biz} while looking at ${city} ${msgIndustry} businesses.\n\nI noticed ${issue}. That often costs enquiries even when the service is excellent.\n\nI run DoyinTech — we help local businesses fix this with modern sites, booking, and simple automation.\n\nI can send a free 3-minute digital audit (two concrete issues + one recommended fix). No obligation.\n\nWorth a look?\n\nSilas · DoyinTech\nhttps://doyintech.vercel.app\ndoyintechnology@outlook.com`;
  }, [msgMarket, msgBiz, msgCity, msgName, msgIndustry, msgIssue]);

  const linkedInNote = useMemo(() => {
    const biz = msgBiz || "[Business]";
    const city = msgCity || "[City]";
    return `Hi ${msgName || "there"} — saw ${biz} in ${city}. Noticed ${msgIssue}. I help local businesses fix that (DoyinTech). Open to a free 3-min digital audit?`;
  }, [msgName, msgBiz, msgCity, msgIssue]);

  const follow3 = `Hi ${msgName || "there"} — following up on my note about ${msgBiz || "[Business]"}. Still happy to send the free audit (2 issues + 1 fix). Takes a few minutes; zero pressure.\n\nSilas · DoyinTech`;
  const follow7 = `Hi ${msgName || "there"} — last note from me. If timing's wrong, no problem. If you'd like the free digital audit for ${msgBiz || "[Business]"}, just reply "audit" and I'll send it.\n\nSilas · DoyinTech`;

  const auditText = useMemo(() => {
    return `DIGITAL AUDIT — ${auditBiz || "[Business Name]"}\nDate: ${today()}\n\n1. Observation: ${audit1 || "[issue 1]"}\n   Impact: ${audit1Impact || "[why it costs enquiries]"}\n\n2. Observation: ${audit2 || "[issue 2]"}\n   Impact: ${audit2Impact || "[why it costs enquiries]"}\n\nRecommended fix: ${auditFix || "[one clear project]"}\n\nNext step: 15-min call or reply with a preferred time.\nDoyinTech · https://doyintech.vercel.app\ndoyintechnology@outlook.com`;
  }, [auditBiz, audit1, audit1Impact, audit2, audit2Impact, auditFix]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch {
      alert("Copy failed — select and copy manually");
    }
  }

  const tabs = [
    { id: "prospects" as const, label: "Prospects" },
    { id: "messages" as const, label: "Messages" },
    { id: "templates" as const, label: "Templates" },
    { id: "audit" as const, label: "Free audit" },
    { id: "checklist" as const, label: "Daily plan" },
    { id: "queries" as const, label: "Search queries" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Prospects", stats.total],
          ["In pipeline", stats.contacted],
          ["Replied+", stats.replied],
          ["Won", stats.won],
        ].map(([label, n]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{n}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              tab === t.id
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-[#a1a1a6] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "templates" && <TemplatesLibrary />}

      {tab === "prospects" && (
        <div className="space-y-6">
          <form
            onSubmit={addProspect}
            className="grid gap-3 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:grid-cols-2"
          >
            <h2 className="sm:col-span-2 text-sm font-semibold text-white">Add prospect</h2>
            <label className="text-xs text-gray-500">
              Market
              <select
                className={`mt-1 ${input}`}
                value={form.market}
                onChange={(e) => setForm({ ...form, market: e.target.value as Market })}
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </label>
            <label className="text-xs text-gray-500">
              City
              <input
                className={`mt-1 ${input}`}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Austin / Manchester"
              />
            </label>
            <label className="text-xs text-gray-500">
              Business name *
              <input
                required
                className={`mt-1 ${input}`}
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </label>
            <label className="text-xs text-gray-500">
              Industry
              <input
                className={`mt-1 ${input}`}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </label>
            <label className="text-xs text-gray-500">
              Website
              <input
                className={`mt-1 ${input}`}
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https:// or (none)"
              />
            </label>
            <label className="text-xs text-gray-500">
              Contact name
              <input
                className={`mt-1 ${input}`}
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              />
            </label>
            <label className="text-xs text-gray-500 sm:col-span-2">
              Email / channel
              <input
                className={`mt-1 ${input}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="text-xs text-gray-500">
              Specific issue 1
              <input
                className={`mt-1 ${input}`}
                value={form.issue1}
                onChange={(e) => setForm({ ...form, issue1: e.target.value })}
                placeholder="e.g. no mobile booking button"
              />
            </label>
            <label className="text-xs text-gray-500">
              Specific issue 2
              <input
                className={`mt-1 ${input}`}
                value={form.issue2}
                onChange={(e) => setForm({ ...form, issue2: e.target.value })}
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black"
            >
              Save prospect
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
            >
              Export CSV
            </button>
            <p className="self-center text-[12px] text-[#86868b]">
              Saved in this browser (localStorage)
            </p>
          </div>

          <ul className="space-y-3">
            {prospects.length === 0 && (
              <p className="text-sm text-[#a1a1a6]">No prospects yet — add your first above.</p>
            )}
            {prospects.map((p) => (
              <li key={p.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {p.businessName}{" "}
                      <span className="text-xs font-normal text-[#86868b]">
                        {p.market} · {p.city} · {p.industry}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[#a1a1a6]">
                      {p.website || "No website"}
                      {p.contactName ? ` · ${p.contactName}` : ""}
                      {p.email ? ` · ${p.email}` : ""}
                    </p>
                    {(p.issue1 || p.issue2) && (
                      <p className="mt-2 text-xs text-[#c7cdd8]">
                        {p.issue1}
                        {p.issue2 ? ` · ${p.issue2}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value as Status)}
                      className="rounded-lg border border-white/15 bg-black/50 px-2 py-1.5 text-xs text-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeProspect(p.id)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "messages" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h2 className="text-sm font-semibold text-white">Personalize</h2>
            <select
              className={input}
              value={msgMarket}
              onChange={(e) => setMsgMarket(e.target.value as Market)}
            >
              <option value="US">US tone</option>
              <option value="UK">UK tone</option>
            </select>
            <input className={input} placeholder="Contact first name" value={msgName} onChange={(e) => setMsgName(e.target.value)} />
            <input className={input} placeholder="Business name" value={msgBiz} onChange={(e) => setMsgBiz(e.target.value)} />
            <input className={input} placeholder="City" value={msgCity} onChange={(e) => setMsgCity(e.target.value)} />
            <input className={input} placeholder="Industry" value={msgIndustry} onChange={(e) => setMsgIndustry(e.target.value)} />
            <input className={input} placeholder="Specific issue" value={msgIssue} onChange={(e) => setMsgIssue(e.target.value)} />
          </div>
          <div className="space-y-3">
            {["Cold email", "LinkedIn note", "Day-3 follow-up", "Day-7 follow-up"].map((label, i) => {
              const text = [coldEmail, linkedInNote, follow3, follow7][i];
              return (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-2 flex justify-between">
                    <p className="text-xs font-semibold text-[#ff8c14]">{label}</p>
                    <button type="button" className="text-xs text-white" onClick={() => copy(text)}>
                      Copy
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-gray-300">{text}</pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h2 className="text-sm font-semibold text-white">3-minute digital audit</h2>
            <input className={input} placeholder="Business name" value={auditBiz} onChange={(e) => setAuditBiz(e.target.value)} />
            <input className={input} placeholder="Observation 1" value={audit1} onChange={(e) => setAudit1(e.target.value)} />
            <input className={input} placeholder="Impact 1" value={audit1Impact} onChange={(e) => setAudit1Impact(e.target.value)} />
            <input className={input} placeholder="Observation 2" value={audit2} onChange={(e) => setAudit2(e.target.value)} />
            <input className={input} placeholder="Impact 2" value={audit2Impact} onChange={(e) => setAudit2Impact(e.target.value)} />
            <input className={input} placeholder="Recommended fix" value={auditFix} onChange={(e) => setAuditFix(e.target.value)} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 flex justify-between">
              <p className="text-xs font-semibold text-[#ff8c14]">Audit text</p>
              <button type="button" className="text-xs text-white" onClick={() => copy(auditText)}>
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-[12px] text-gray-300">{auditText}</pre>
          </div>
        </div>
      )}

      {tab === "checklist" && (
        <div className="rounded-2xl border border-white/10 bg-[#141a28] p-6 text-[14px] text-[#c7cdd8]">
          <h2 className="text-sm font-semibold text-white">Daily 90-minute plan</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Find 20–30 qualified prospects (Search queries tab).</li>
            <li>Add them under Prospects with one specific issue each.</li>
            <li>Send 15–20 personalized messages (Messages or Templates tab).</li>
            <li>Send 5–10 free audits to engaged contacts.</li>
            <li>Do day-3 and day-7 follow-ups on open threads.</li>
          </ol>
          <p className="mt-4 text-[13px] text-[#86868b]">
            You send the messages — this hub prepares copy and tracks the pipeline. No bulk spam.
          </p>
        </div>
      )}

      {tab === "queries" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-6 text-[13px] text-[#c7cdd8]">
          <h2 className="text-sm font-semibold text-white">Search queries (swap CITY)</h2>
          <p className="font-semibold text-[#ff8c14]">US</p>
          <pre className="whitespace-pre-wrap text-[12px]">{`beauty salon in [CITY] -facebook\n"best cleaning service" [CITY]\nrestaurant [CITY] menu\nestate agent [CITY]\n"makeup artist" [CITY] book`}</pre>
          <p className="font-semibold text-[#ff8c14]">UK</p>
          <pre className="whitespace-pre-wrap text-[12px]">{`"hair salon" [CITY] UK\ncleaning company [CITY]\n"estate agents" [CITY]\n"personal trainer" [CITY] book online\n"accountant" [CITY] sole trader`}</pre>
        </div>
      )}
    </div>
  );
}
