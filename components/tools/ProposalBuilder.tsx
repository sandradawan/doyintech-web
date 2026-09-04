"use client";

import { useEffect, useState } from "react";
import { formatNgn } from "@/lib/tools/extra";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

const field =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";

export default function ProposalBuilder() {
  const [provider, setProvider] = useState("DoyinTech");
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("Website Development Proposal");
  const [intro, setIntro] = useState(
    "Thank you for the opportunity to propose on this project. Below is our understanding of the scope, timeline, and investment.",
  );
  const [scope, setScope] = useState(
    "• Discovery and requirements\n• UI design for key pages\n• Development and integrations\n• Testing and launch support",
  );
  const [timeline, setTimeline] = useState("4–6 weeks from deposit");
  const [investment, setInvestment] = useState(750000);
  const [deposit, setDeposit] = useState(50);
  const [deliverables, setDeliverables] = useState(
    "• Production-ready website\n• Admin access and documentation\n• 14-day post-launch support",
  );
  const [validity, setValidity] = useState("14 days");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  function handlePrint() {
    document.body.classList.add("printing-doc");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-doc"), 500);
  }

  useEffect(() => {
    const fn = () => document.body.classList.remove("printing-doc");
    window.addEventListener("afterprint", fn);
    return () => window.removeEventListener("afterprint", fn);
  }, []);

  const depositAmt = Math.round(investment * (deposit / 100));

  return (
    <div className="space-y-6">
      <div className="doc-no-print space-y-4 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={field} placeholder="Your company" value={provider} onChange={(e) => setProvider(e.target.value)} />
          <input className={field} placeholder="Client name" value={client} onChange={(e) => setClient(e.target.value)} />
          <input className={field + " sm:col-span-2"} placeholder="Proposal title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
          <input className={field} placeholder="Validity (e.g. 14 days)" value={validity} onChange={(e) => setValidity(e.target.value)} />
        </div>
        <textarea className={field + " resize-none"} rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="Introduction" />
        <textarea className={field + " resize-none"} rows={4} value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Scope of work" />
        <textarea className={field + " resize-none"} rows={3} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Deliverables" />
        <div className="grid gap-3 sm:grid-cols-3">
          <input className={field} placeholder="Timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
          <input type="number" className={field} placeholder="Investment (₦)" value={investment} onChange={(e) => setInvestment(Number(e.target.value) || 0)} />
          <input type="number" className={field} placeholder="Deposit %" value={deposit} onChange={(e) => setDeposit(Number(e.target.value) || 0)} />
        </div>
        <button type="button" onClick={handlePrint} className="rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">
          Print / Save PDF
        </button>
      </div>

      <div id="doc-sheet" className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl">
        <div className="border-b-4 border-blue-600 px-8 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Proposal</p>
          <h2 className="mt-2 text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Prepared by <strong>{provider || "—"}</strong> for <strong>{client || "Client"}</strong>
          </p>
          <p className="mt-1 text-sm text-gray-500">Date: {date} · Valid for {validity}</p>
        </div>
        <div className="space-y-6 px-8 py-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Introduction</h3>
            <p className="mt-2 whitespace-pre-wrap">{intro}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Scope of work</h3>
            <p className="mt-2 whitespace-pre-wrap">{scope}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Deliverables</h3>
            <p className="mt-2 whitespace-pre-wrap">{deliverables}</p>
          </section>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[11px] uppercase text-gray-400">Timeline</p>
              <p className="mt-1 font-semibold text-gray-900">{timeline}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[11px] uppercase text-gray-400">Investment</p>
              <p className="mt-1 font-semibold text-gray-900">{formatNgn(investment)}</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-[11px] uppercase text-blue-600">Deposit ({deposit}%)</p>
              <p className="mt-1 font-semibold text-blue-800">{formatNgn(depositAmt)}</p>
            </div>
          </section>
          <p className="text-xs text-gray-500">
            This proposal is not a binding contract until both parties sign a service agreement and the deposit is received.
          </p>
        </div>
        <div className="border-t border-gray-100 px-8 py-4 text-center text-[10px] text-gray-400">
          {TOOLS_CONFIG.brand} Proposal Tool · {TOOLS_CONFIG.siteUrl}/tools/proposal-builder
        </div>
      </div>

      <div className="doc-no-print">
        <LeadForm tool="Proposal Builder" resultSummary={title} defaultMessage="Hi DoyinTech, I used the proposal builder and want help closing or delivering a project." />
      </div>
    </div>
  );
}
