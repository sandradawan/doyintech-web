"use client";

import { useMemo, useState } from "react";
import PaidGate, { printHtml } from "./PaidGate";

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className="block text-sm text-gray-300">
      <span className="mb-1 block text-xs text-gray-500">{label}</span>
      <input
        {...rest}
        className={`w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none ${className || ""}`}
      />
    </label>
  );
}

function Area(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block text-sm text-gray-300">
      <span className="mb-1 block text-xs text-gray-500">{label}</span>
      <textarea
        {...rest}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
      />
    </label>
  );
}

function ExportBtn({ onClick, label = "Export / Print PDF" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black"
    >
      {label}
    </button>
  );
}

/* ——— 1. WhatsApp Builder ——— */
export function WhatsAppBuilderTool() {
  const [biz, setBiz] = useState("");
  const [hours, setHours] = useState("Mon–Sat 9am–6pm");
  const script = useMemo(
    () =>
      `👋 Welcome to ${biz || "[Business]"}!\n\nHours: ${hours}\n\nReply:\n1 Prices\n2 Book\n3 Human\n\nAway: Thanks — we're offline (${hours}). Leave your name + request.`,
    [biz, hours]
  );
  return (
    <PaidGate
      toolSlug="whatsapp-builder"
      preview={
        <pre className="max-h-32 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-gray-400">
          {script.slice(0, 180)}…
        </pre>
      }
    >
      <div className="space-y-4">
        <Field label="Business name" value={biz} onChange={(e) => setBiz(e.target.value)} />
        <Field label="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">
          {script}
        </pre>
        <ExportBtn
          label="Copy full script pack"
          onClick={() => {
            navigator.clipboard?.writeText(script);
            printHtml("WhatsApp Scripts", `<pre>${script.replace(/</g, "<")}</pre>`);
          }}
        />
      </div>
    </PaidGate>
  );
}

/* ——— 2. Branded Invoice ——— */
export function BrandedInvoiceTool() {
  const [from, setFrom] = useState("");
  const [client, setClient] = useState("");
  const [item, setItem] = useState("Service");
  const [amount, setAmount] = useState("");
  const html = `<div style="padding:40px;max-width:640px;margin:auto">
    <h1>INVOICE</h1>
    <p><b>From:</b> ${from || "—"}<br/><b>Bill to:</b> ${client || "—"}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:20px">
      <tr><td style="border-bottom:1px solid #ddd;padding:8px">${item}</td>
      <td style="border-bottom:1px solid #ddd;padding:8px;text-align:right">₦${amount || "0"}</td></tr>
    </table>
    <p style="font-size:20px;font-weight:700;margin-top:16px">Total: ₦${amount || "0"}</p>
  </div>`;
  return (
    <PaidGate toolSlug="branded-invoice" preview={<p className="text-sm text-gray-500">Invoice preview locked after header…</p>}>
      <div className="space-y-3">
        <Field label="Your business" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Field label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <Field label="Line item" value={item} onChange={(e) => setItem(e.target.value)} />
        <Field label="Amount (NGN)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Invoice", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 3. Proposal ——— */
export function ProposalExportTool() {
  const [client, setClient] = useState("");
  const [scope, setScope] = useState("");
  const [price, setPrice] = useState("");
  const html = `<div style="padding:40px;max-width:640px;margin:auto">
    <h1>Project Proposal</h1>
    <p>Prepared for <b>${client || "Client"}</b></p>
    <h2>Scope</h2><p>${(scope || "—").replace(/\n/g, "<br/>")}</p>
    <h2>Investment</h2><p style="font-size:22px;font-weight:700">₦${price || "0"}</p>
    <p>50% deposit to start. Valid 14 days.</p>
  </div>`;
  return (
    <PaidGate toolSlug="proposal-export" preview={<p className="text-sm text-gray-500">Proposal body hidden until unlock.</p>}>
      <div className="space-y-3">
        <Field label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <Area label="Scope" rows={4} value={scope} onChange={(e) => setScope(e.target.value)} />
        <Field label="Price (NGN)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Proposal", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 4. Contract / NDA ——— */
export function ContractExportTool() {
  const [partyA, setA] = useState("");
  const [partyB, setB] = useState("");
  const [kind, setKind] = useState<"service" | "nda">("service");
  const html =
    kind === "nda"
      ? `<div style="padding:40px"><h1>Non-Disclosure Agreement</h1>
        <p>Between <b>${partyA || "Party A"}</b> and <b>${partyB || "Party B"}</b>.</p>
        <p>Both parties agree to keep confidential information private for 24 months.</p>
        <p style="margin-top:40px">Signed: _____________ Date: _____</p></div>`
      : `<div style="padding:40px"><h1>Service Agreement</h1>
        <p>Provider: <b>${partyA || "—"}</b><br/>Client: <b>${partyB || "—"}</b></p>
        <p>Provider will deliver agreed services. Payment as invoiced. IP transfers on full payment.</p>
        <p style="margin-top:40px">Client: ________ Provider: ________</p></div>`;
  return (
    <PaidGate toolSlug="contract-export" preview={<p className="text-sm text-gray-500">Contract text locked.</p>}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setKind("service")} className={`rounded-full px-3 py-1 text-xs ${kind === "service" ? "bg-white text-black" : "border border-white/20 text-white"}`}>Service</button>
          <button type="button" onClick={() => setKind("nda")} className={`rounded-full px-3 py-1 text-xs ${kind === "nda" ? "bg-white text-black" : "border border-white/20 text-white"}`}>NDA</button>
        </div>
        <Field label="Party A / Provider" value={partyA} onChange={(e) => setA(e.target.value)} />
        <Field label="Party B / Client" value={partyB} onChange={(e) => setB(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Agreement", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 5. Security report ——— */
export function SecurityReportTool() {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("Add scan findings after running free security scanner.");
  const html = `<div style="padding:40px"><h1>Security Report</h1>
    <p>Target: <b>${url || "—"}</b></p>
    <h2>Findings</h2><p>${notes.replace(/\n/g, "<br/>")}</p>
    <h2>Priority fixes</h2><ol><li>Enforce HTTPS / HSTS</li><li>Set security headers</li><li>Remove exposed files</li></ol>
    <p style="color:#666;font-size:12px">DoyinTech · Passive advisory report</p></div>`;
  return (
    <PaidGate toolSlug="security-report" preview={<p className="text-sm text-gray-500">Full PDF report locked.</p>}>
      <div className="space-y-3">
        <Field label="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Area label="Findings / notes" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Security Report", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 6. Uptime monitor unlock ——— */
export function UptimeMonitorTool() {
  const [domain, setDomain] = useState("");
  return (
    <PaidGate toolSlug="uptime-monitor" preview={<p className="text-sm text-gray-500">Monitor dashboard unlock required.</p>}>
      <div className="space-y-3">
        <Field label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
          <p className="font-semibold text-white">{domain || "your-domain.com"}</p>
          <p className="mt-2 text-emerald-400">● Unlocked — check SSL & uptime manually or pair with Org Security tool</p>
          <ul className="mt-3 list-disc pl-5 text-gray-400">
            <li>Open https://{domain || "example.com"} and confirm load</li>
            <li>Use /tools/ssl-checker for certificate</li>
            <li>Use /tools/org-security for multi-domain</li>
          </ul>
        </div>
      </div>
    </PaidGate>
  );
}

/* ——— 7. SEO Audit ——— */
export function SeoAuditTool() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const checklist = [
    "Title tag unique & < 60 chars",
    "Meta description present",
    "One H1 per page",
    "Mobile friendly",
    "HTTPS enabled",
    "Sitemap linked",
    "Images have alt text",
  ];
  const html = `<div style="padding:40px"><h1>SEO Audit</h1>
    <p>URL: ${url || "—"}<br/>Title: ${title || "—"}</p>
    <ul>${checklist.map((c) => `<li>${c}</li>`).join("")}</ul></div>`;
  return (
    <PaidGate toolSlug="seo-audit" preview={<p className="text-sm text-gray-500">Full SEO export locked.</p>}>
      <div className="space-y-3">
        <Field label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Field label="Current title tag" value={title} onChange={(e) => setTitle(e.target.value)} />
        <ExportBtn onClick={() => printHtml("SEO Audit", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 8. AI Copy ——— */
export function AiCopyTool() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const pack = useMemo(() => {
    const p = product || "[Product]";
    const a = audience || "[Audience]";
    return `ADS\n• ${p} for ${a} — start today.\n• Stop struggling. Try ${p}.\n\nWHATSAPP\nHi! Interested in ${p}? Reply YES.\n\nEMAIL\nSubject: ${p} built for ${a}\nBody: Quick note — ${p} helps ${a} get results. Reply to learn more.`;
  }, [product, audience]);
  return (
    <PaidGate toolSlug="ai-copy" preview={<pre className="max-h-24 overflow-hidden text-xs text-gray-500">{pack.slice(0, 120)}…</pre>}>
      <div className="space-y-3">
        <Field label="Product / service" value={product} onChange={(e) => setProduct(e.target.value)} />
        <Field label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">{pack}</pre>
        <ExportBtn label="Copy & print pack" onClick={() => { navigator.clipboard?.writeText(pack); printHtml("Copy Pack", `<pre>${pack}</pre>`); }} />
      </div>
    </PaidGate>
  );
}

/* ——— 9. CV Premium ——— */
export function CvPremiumTool() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const html = `<div style="padding:40px;max-width:700px;margin:auto">
    <h1 style="margin:0">${name || "Your Name"}</h1>
    <p style="color:#555">${role || "Role"}</p>
    <h3>Summary</h3><p>${(summary || "—").replace(/\n/g, "<br/>")}</p>
  </div>`;
  return (
    <PaidGate toolSlug="cv-premium" preview={<p className="text-sm text-gray-500">Premium CV PDF locked.</p>}>
      <div className="space-y-3">
        <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="Target role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Area label="Summary" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
        <ExportBtn onClick={() => printHtml("CV", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 10. QR Pro ——— */
export function QrProTool() {
  const [link, setLink] = useState("https://");
  const [label, setLabel] = useState("Scan me");
  return (
    <PaidGate toolSlug="qr-pro" preview={<p className="text-sm text-gray-500">Branded QR kit locked.</p>}>
      <div className="space-y-3">
        <Field label="Destination URL" value={link} onChange={(e) => setLink(e.target.value)} />
        <Field label="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <p className="text-sm text-gray-400">
          Use any free QR generator with this URL, then print label: <b className="text-white">{label}</b>
        </p>
        <ExportBtn
          label="Print QR brief"
          onClick={() =>
            printHtml(
              "QR Brief",
              `<div style="padding:40px"><h1>${label}</h1><p>URL: ${link}</p><p>Track scans in your analytics.</p></div>`
            )
          }
        />
      </div>
    </PaidGate>
  );
}

/* ——— 11. Rent receipt ——— */
export function RentReceiptTool() {
  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const html = `<div style="padding:40px"><h1>RENT RECEIPT</h1>
    <p>Received from <b>${tenant || "Tenant"}</b> the sum of <b>₦${amount || "0"}</b>
    for rent period <b>${period || "—"}</b>.</p>
    <p>Landlord/Agent: ${landlord || "—"}</p>
    <p style="margin-top:40px">Signature: _____________</p></div>`;
  return (
    <PaidGate toolSlug="rent-receipt" preview={<p className="text-sm text-gray-500">Receipt export locked.</p>}>
      <div className="space-y-3">
        <Field label="Landlord / Agent" value={landlord} onChange={(e) => setLandlord(e.target.value)} />
        <Field label="Tenant" value={tenant} onChange={(e) => setTenant(e.target.value)} />
        <Field label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Field label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Jan 2026" />
        <ExportBtn onClick={() => printHtml("Rent Receipt", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 12. Dues receipt ——— */
export function DuesReceiptTool() {
  const [org, setOrg] = useState("");
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("Annual dues");
  const html = `<div style="padding:40px"><h1>PAYMENT RECEIPT</h1>
    <p>${org || "Organization"}</p>
    <p>Received from <b>${payer || "—"}</b> ₦${amount || "0"} for ${desc}.</p>
    <p style="margin-top:32px">Authorized: _____________</p></div>`;
  return (
    <PaidGate toolSlug="dues-receipt" preview={<p className="text-sm text-gray-500">Dues receipt locked.</p>}>
      <div className="space-y-3">
        <Field label="School / Church / Org" value={org} onChange={(e) => setOrg(e.target.value)} />
        <Field label="Payer name" value={payer} onChange={(e) => setPayer(e.target.value)} />
        <Field label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Field label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Dues Receipt", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 13. Offer letter ——— */
export function OfferLetterTool() {
  const [company, setCompany] = useState("");
  const [candidate, setCandidate] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const html = `<div style="padding:40px"><h1>Offer of Employment</h1>
    <p>${company || "Company"} is pleased to offer <b>${candidate || "Candidate"}</b>
    the position of <b>${role || "Role"}</b> with compensation ₦${salary || "0"} per annum.</p>
    <p>Please sign and return within 7 days.</p>
    <p style="margin-top:40px">HR: _____________ Candidate: _____________</p></div>`;
  return (
    <PaidGate toolSlug="offer-letter" preview={<p className="text-sm text-gray-500">Offer letter export locked.</p>}>
      <div className="space-y-3">
        <Field label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Field label="Candidate" value={candidate} onChange={(e) => setCandidate(e.target.value)} />
        <Field label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Field label="Salary (NGN / year)" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Offer Letter", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 14. Hosting export ——— */
export function HostingExportTool() {
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState("Shared hosting");
  const [cost, setCost] = useState("");
  const html = `<div style="padding:40px"><h1>Hosting & Domain Plan</h1>
    <p>Domain: ${domain || "—"}<br/>Plan: ${plan}<br/>Est. annual: ₦${cost || "0"}</p>
    <p>Includes DNS setup checklist and SSL reminder.</p></div>`;
  return (
    <PaidGate toolSlug="hosting-export" preview={<p className="text-sm text-gray-500">Plan PDF locked.</p>}>
      <div className="space-y-3">
        <Field label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <Field label="Hosting plan" value={plan} onChange={(e) => setPlan(e.target.value)} />
        <Field label="Est. yearly cost (NGN)" value={cost} onChange={(e) => setCost(e.target.value)} />
        <ExportBtn onClick={() => printHtml("Hosting Plan", html)} />
      </div>
    </PaidGate>
  );
}

/* ——— 15. Interview pack ——— */
const QUESTIONS = {
  backend: ["Explain REST vs GraphQL", "What is an index in a database?", "How do you secure an API?"],
  frontend: ["What is the virtual DOM?", "Controlled vs uncontrolled inputs?", "How does CSS specificity work?"],
  general: ["Tell me about a hard bug you fixed", "How do you estimate tasks?", "Describe a system you designed"],
};

export function InterviewPackTool() {
  const [track, setTrack] = useState<keyof typeof QUESTIONS>("general");
  const list = QUESTIONS[track];
  return (
    <PaidGate toolSlug="interview-pack" preview={<p className="text-sm text-gray-500">Full question bank locked.</p>}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(QUESTIONS) as (keyof typeof QUESTIONS)[]).map((t) => (
            <button key={t} type="button" onClick={() => setTrack(t)}
              className={`rounded-full px-3 py-1 text-xs capitalize ${track === t ? "bg-white text-black" : "border border-white/20 text-white"}`}>{t}</button>
          ))}
        </div>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-200">
          {list.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <ExportBtn
          label="Print question pack"
          onClick={() =>
            printHtml(
              "Interview Pack",
              `<div style="padding:40px"><h1>${track} interview</h1><ol>${list.map((q) => `<li>${q}</li>`).join("")}</ol></div>`
            )
          }
        />
      </div>
    </PaidGate>
  );
}
