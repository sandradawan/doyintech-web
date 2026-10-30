"use client";

import { useEffect, useMemo, useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";

type Kind = "application" | "resignation" | "leave" | "siwes";

const KINDS: { id: Kind; label: string }[] = [
  { id: "application", label: "Job application" },
  { id: "resignation", label: "Resignation" },
  { id: "leave", label: "Leave request" },
  { id: "siwes", label: "SIWES / IT placement" },
];

const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";
const label = "block text-[12px] text-[#a1a1a6]";
const STORAGE = "doyintech_letter_sender_v1";

const longDate = (iso: string) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
const today = () => new Date().toISOString().slice(0, 10);

type Sender = { name: string; address: string; phone: string; email: string };
type Recipient = { name: string; title: string; org: string; address: string };
type Extra = Record<string, string>;

function compose(kind: Kind, s: Sender, r: Recipient, x: Extra) {
  const to = r.name ? `Dear ${r.name},` : "Dear Sir/Madam,";
  const org = r.org || "your organisation";
  switch (kind) {
    case "application":
      return {
        subject: `APPLICATION FOR THE POSITION OF ${(x.role || "[ROLE]").toUpperCase()}`,
        salutation: to,
        body: [
          `I am writing to apply for the position of ${x.role || "[role]"} at ${org}${x.source ? `, as advertised on ${x.source}` : ""}.`,
          `${x.background || "I have [number] years of experience in [field], where I [key achievement]."} ${x.skills ? `My key strengths include ${x.skills}.` : ""}`.trim(),
          `I am confident that my skills and commitment will add value to ${org}, and I would welcome the opportunity to discuss how I can contribute. My CV is attached for your review.`,
          `Thank you for considering my application. I look forward to hearing from you.`,
        ],
        closing: "Yours faithfully,",
      };
    case "resignation":
      return {
        subject: "LETTER OF RESIGNATION",
        salutation: to,
        body: [
          `Please accept this letter as formal notice of my resignation from my position as ${x.role || "[role]"} at ${org}. My last working day will be ${longDate(x.lastDay) || "[date]"}${x.notice ? `, in line with my ${x.notice} notice period` : ""}.`,
          x.reason ? `${x.reason}` : `This was not an easy decision, and I am grateful for the opportunities I have had to grow here.`,
          `I am committed to a smooth handover and will do everything I can to complete outstanding work and hand over my responsibilities before I leave.`,
          `Thank you for your support and guidance during my time at ${org}.`,
        ].filter(Boolean),
        closing: "Yours sincerely,",
      };
    case "leave":
      return {
        subject: `REQUEST FOR ${(x.leaveType || "ANNUAL").toUpperCase()} LEAVE`,
        salutation: to,
        body: [
          `I write to request ${(x.leaveType || "annual").toLowerCase()} leave from ${longDate(x.start) || "[start date]"} to ${longDate(x.end) || "[end date]"}${x.reason ? ` ${x.reason.trim().replace(/.$/, "")}` : ""}.`,
          x.handover
            ? `During my absence, ${x.handover} has agreed to handle my duties, and I will ensure all urgent tasks are completed before I go.`
            : `I will ensure all urgent tasks are completed and my duties are handed over before I go.`,
          `I will resume on ${longDate(x.resume) || "[resumption date]"}. Thank you for considering my request.`,
        ],
        closing: "Yours faithfully,",
      };
    case "siwes":
      return {
        subject: "APPLICATION FOR INDUSTRIAL TRAINING (SIWES) PLACEMENT",
        salutation: to,
        body: [
          `I am a ${x.level || "[level]"} student of ${x.course || "[course]"} at ${x.school || "[institution]"}, and I am writing to request a placement at ${org} for my Students Industrial Work Experience Scheme (SIWES).`,
          `The programme lasts ${x.duration || "[duration]"}${x.startDate ? `, starting from ${longDate(x.startDate)}` : ""}. It is a requirement for my degree and an opportunity to apply what I have learnt in a real working environment.`,
          `${x.interest ? `I am particularly interested in ${x.interest}, and I` : "I"} would be grateful for the chance to learn from your team. I am hardworking, punctual and eager to contribute. My school's introduction letter and my CV are attached.`,
          `Thank you for considering my application.`,
        ],
        closing: "Yours faithfully,",
      };
  }
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Formal Nigerian-style letters: fill a few fields, edit the wording, then print or save as PDF. */
export default function LetterGenerator() {
  const [kind, setKind] = useState<Kind>("application");
  const [sender, setSender] = useState<Sender>({ name: "", address: "", phone: "", email: "" });
  const [rec, setRec] = useState<Recipient>({ name: "", title: "", org: "", address: "" });
  const [x, setX] = useState<Extra>({});
  const [date, setDate] = useState(today);
  const [edited, setEdited] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the sender block saved on this device
      if (saved) setSender(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(sender));
    } catch {
      /* ignore */
    }
  }, [sender]);

  const letter = useMemo(() => compose(kind, sender, rec, x), [kind, sender, rec, x]);
  const generatedBody = letter.body.join("\n\n");
  const body = edited ?? generatedBody;

  function setExtra(k: string, v: string) {
    setX((p) => ({ ...p, [k]: v }));
    setEdited(null);
  }

  function print() {
    const lines = (arr: string[]) => arr.filter(Boolean).map(esc).join("<br/>");
    const html = `<div style="max-width:680px;margin:40px auto;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:#111">
      <div style="text-align:right">${lines([sender.name, sender.address, sender.phone, sender.email])}<br/><br/>${esc(longDate(date))}</div>
      <div style="margin-top:24px">${lines([rec.name, rec.title, rec.org, rec.address])}</div>
      <p style="margin-top:24px">${esc(letter.salutation)}</p>
      <p style="font-weight:bold;text-decoration:underline">${esc(letter.subject)}</p>
      ${body.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`).join("")}
      <p style="margin-top:24px">${esc(letter.closing)}</p>
      <p style="margin-top:48px">____________________<br/>${esc(sender.name || "")}</p>
    </div>`;
    printHtml(letter.subject.slice(0, 60), html);
  }

  const extraFields: Record<Kind, [string, string, string?][]> = {
    application: [
      ["role", "Position"],
      ["source", "Where you saw it (optional)", "LinkedIn, Jobberman, a referral"],
      ["background", "Your experience in one or two sentences"],
      ["skills", "Key skills (optional)", "customer service, Excel, sales"],
    ],
    resignation: [
      ["role", "Your position"],
      ["lastDay", "Last working day", "date"],
      ["notice", "Notice period (optional)", "one month"],
      ["reason", "A sentence on why (optional)"],
    ],
    leave: [
      ["leaveType", "Type of leave", "Annual, sick, maternity, casual"],
      ["start", "Start date", "date"],
      ["end", "End date", "date"],
      ["resume", "Resumption date", "date"],
      ["reason", "Reason (optional)", "to attend a family wedding in Enugu"],
      ["handover", "Who covers for you (optional)", "Mr. Bello Musa"],
    ],
    siwes: [
      ["school", "Your institution"],
      ["course", "Course of study"],
      ["level", "Level", "300 level"],
      ["duration", "Duration", "six months"],
      ["startDate", "Start date", "date"],
      ["interest", "Area of interest (optional)", "network administration"],
    ],
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-[#141a28] p-5">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => {
                setKind(k.id);
                setEdited(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${kind === k.id ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8]"}`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {extraFields[kind].map(([k, l, hint]) => (
            <label key={k} className={label}>
              {l}
              <input
                className={field}
                type={hint === "date" ? "date" : "text"}
                value={x[k] || ""}
                placeholder={hint && hint !== "date" ? hint : undefined}
                onChange={(e) => setExtra(k, e.target.value)}
              />
            </label>
          ))}
        </div>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 text-[13px] font-semibold text-white">To</legend>
          {(
            [
              ["name", "Name (optional)", "The Head of Human Resources"],
              ["title", "Title (optional)"],
              ["org", "Organisation"],
              ["address", "Address"],
            ] as const
          ).map(([k, l, hint]) => (
            <label key={k} className={label}>
              {l}
              <input className={field} value={rec[k]} placeholder={hint} onChange={(e) => {
                  setRec((r) => ({ ...r, [k]: e.target.value }));
                  setEdited(null);
                }}
              />
            </label>
          ))}
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 text-[13px] font-semibold text-white">From (saved on this device)</legend>
          {(
            [
              ["name", "Your full name"],
              ["address", "Your address"],
              ["phone", "Phone"],
              ["email", "Email"],
            ] as const
          ).map(([k, l]) => (
            <label key={k} className={label}>
              {l}
              <input className={field} value={sender[k]} onChange={(e) => setSender((s) => ({ ...s, [k]: e.target.value }))} />
            </label>
          ))}
          <label className={label}>
            Date
            <input className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </fieldset>
      </div>

      <div className="h-fit space-y-3 lg:sticky lg:top-24">
        <div className="rounded-2xl bg-white p-6 font-serif text-[14px] leading-relaxed text-[#111] shadow-xl">
          <p className="whitespace-pre-line text-right text-[13px]">
            {[sender.name, sender.address, sender.phone, sender.email].filter(Boolean).join("\n")}
            {"\n\n"}
            {longDate(date)}
          </p>
          <p className="mt-4 whitespace-pre-line text-[13px]">{[rec.name, rec.title, rec.org, rec.address].filter(Boolean).join("\n")}</p>
          <p className="mt-4">{letter.salutation}</p>
          <p className="mt-2 font-bold underline">{letter.subject}</p>
          <textarea
            value={body}
            onChange={(e) => setEdited(e.target.value)}
            aria-label="Letter body (editable)"
            rows={14}
            className="mt-2 w-full resize-y rounded-md border border-dashed border-black/15 bg-transparent p-2 font-serif text-[14px] leading-relaxed outline-none focus:border-[#ff8c14]"
          />
          <p className="mt-2">{letter.closing}</p>
          <p className="mt-6">{sender.name || "Your name"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={print} className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            Print / Save PDF
          </button>
          {edited !== null && (
            <button type="button" onClick={() => setEdited(null)} className="text-[13px] text-[#a1a1a6] underline">
              Reset wording
            </button>
          )}
          <p className="text-[12px] text-[#86868b]">Click into the letter to edit the wording. Nothing is sent to our servers.</p>
        </div>
      </div>
    </div>
  );
}
