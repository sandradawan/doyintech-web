"use client";

import { useEffect, useState } from "react";
import { formatNgn } from "@/lib/tools/extra";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

const field =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";

export default function ContractGenerator() {
  const [provider, setProvider] = useState("DoyinTech");
  const [providerAddress, setProviderAddress] = useState("Jos, Nigeria");
  const [client, setClient] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [service, setService] = useState("Website design and development");
  const [scope, setScope] = useState(
    "The Provider shall design, develop, and deploy the agreed digital product according to the approved scope and timeline.",
  );
  const [fee, setFee] = useState(750000);
  const [deposit, setDeposit] = useState(50);
  const [timeline, setTimeline] = useState("6 weeks from deposit date");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [revisions, setRevisions] = useState("2 rounds of revisions on design");
  const [termination, setTermination] = useState(
    "Either party may terminate with 7 days written notice. Work completed to date remains payable.",
  );

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

  const depositAmt = Math.round(fee * (deposit / 100));

  return (
    <div className="space-y-6">
      <div className="doc-no-print space-y-3 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={field} placeholder="Provider (you)" value={provider} onChange={(e) => setProvider(e.target.value)} />
          <input className={field} placeholder="Provider address" value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} />
          <input className={field} placeholder="Client name" value={client} onChange={(e) => setClient(e.target.value)} />
          <input className={field} placeholder="Client address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          <input className={field + " sm:col-span-2"} placeholder="Service title" value={service} onChange={(e) => setService(e.target.value)} />
        </div>
        <textarea className={field + " resize-none"} rows={3} value={scope} onChange={(e) => setScope(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="number" className={field} value={fee} onChange={(e) => setFee(Number(e.target.value) || 0)} placeholder="Total fee" />
          <input type="number" className={field} value={deposit} onChange={(e) => setDeposit(Number(e.target.value) || 0)} placeholder="Deposit %" />
          <input className={field} value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Timeline" />
          <input type="date" className={field} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <input className={field} value={revisions} onChange={(e) => setRevisions(e.target.value)} placeholder="Revisions policy" />
        <textarea className={field + " resize-none"} rows={2} value={termination} onChange={(e) => setTermination(e.target.value)} />
        <button type="button" onClick={handlePrint} className="rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">
          Print / Save PDF
        </button>
        <p className="text-xs text-gray-500">Template only — have a lawyer review for high-value contracts. Signature lines are for wet ink or upload to an e-sign tool.</p>
      </div>

      <div id="doc-sheet" className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl">
        <div className="border-b border-gray-200 px-8 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Service agreement</p>
          <h2 className="mt-2 text-2xl font-bold">{service}</h2>
          <p className="mt-2 text-sm text-gray-500">Effective / start date: {startDate}</p>
        </div>
        <div className="space-y-5 px-8 py-8 text-sm leading-relaxed text-gray-700">
          <p>
            This Service Agreement is entered into between <strong>{provider || "Provider"}</strong>{" "}
            ({providerAddress || "Address"}) ("Provider") and <strong>{client || "Client"}</strong>{" "}
            ({clientAddress || "Address"}) ("Client").
          </p>
          <section>
            <h3 className="font-bold text-gray-900">1. Services</h3>
            <p className="mt-1 whitespace-pre-wrap">{scope}</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">2. Fees & payment</h3>
            <p className="mt-1">
              Total fee: <strong>{formatNgn(fee)}</strong>. Deposit of {deposit}% ({formatNgn(depositAmt)}) is due before work begins. Balance due on delivery or as otherwise agreed in writing.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">3. Timeline</h3>
            <p className="mt-1">{timeline}</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">4. Revisions</h3>
            <p className="mt-1">{revisions}</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">5. Intellectual property</h3>
            <p className="mt-1">
              Upon full payment, Client receives ownership of final deliverables created specifically for this project, excluding Provider tools, libraries, and pre-existing materials.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">6. Termination</h3>
            <p className="mt-1">{termination}</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">7. Signatures</h3>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <div className="mt-8 border-b border-gray-400" />
                <p className="mt-2 text-sm">{provider || "Name"}</p>
                <p className="text-xs text-gray-500">Signature / Date</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Client</p>
                <div className="mt-8 border-b border-gray-400" />
                <p className="mt-2 text-sm">{client || "Name"}</p>
                <p className="text-xs text-gray-500">Signature / Date</p>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-gray-100 px-8 py-4 text-center text-[10px] text-gray-400">
          Template generated with {TOOLS_CONFIG.brand} · Not legal advice
        </div>
      </div>

      <div className="doc-no-print">
        <LeadForm tool="Contract Generator" resultSummary={service} />
      </div>
    </div>
  );
}
