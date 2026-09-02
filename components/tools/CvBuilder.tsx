"use client";

import { useEffect, useState } from "react";
import { trackToolEvent } from "@/lib/tools/analytics";
import LeadForm from "./LeadForm";

type Edu = { school: string; degree: string; field: string; years: string };
type Exp = {
  company: string;
  role: string;
  years: string;
  details: string;
};
type Project = {
  name: string;
  description: string;
  tech: string;
  url: string;
};

type CvData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string;
  education: Edu[];
  experience: Exp[];
  projects: Project[];
  template: "modern" | "professional" | "developer" | "minimal";
};

const EMPTY: CvData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  education: [{ school: "", degree: "", field: "", years: "" }],
  experience: [{ company: "", role: "", years: "", details: "" }],
  projects: [{ name: "", description: "", tech: "", url: "" }],
  template: "modern",
};

const STORAGE_KEY = "doyintech_cv_draft_v1";

export default function CvBuilder() {
  const [data, setData] = useState<CvData>(EMPTY);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    trackToolEvent("cv_started");
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  function printCv() {
    trackToolEvent("cv_completed");
    trackToolEvent("pdf_downloaded", { tool: "cv-builder" });
    window.print();
  }

  const skillsList = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-6 print:hidden">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              tab === "edit" ? "bg-primary text-white" : "bg-white/5 text-gray-400"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-full px-3 py-1 text-xs font-semibold lg:hidden ${
              tab === "preview" ? "bg-primary text-white" : "bg-white/5 text-gray-400"
            }`}
          >
            Preview
          </button>
        </div>

        {(tab === "edit" || true) && (
          <div className={`space-y-4 ${tab === "preview" ? "hidden lg:block" : ""}`}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Full name"
                value={data.fullName}
                onChange={(v) => setData({ ...data, fullName: v })}
              />
              <Field
                label="Professional title"
                value={data.title}
                onChange={(v) => setData({ ...data, title: v })}
              />
              <Field
                label="Email"
                value={data.email}
                onChange={(v) => setData({ ...data, email: v })}
              />
              <Field
                label="Phone"
                value={data.phone}
                onChange={(v) => setData({ ...data, phone: v })}
              />
              <Field
                label="Location"
                value={data.location}
                onChange={(v) => setData({ ...data, location: v })}
              />
              <Field
                label="LinkedIn"
                value={data.linkedin}
                onChange={(v) => setData({ ...data, linkedin: v })}
              />
              <Field
                label="GitHub"
                value={data.github}
                onChange={(v) => setData({ ...data, github: v })}
              />
            </div>

            <label className="block text-xs text-gray-400">
              Template
              <select
                value={data.template}
                onChange={(e) =>
                  setData({
                    ...data,
                    template: e.target.value as CvData["template"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              >
                <option value="modern">Modern</option>
                <option value="professional">Professional</option>
                <option value="developer">Developer</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>

            <label className="block text-xs text-gray-400">
              Professional summary
              <textarea
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                placeholder="Write your own summary — do not invent experience."
              />
            </label>

            <Field
              label="Skills (comma-separated)"
              value={data.skills}
              onChange={(v) => setData({ ...data, skills: v })}
            />

            <SectionTitle
              title="Experience"
              onAdd={() =>
                setData({
                  ...data,
                  experience: [
                    ...data.experience,
                    { company: "", role: "", years: "", details: "" },
                  ],
                })
              }
            />
            {data.experience.map((ex, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-white/5 p-3">
                <Field
                  label="Company"
                  value={ex.company}
                  onChange={(v) => {
                    const experience = [...data.experience];
                    experience[i] = { ...ex, company: v };
                    setData({ ...data, experience });
                  }}
                />
                <Field
                  label="Role"
                  value={ex.role}
                  onChange={(v) => {
                    const experience = [...data.experience];
                    experience[i] = { ...ex, role: v };
                    setData({ ...data, experience });
                  }}
                />
                <Field
                  label="Years"
                  value={ex.years}
                  onChange={(v) => {
                    const experience = [...data.experience];
                    experience[i] = { ...ex, years: v };
                    setData({ ...data, experience });
                  }}
                />
                <label className="block text-xs text-gray-400">
                  Responsibilities / achievements
                  <textarea
                    value={ex.details}
                    onChange={(e) => {
                      const experience = [...data.experience];
                      experience[i] = { ...ex, details: e.target.value };
                      setData({ ...data, experience });
                    }}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>
            ))}

            <SectionTitle
              title="Education"
              onAdd={() =>
                setData({
                  ...data,
                  education: [
                    ...data.education,
                    { school: "", degree: "", field: "", years: "" },
                  ],
                })
              }
            />
            {data.education.map((ed, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-white/5 p-3 sm:grid-cols-2">
                <Field
                  label="Institution"
                  value={ed.school}
                  onChange={(v) => {
                    const education = [...data.education];
                    education[i] = { ...ed, school: v };
                    setData({ ...data, education });
                  }}
                />
                <Field
                  label="Degree"
                  value={ed.degree}
                  onChange={(v) => {
                    const education = [...data.education];
                    education[i] = { ...ed, degree: v };
                    setData({ ...data, education });
                  }}
                />
                <Field
                  label="Field"
                  value={ed.field}
                  onChange={(v) => {
                    const education = [...data.education];
                    education[i] = { ...ed, field: v };
                    setData({ ...data, education });
                  }}
                />
                <Field
                  label="Years"
                  value={ed.years}
                  onChange={(v) => {
                    const education = [...data.education];
                    education[i] = { ...ed, years: v };
                    setData({ ...data, education });
                  }}
                />
              </div>
            ))}

            <SectionTitle
              title="Projects"
              onAdd={() =>
                setData({
                  ...data,
                  projects: [
                    ...data.projects,
                    { name: "", description: "", tech: "", url: "" },
                  ],
                })
              }
            />
            {data.projects.map((pr, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-white/5 p-3">
                <Field
                  label="Project name"
                  value={pr.name}
                  onChange={(v) => {
                    const projects = [...data.projects];
                    projects[i] = { ...pr, name: v };
                    setData({ ...data, projects });
                  }}
                />
                <Field
                  label="Technologies"
                  value={pr.tech}
                  onChange={(v) => {
                    const projects = [...data.projects];
                    projects[i] = { ...pr, tech: v };
                    setData({ ...data, projects });
                  }}
                />
                <Field
                  label="URL"
                  value={pr.url}
                  onChange={(v) => {
                    const projects = [...data.projects];
                    projects[i] = { ...pr, url: v };
                    setData({ ...data, projects });
                  }}
                />
                <label className="block text-xs text-gray-400">
                  Description
                  <textarea
                    value={pr.description}
                    onChange={(e) => {
                      const projects = [...data.projects];
                      projects[i] = { ...pr, description: e.target.value };
                      setData({ ...data, projects });
                    }}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={printCv}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                Download / Print CV
              </button>
            </div>

            <LeadForm
              tool="CV Builder"
              resultSummary={data.fullName || "CV draft"}
              defaultMessage="Hi DoyinTech, I used the CV Builder and would like career or portfolio website help."
            />
          </div>
        )}
      </div>

      {/* Preview / print surface */}
      <div
        className={`rounded-3xl border border-white/10 bg-white text-gray-900 shadow-xl print:border-0 print:shadow-none ${
          tab === "edit" ? "hidden lg:block" : ""
        }`}
        id="cv-preview"
      >
        <article
          className={`p-6 md:p-8 print:p-0 ${
            data.template === "minimal"
              ? ""
              : data.template === "developer"
                ? "border-l-4 border-blue-600"
                : data.template === "professional"
                  ? "font-serif"
                  : ""
          }`}
        >
          <header className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {data.fullName || "Your Name"}
            </h1>
            <p className="text-sm font-medium text-blue-700">
              {data.title || "Professional Title"}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              {[data.email, data.phone, data.location]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="text-xs text-gray-500">
              {[data.linkedin, data.github].filter(Boolean).join(" · ")}
            </p>
          </header>

          {data.summary && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Summary
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-800">
                {data.summary}
              </p>
            </section>
          )}

          {skillsList.length > 0 && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Skills
              </h2>
              <p className="mt-1 text-sm text-gray-800">{skillsList.join(" · ")}</p>
            </section>
          )}

          {data.experience.some((e) => e.company || e.role) && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Experience
              </h2>
              <div className="mt-2 space-y-3">
                {data.experience
                  .filter((e) => e.company || e.role)
                  .map((e, i) => (
                    <div key={i}>
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {e.role}
                          {e.company ? ` — ${e.company}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">{e.years}</p>
                      </div>
                      {e.details && (
                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-gray-700">
                          {e.details}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {data.education.some((e) => e.school) && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Education
              </h2>
              <div className="mt-2 space-y-2">
                {data.education
                  .filter((e) => e.school)
                  .map((e, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-semibold text-gray-900">{e.school}</p>
                      <p className="text-gray-700">
                        {[e.degree, e.field].filter(Boolean).join(", ")}
                        {e.years ? ` · ${e.years}` : ""}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {data.projects.some((p) => p.name) && (
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Projects
              </h2>
              <div className="mt-2 space-y-2">
                {data.projects
                  .filter((p) => p.name)
                  .map((p, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {p.name}
                        {p.url ? ` — ${p.url}` : ""}
                      </p>
                      {p.tech && (
                        <p className="text-xs text-blue-700">{p.tech}</p>
                      )}
                      {p.description && (
                        <p className="text-gray-700">{p.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          <p className="mt-8 text-[10px] text-gray-400 print:mt-6">
            Built with DoyinTech Tools · doyintech.vercel.app/tools
          </p>
        </article>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs text-gray-400">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-primary/50"
      />
    </label>
  );
}

function SectionTitle({
  title,
  onAdd,
}: {
  title: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs font-semibold text-primary hover:underline"
      >
        + Add
      </button>
    </div>
  );
}
