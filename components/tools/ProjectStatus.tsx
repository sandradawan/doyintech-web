"use client";

import { useEffect, useMemo, useState } from "react";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

const STAGES = [
  "Discovery",
  "In progress",
  "Review",
  "Done",
] as const;

type Stage = (typeof STAGES)[number];

const field =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";

const STORAGE = "doyintech_project_status_v1";

export default function ProjectStatus() {
  const [code, setCode] = useState(() => `PRJ-${String(Date.now()).slice(-6)}`);
  const [project, setProject] = useState("");
  const [client, setClient] = useState("");
  const [stage, setStage] = useState<Stage>("In progress");
  const [progress, setProgress] = useState(45);
  const [lastUpdate, setLastUpdate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [summary, setSummary] = useState("Design approved. Development in progress on core pages.");
  const [nextStep, setNextStep] = useState("Complete checkout integration and internal QA.");
  const [blockers, setBlockers] = useState("Waiting on final logo files from client.");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.code) setCode(d.code);
        if (d.project) setProject(d.project);
        if (d.client) setClient(d.client);
        if (d.stage) setStage(d.stage);
        if (typeof d.progress === "number") setProgress(d.progress);
        if (d.summary) setSummary(d.summary);
        if (d.nextStep) setNextStep(d.nextStep);
        if (d.blockers) setBlockers(d.blockers);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE,
        JSON.stringify({ code, project, client, stage, progress, summary, nextStep, blockers, lastUpdate }),
      );
    } catch {
      /* ignore */
    }
  }, [code, project, client, stage, progress, summary, nextStep, blockers, lastUpdate]);

  const stageIndex = STAGES.indexOf(stage);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const q = new URLSearchParams({
      code,
      project,
      client,
      stage,
      progress: String(progress),
      summary,
      next: nextStep,
      blockers,
      updated: lastUpdate,
    });
    return `${window.location.origin}/tools/project-status?${q.toString()}`;
  }, [code, project, client, stage, progress, summary, nextStep, blockers, lastUpdate]);

  // Hydrate from URL when client opens shared link
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (!q.get("code")) return;
    setCode(q.get("code") || code);
    setProject(q.get("project") || "");
    setClient(q.get("client") || "");
    const s = q.get("stage") as Stage | null;
    if (s && STAGES.includes(s)) setStage(s);
    setProgress(Number(q.get("progress") || 0));
    setSummary(q.get("summary") || "");
    setNextStep(q.get("next") || "");
    setBlockers(q.get("blockers") || "");
    setLastUpdate(q.get("updated") || lastUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePrint() {
    document.body.classList.add("printing-doc");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-doc"), 500);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Status link copied. Share it with your client.");
    } catch {
      alert("Could not copy. Copy the URL from the address bar after saving.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="doc-no-print space-y-4 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <p className="text-sm text-gray-400">
          Update status for a client project, then share the link or print a status sheet. Clients see progress without endless "any update?" messages.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={field} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Project code" />
          <input className={field} value={project} onChange={(e) => setProject(e.target.value)} placeholder="Project name" />
          <input className={field} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client name" />
          <input type="date" className={field} value={lastUpdate} onChange={(e) => setLastUpdate(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                stage === s ? "border-primary bg-primary/20 text-white" : "border-white/10 text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="block text-sm text-gray-300">
          Progress: {progress}%
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="mt-2 w-full accent-primary" />
        </label>
        <textarea className={field + " resize-none"} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Latest update summary" />
        <textarea className={field + " resize-none"} rows={2} value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Next step" />
        <textarea className={field + " resize-none"} rows={2} value={blockers} onChange={(e) => setBlockers(e.target.value)} placeholder="Blockers (or None)" />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={copyLink} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
            Copy client link
          </button>
          <button type="button" onClick={handlePrint} className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
            Print status
          </button>
        </div>
      </div>

      <div id="doc-sheet" className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl">
        <div className="border-b-4 border-blue-600 px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Project status</p>
          <h2 className="mt-1 text-2xl font-bold">{project || "Project name"}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {client || "Client"} · Code {code} · Updated {lastUpdate}
          </p>
        </div>
        <div className="px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s, i) => (
              <div
                key={s}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  i <= stageIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{progress}% complete · {stage}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[11px] font-semibold uppercase text-gray-400">Latest update</p>
              <p className="mt-2 text-sm text-gray-700">{summary || "—"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[11px] font-semibold uppercase text-gray-400">Next step</p>
              <p className="mt-2 text-sm text-gray-700">{nextStep || "—"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[11px] font-semibold uppercase text-gray-400">Blockers</p>
              <p className="mt-2 text-sm text-gray-700">{blockers || "None"}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-8 py-4 text-center text-[10px] text-gray-400">
          Powered by {TOOLS_CONFIG.brand} · {TOOLS_CONFIG.siteUrl}/tools/project-status
        </div>
      </div>

      <div className="doc-no-print">
        <LeadForm tool="Project Status" resultSummary={`${code} ${stage}`} />
      </div>
    </div>
  );
}
