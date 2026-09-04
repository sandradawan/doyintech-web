"use client";

import { useMemo, useState } from "react";
import LeadForm from "./LeadForm";
import ShareActions from "./ShareActions";
import {
  adviseStack,
  planHosting,
  calcRoi,
  estimateSalary,
  skillGap,
  PROJECT_IDEAS,
  INTERVIEW_Q,
  aiUseCases,
  WA_CHECKLIST,
  pickMaintenance,
  generatePassword,
  formatNgn,
  SKILL_TRACKS,
} from "@/lib/tools/extra";
import { trackToolEvent } from "@/lib/tools/analytics";
import { TOOLS_CONFIG } from "@/lib/tools/config";

const box =
  "rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8 space-y-5";
const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";
const btn =
  "rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white";
const chip = (on: boolean) =>
  `rounded-full border px-3 py-1.5 text-xs ${on ? "border-primary bg-primary/20 text-white" : "border-white/10 text-gray-400"}`;

// ——— Project Brief ———
export function ProjectBriefTool() {
  const [f, setF] = useState({
    name: "",
    business: "",
    type: "Website",
    problem: "",
    users: "",
    features: "",
    budget: "",
    timeline: "",
    success: "",
  });
  const [done, setDone] = useState(false);
  const brief = `PROJECT BRIEF\n\nClient: ${f.name || "—"}\nBusiness: ${f.business || "—"}\nType: ${f.type}\n\nProblem / opportunity:\n${f.problem || "—"}\n\nTarget users:\n${f.users || "—"}\n\nMust-have features:\n${f.features || "—"}\n\nBudget range: ${f.budget || "—"}\nTimeline: ${f.timeline || "—"}\n\nSuccess looks like:\n${f.success || "—"}\n\n— Generated with DoyinTech Tools`;

  return (
    <div className={box}>
      {!done ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["name", "Your name"],
                ["business", "Business name"],
                ["budget", "Budget range"],
                ["timeline", "Timeline"],
              ] as const
            ).map(([k, ph]) => (
              <input
                key={k}
                className={input}
                placeholder={ph}
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            ))}
          </div>
          <select
            className={input}
            value={f.type}
            onChange={(e) => setF({ ...f, type: e.target.value })}
          >
            {["Website", "Mobile app", "Web app", "Automation", "Other"].map((t) => (
              <option key={t} className="bg-black">
                {t}
              </option>
            ))}
          </select>
          {(
            [
              ["problem", "What problem should this solve?"],
              ["users", "Who will use it?"],
              ["features", "Must-have features (bullet list)"],
              ["success", "How will you know it succeeded?"],
            ] as const
          ).map(([k, ph]) => (
            <textarea
              key={k}
              className={input + " resize-none"}
              rows={3}
              placeholder={ph}
              value={f[k]}
              onChange={(e) => setF({ ...f, [k]: e.target.value })}
            />
          ))}
          <button
            type="button"
            className={btn}
            onClick={() => {
              trackToolEvent("project_brief_completed");
              setDone(true);
            }}
          >
            Generate brief
          </button>
        </>
      ) : (
        <>
          <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">
            {brief}
          </pre>
          <ShareActions
            tool="project-brief"
            shareText={brief.slice(0, 400)}
            onRestart={() => setDone(false)}
          />
          <button type="button" className={btn} onClick={() => window.print()}>
            Print / PDF
          </button>
          <LeadForm
            tool="Project Brief Generator"
            resultSummary={f.type}
            defaultMessage={`Hi DoyinTech, here is my project brief.\n\n${brief}`}
          />
        </>
      )}
    </div>
  );
}

// ——— Tech stack ———
export function TechStackTool() {
  const [product, setProduct] = useState("business-website");
  const [audience, setAudience] = useState("Nigerian customers");
  const [budget, setBudget] = useState<"low" | "medium" | "high">("medium");
  const [timeline, setTimeline] = useState<"fast" | "normal" | "flexible">("normal");
  const [needs, setNeeds] = useState<string[]>(["payments"]);
  const [done, setDone] = useState(false);
  const result = useMemo(
    () =>
      adviseStack({
        product,
        audience,
        budget,
        timeline,
        team: "small",
        needs,
      }),
    [product, audience, budget, timeline, needs],
  );

  function toggle(n: string) {
    setNeeds((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  }

  const stackCards: [string, string][] = [
    ["Primary", result.primary],
    ["Mobile", result.mobile],
    ["Backend", result.backend],
    ["Database", result.db],
    ["Hosting", result.hosting],
  ];

  return (
    <div className={box}>
      {!done ? (
        <>
          <label className="block text-sm text-gray-300">
            Product type
            <select className={input + " mt-1"} value={product} onChange={(e) => setProduct(e.target.value)}>
              {["business-website", "online-store", "mobile-app", "school-portal", "booking-system", "internal-tool"].map((p) => (
                <option key={p} className="bg-black" value={p}>{p.replace(/-/g, " ")}</option>
              ))}
            </select>
          </label>
          <input className={input} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
          <div className="flex flex-wrap gap-2">
            {(["low", "medium", "high"] as const).map((b) => (
              <button key={b} type="button" className={chip(budget === b)} onClick={() => setBudget(b)}>{b} budget</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["fast", "normal", "flexible"] as const).map((t) => (
              <button key={t} type="button" className={chip(timeline === t)} onClick={() => setTimeline(t)}>{t} timeline</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["payments", "mobile", "cms", "school", "ai", "ecommerce"].map((n) => (
              <button key={n} type="button" className={chip(needs.includes(n))} onClick={() => toggle(n)}>{n}</button>
            ))}
          </div>
          <button type="button" className={btn} onClick={() => { trackToolEvent("tech_stack_completed"); setDone(true); }}>Get recommendation</button>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-400">{result.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {stackCards.map(([l, v]) => (
              <div key={l} className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[11px] uppercase text-gray-500">{l}</p>
                <p className="text-sm text-white">{v}</p>
              </div>
            ))}
          </div>
          {result.extras.length > 0 && (
            <ul className="space-y-1 text-sm text-gray-300">
              {result.extras.map((e) => (
                <li key={e.name}>• <strong className="text-white">{e.name}</strong> — {e.why}</li>
              ))}
            </ul>
          )}
          <ShareActions tool="tech-stack" shareText={result.summary} onRestart={() => setDone(false)} />
          <LeadForm tool="Tech Stack Advisor" resultSummary={result.primary} defaultMessage={`Hi DoyinTech, stack advice: ${result.summary}`} />
        </>
      )}
    </div>
  );
}

// ——— Hosting ———
export function HostingPlannerTool() {
  const [traffic, setTraffic] = useState<"low" | "medium" | "high">("low");
  const [type, setType] = useState<"static" | "business" | "app">("business");
  const [email, setEmail] = useState(true);
  const [done, setDone] = useState(false);
  const r = planHosting({ traffic, type, email, ssl: true });

  return (
    <div className={box}>
      {!done ? (
        <>
          <p className="text-sm text-gray-400">Site type</p>
          <div className="flex flex-wrap gap-2">
            {(["static", "business", "app"] as const).map((t) => (
              <button key={t} type="button" className={chip(type === t)} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
          <p className="text-sm text-gray-400">Expected traffic</p>
          <div className="flex flex-wrap gap-2">
            {(["low", "medium", "high"] as const).map((t) => (
              <button key={t} type="button" className={chip(traffic === t)} onClick={() => setTraffic(t)}>{t}</button>
            ))}
          </div>
          <button type="button" className={chip(email)} onClick={() => setEmail(!email)}>
            {email ? "✓ " : ""}Need business email
          </button>
          <button type="button" className={btn} onClick={() => setDone(true)}>Estimate yearly cost</button>
        </>
      ) : (
        <>
          <h3 className="font-display text-2xl font-bold text-white">
            {formatNgn(r.yearlyMin)} – {formatNgn(r.yearlyMax)}
            <span className="text-sm font-normal text-gray-400"> / year (est.)</span>
          </h3>
          <p className="text-sm text-gray-400">Domain ~ {formatNgn(r.domainMin)}–{formatNgn(r.domainMax)} · Hosting ~ {formatNgn(r.hostMin)}–{formatNgn(r.hostMax)}</p>
          <ul className="text-sm text-gray-300 space-y-1">{r.notes.map((n) => <li key={n}>• {n}</li>)}</ul>
          <ShareActions tool="hosting-planner" shareText={`Hosting estimate: ${formatNgn(r.yearlyMin)}–${formatNgn(r.yearlyMax)}/yr`} onRestart={() => setDone(false)} />
          <LeadForm tool="Hosting Planner" resultSummary={`${formatNgn(r.yearlyMin)}-${formatNgn(r.yearlyMax)}`} />
        </>
      )}
    </div>
  );
}

// ——— ROI ———
export function RoiTool() {
  const [investment, setInvestment] = useState(500000);
  const [customers, setCustomers] = useState(20);
  const [avg, setAvg] = useState(25000);
  const [boost, setBoost] = useState(15);
  const [done, setDone] = useState(false);
  const r = calcRoi({ investment, monthlyCustomers: customers, avgValue: avg, conversionBoost: boost });

  return (
    <div className={box}>
      {!done ? (
        <>
          {[
            ["Website investment (₦)", investment, setInvestment],
            ["Monthly customers (current)", customers, setCustomers],
            ["Average order / job value (₦)", avg, setAvg],
            ["Expected lift from better site (%)", boost, setBoost],
          ].map(([label, val, set]) => (
            <label key={label as string} className="block text-sm text-gray-300">
              {label as string}
              <input type="number" className={input + " mt-1"} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value) || 0)} />
            </label>
          ))}
          <button type="button" className={btn} onClick={() => setDone(true)}>Calculate ROI</button>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Est. monthly gain" value={formatNgn(r.monthlyGain)} />
            <Stat label="Est. yearly gain" value={formatNgn(r.yearlyGain)} />
            <Stat label="ROI (year 1)" value={`${r.roi}%`} />
            <Stat label="Payback" value={r.paybackMonths ? `${r.paybackMonths} months` : "N/A"} />
          </div>
          <p className="text-xs text-gray-500">Illustrative model only — not financial advice.</p>
          <ShareActions tool="roi" shareText={`Website ROI estimate: ${r.roi}% year one`} onRestart={() => setDone(false)} />
          <LeadForm tool="ROI Calculator" resultSummary={`${r.roi}%`} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-[11px] uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

// ——— Invoice ———
export function InvoiceTool() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [item, setItem] = useState("Web development services");
  const [amount, setAmount] = useState(150000);
  const [note, setNote] = useState("Thank you for your business.");

  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2 print:hidden">
        <input className={input} placeholder="From (your name/business)" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className={input} placeholder="Bill to" value={to} onChange={(e) => setTo(e.target.value)} />
        <input className={input} placeholder="Line item" value={item} onChange={(e) => setItem(e.target.value)} />
        <input type="number" className={input} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} />
        <input className={input + " sm:col-span-2"} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="rounded-2xl bg-white p-6 text-gray-900" id="invoice-print">
        <p className="text-xs text-gray-500">INVOICE / QUOTE</p>
        <h3 className="text-xl font-bold">{from || "Your business"}</h3>
        <p className="mt-2 text-sm">Bill to: <strong>{to || "Client"}</strong></p>
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-sm">
          <span>{item}</span>
          <strong>{formatNgn(amount)}</strong>
        </div>
        <p className="mt-6 text-sm text-gray-600">{note}</p>
        <p className="mt-8 text-[10px] text-gray-400">Created with {TOOLS_CONFIG.brand} Tools</p>
      </div>
      <button type="button" className={btn + " print:hidden"} onClick={() => window.print()}>Print / Save PDF</button>
      <div className="print:hidden">
        <LeadForm tool="Invoice Generator" />
      </div>
    </div>
  );
}

// ——— WhatsApp checklist ———
export function WhatsAppChecklistTool() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">{done} / {WA_CHECKLIST.length} complete</p>
      <ul className="space-y-2">
        {WA_CHECKLIST.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm ${checked[i] ? "border-primary/40 bg-primary/10 text-white" : "border-white/10 text-gray-300"}`}
            >
              <span>{checked[i] ? "✓" : "○"}</span>
              <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>
      <LeadForm tool="WhatsApp Checklist" resultSummary={`${done}/${WA_CHECKLIST.length}`} defaultMessage="Hi DoyinTech, I used the WhatsApp Business checklist and want help setting up customer chat / chatbot." />
    </div>
  );
}

// ——— Maintenance ———
export function MaintenanceTool() {
  const [updates, setUpdates] = useState<"rare" | "monthly" | "weekly">("monthly");
  const [critical, setCritical] = useState(false);
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [done, setDone] = useState(false);
  const r = pickMaintenance({ updates, critical, size });

  return (
    <div className={box}>
      {!done ? (
        <>
          <p className="text-sm text-gray-400">How often does content change?</p>
          <div className="flex flex-wrap gap-2">{(["rare", "monthly", "weekly"] as const).map((u) => (
            <button key={u} type="button" className={chip(updates === u)} onClick={() => setUpdates(u)}>{u}</button>
          ))}</div>
          <p className="text-sm text-gray-400">Site size</p>
          <div className="flex flex-wrap gap-2">{(["small", "medium", "large"] as const).map((s) => (
            <button key={s} type="button" className={chip(size === s)} onClick={() => setSize(s)}>{s}</button>
          ))}</div>
          <button type="button" className={chip(critical)} onClick={() => setCritical(!critical)}>{critical ? "✓ " : ""}Downtime is critical for revenue</button>
          <button type="button" className={btn} onClick={() => setDone(true)}>Recommend plan</button>
        </>
      ) : (
        <>
          <h3 className="font-display text-2xl font-bold text-white">{r.plan}</h3>
          <p className="text-primary font-semibold">{r.range}</p>
          <ul className="text-sm text-gray-300 space-y-1">{r.includes.map((i) => <li key={i}>• {i}</li>)}</ul>
          <ShareActions tool="maintenance" shareText={`Suggested plan: ${r.plan} (${r.range})`} onRestart={() => setDone(false)} />
          <LeadForm tool="Maintenance Picker" resultSummary={r.plan} />
        </>
      )}
    </div>
  );
}

// ——— Email signature ———
export function EmailSignatureTool() {
  const [n, setN] = useState("");
  const [t, setT] = useState("");
  const [c, setC] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const [w, setW] = useState("");

  const html = `${n || "Your Name"}${t ? " | " + t : ""}${c ? "\n" + c : ""}\n${[p, e, w].filter(Boolean).join(" · ")}`;

  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={input} placeholder="Full name" value={n} onChange={(e) => setN(e.target.value)} />
        <input className={input} placeholder="Title" value={t} onChange={(e) => setT(e.target.value)} />
        <input className={input} placeholder="Company" value={c} onChange={(e) => setC(e.target.value)} />
        <input className={input} placeholder="Phone" value={p} onChange={(e) => setP(e.target.value)} />
        <input className={input} placeholder="Email" value={e} onChange={(e) => setE(e.target.value)} />
        <input className={input} placeholder="Website" value={w} onChange={(e) => setW(e.target.value)} />
      </div>
      <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200 whitespace-pre-wrap">{html}</div>
      <button type="button" className={btn} onClick={() => navigator.clipboard.writeText(html)}>Copy signature</button>
      <LeadForm tool="Email Signature" />
    </div>
  );
}

// ——— Salary ———
export function SalaryTool() {
  const [role, setRole] = useState("backend");
  const [level, setLevel] = useState("mid");
  const [done, setDone] = useState(false);
  const r = estimateSalary(role, level);

  return (
    <div className={box}>
      {!done ? (
        <>
          <div className="flex flex-wrap gap-2">{["frontend", "backend", "mobile", "fullstack"].map((x) => (
            <button key={x} type="button" className={chip(role === x)} onClick={() => setRole(x)}>{x}</button>
          ))}</div>
          <div className="flex flex-wrap gap-2">{["junior", "mid", "senior"].map((x) => (
            <button key={x} type="button" className={chip(level === x)} onClick={() => setLevel(x)}>{x}</button>
          ))}</div>
          <button type="button" className={btn} onClick={() => setDone(true)}>Show ranges</button>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-400 capitalize">{level} {role}</p>
          <p className="font-display text-2xl font-bold text-white">{formatNgn(r.monthlyMin)} – {formatNgn(r.monthlyMax)} <span className="text-sm font-normal text-gray-400">/ month</span></p>
          <p className="text-sm text-gray-300">Freelance day rate (est.): {formatNgn(r.dayMin)} – {formatNgn(r.dayMax)}</p>
          <p className="text-xs text-gray-500">{r.disclaimer}</p>
          <ShareActions tool="salary" shareText={`${level} ${role}: ${formatNgn(r.monthlyMin)}–${formatNgn(r.monthlyMax)}/mo`} onRestart={() => setDone(false)} />
          <LeadForm tool="Salary Calculator" resultSummary={`${role}/${level}`} />
        </>
      )}
    </div>
  );
}

// ——— Skill gap ———
export function SkillGapTool() {
  const [track, setTrack] = useState("backend");
  const [known, setKnown] = useState("");
  const [done, setDone] = useState(false);
  const r = skillGap(
    track,
    known.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
  );

  return (
    <div className={box}>
      {!done ? (
        <>
          <div className="flex flex-wrap gap-2">{Object.keys(SKILL_TRACKS).map((t) => (
            <button key={t} type="button" className={chip(track === t)} onClick={() => setTrack(t)}>{t}</button>
          ))}</div>
          <textarea className={input + " resize-none"} rows={3} placeholder="Skills you already have (comma-separated)" value={known} onChange={(e) => setKnown(e.target.value)} />
          <button type="button" className={btn} onClick={() => setDone(true)}>Check gaps</button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-white">Prioritise next</p>
          <ul className="text-sm text-amber-200/90 space-y-1">{(r.missingMust.length ? r.missingMust : ["Core must-haves look covered"]).map((s) => <li key={s}>• {s}</li>)}</ul>
          <p className="text-sm font-semibold text-white pt-2">Then learn</p>
          <ul className="text-sm text-gray-300 space-y-1">{r.missingShould.map((s) => <li key={s}>• {s}</li>)}</ul>
          <p className="text-xs text-gray-500">Explore structured learning at DoyinTech Academy.</p>
          <ShareActions tool="skill-gap" shareText={`Skill gap (${track}): focus on ${r.missingMust.slice(0, 3).join(", ")}`} onRestart={() => setDone(false)} />
          <LeadForm tool="Skill Gap Checker" resultSummary={track} defaultMessage={`Hi DoyinTech, I checked skill gaps for ${track}. I want learning or mentorship guidance.`} />
        </>
      )}
    </div>
  );
}

// ——— Cover letter ———
export function CoverLetterTool() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [pitch, setPitch] = useState("");
  const [done, setDone] = useState(false);
  const letter = `Dear Hiring Manager,\n\nI am writing to apply for the ${role || "[Role]"} position at ${company || "[Company]"}. ${pitch || "I bring relevant skills and a strong interest in contributing to your team."}\n\nI would welcome the opportunity to discuss how I can support your goals.\n\nKind regards,\n${name || "[Your name]"}`;

  return (
    <div className={box}>
      {!done ? (
        <>
          <input className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <input className={input} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <textarea className={input + " resize-none"} rows={4} placeholder="Your pitch (real achievements only)" value={pitch} onChange={(e) => setPitch(e.target.value)} />
          <button type="button" className={btn} onClick={() => setDone(true)}>Generate draft</button>
        </>
      ) : (
        <>
          <pre className="whitespace-pre-wrap text-sm text-gray-200">{letter}</pre>
          <ShareActions tool="cover-letter" shareText={letter.slice(0, 300)} onRestart={() => setDone(false)} />
          <button type="button" className={btn} onClick={() => navigator.clipboard.writeText(letter)}>Copy</button>
          <LeadForm tool="Cover Letter" />
        </>
      )}
    </div>
  );
}

// ——— Project ideas ———
export function ProjectIdeasTool() {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const ideas = PROJECT_IDEAS[level];
  return (
    <div className={box}>
      <div className="flex flex-wrap gap-2">{(["beginner", "intermediate", "advanced"] as const).map((l) => (
        <button key={l} type="button" className={chip(level === l)} onClick={() => setLevel(l)}>{l}</button>
      ))}</div>
      <ul className="space-y-2 text-sm text-gray-300">
        {ideas.map((i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">• {i}</li>
        ))}
      </ul>
      <LeadForm tool="Project Ideas" resultSummary={level} defaultMessage="Hi DoyinTech, I want mentorship building portfolio projects." />
    </div>
  );
}

// ——— Interview ———
export function InterviewTool() {
  const [role, setRole] = useState("backend");
  const [i, setI] = useState(0);
  const qs = INTERVIEW_Q[role] || INTERVIEW_Q.general;
  return (
    <div className={box}>
      <div className="flex flex-wrap gap-2">{Object.keys(INTERVIEW_Q).map((r) => (
        <button key={r} type="button" className={chip(role === r)} onClick={() => { setRole(r); setI(0); }}>{r}</button>
      ))}</div>
      <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
        <p className="text-xs text-primary">Question {i + 1} / {qs.length}</p>
        <p className="mt-2 text-lg text-white">{qs[i]}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" className="rounded-xl border border-white/15 px-4 py-2 text-xs text-gray-300" disabled={i === 0} onClick={() => setI((x) => x - 1)}>Previous</button>
        <button type="button" className={btn} disabled={i >= qs.length - 1} onClick={() => setI((x) => x + 1)}>Next</button>
      </div>
      <LeadForm tool="Interview Practice" resultSummary={role} />
    </div>
  );
}

// ——— AI use case ———
export function AiUseCaseTool() {
  const [industry, setIndustry] = useState("services");
  const ideas = aiUseCases(industry);
  return (
    <div className={box}>
      <div className="flex flex-wrap gap-2">{["retail", "education", "services", "hospitality", "other"].map((x) => (
        <button key={x} type="button" className={chip(industry === x)} onClick={() => setIndustry(x)}>{x}</button>
      ))}</div>
      <ul className="space-y-2 text-sm text-gray-300">
        {ideas.map((idea) => (
          <li key={idea} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">• {idea}</li>
        ))}
      </ul>
      <LeadForm tool="AI Use-Case Finder" resultSummary={industry} defaultMessage={`Hi DoyinTech, industry: ${industry}. I want to explore AI automation.`} />
    </div>
  );
}

// ——— Chatbot script ———
export function ChatbotScriptTool() {
  const [biz, setBiz] = useState("");
  const [hours, setHours] = useState("Mon–Fri 9am–5pm");
  const [done, setDone] = useState(false);
  const script = `WELCOME\nHi! Welcome to ${biz || "our business"}. How can we help today?\n\nQUICK REPLIES\n1. Prices\n2. Location\n3. Opening hours\n4. Talk to a human\n\nHOURS\nWe are available ${hours}. Outside these hours, leave a message and we will reply soon.\n\nPRICES\nShare a short price list or say: "Tell us what you need and we will send options."\n\nHANDOFF\nConnecting you to the team — please share your name and WhatsApp number.`;

  return (
    <div className={box}>
      {!done ? (
        <>
          <input className={input} placeholder="Business name" value={biz} onChange={(e) => setBiz(e.target.value)} />
          <input className={input} placeholder="Opening hours" value={hours} onChange={(e) => setHours(e.target.value)} />
          <button type="button" className={btn} onClick={() => setDone(true)}>Generate script</button>
        </>
      ) : (
        <>
          <pre className="whitespace-pre-wrap text-sm text-gray-200">{script}</pre>
          <ShareActions tool="chatbot-script" shareText={script.slice(0, 300)} onRestart={() => setDone(false)} />
          <button type="button" className={btn} onClick={() => navigator.clipboard.writeText(script)}>Copy script</button>
          <LeadForm tool="Chatbot Script" resultSummary={biz} defaultMessage="Hi DoyinTech, I generated a chatbot script and want it implemented on web/WhatsApp." />
        </>
      )}
    </div>
  );
}

// ——— QR (uses free API image) ———
export function QrTool() {
  const [text, setText] = useState("https://doyintech.vercel.app");
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(text || "https://doyintech.vercel.app")}`;
  return (
    <div className={box}>
      <input className={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="URL or text" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="QR code" width={220} height={220} className="rounded-xl border border-white/10 bg-white p-2" />
      <p className="text-xs text-gray-500">Tip: use a WhatsApp link wa.me/234… for contact QR codes.</p>
      <LeadForm tool="QR Generator" />
    </div>
  );
}

// ——— Password ———
export function PasswordTool() {
  const [len, setLen] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState("");
  return (
    <div className={box}>
      <label className="block text-sm text-gray-300">Length: {len}
        <input type="range" min={8} max={32} value={len} onChange={(e) => setLen(Number(e.target.value))} className="mt-2 w-full accent-primary" />
      </label>
      <button type="button" className={chip(symbols)} onClick={() => setSymbols(!symbols)}>{symbols ? "✓ " : ""}Include symbols</button>
      <button type="button" className={btn} onClick={() => setPwd(generatePassword(len, symbols))}>Generate</button>
      {pwd && (
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-primary">{pwd}</code>
          <button type="button" className="text-xs text-gray-300 underline" onClick={() => navigator.clipboard.writeText(pwd)}>Copy</button>
        </div>
      )}
      <p className="text-xs text-gray-500">Generated in your browser — nothing is sent to our servers.</p>
    </div>
  );
}
