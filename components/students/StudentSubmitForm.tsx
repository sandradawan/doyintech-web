"use client";

import { useRef, useState } from "react";
import { shrinkImage } from "@/lib/images/shrink";

const input = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[15px] text-brand-ink outline-none focus:border-brand-link";
const label = "block text-[13px] font-medium text-brand-muted";

/** A student sends their own photo, name and school for the magazine. It goes live only after we approve it. */
export default function StudentSubmitForm() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [school, setSchool] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const photo = data.get("photo");
    if (!(photo instanceof File) || !photo.size) return setError("Choose a photo of yourself.");
    if (data.get("consent") !== "yes") return setError("Tick the box to agree to your photo being shown.");
    setState("busy");
    try {
      data.set("photo", await shrinkImage(photo, 1400));
      const res = await fetch("/api/students/spotlight", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "That didn't send. Please try again.");
      formRef.current?.reset();
      setPreview("");
      setSchool("");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-brand-link/40 bg-brand-link/10 p-6">
        <p className="text-[18px] font-semibold text-brand-ink">Thank you. We have your photo.</p>
        <p className="mt-2 text-[15px] text-brand-muted">We check each request before it goes live. Once approved, you will appear in the student magazine and the slideshow.</p>
        <button type="button" onClick={() => setState("idle")} className="mt-4 min-h-11 rounded-full border border-brand-ink/20 px-5 text-[14px] font-semibold text-brand-ink">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid gap-5 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 sm:p-6 md:grid-cols-[1fr_190px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          Your photo
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className={`${input} file:mr-3 file:rounded-full file:border-0 file:bg-brand-accent file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-black`}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : "");
            }}
          />
        </label>
        <label className={label}>
          Your name
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={input} />
        </label>
        <label className={label}>
          Your school
          <input name="school" required minLength={2} maxLength={80} placeholder="FCAHPT Vom" className={input} value={school} onChange={(e) => setSchool(e.target.value)} />
        </label>
        <label className={label}>
          What we worked on (optional)
          <input name="work" maxLength={120} placeholder="Project research and writing" className={input} />
        </label>
        <label className={label}>
          Phone or email (not shown publicly)
          <input name="contact" required minLength={5} maxLength={120} className={input} />
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label className="flex items-start gap-3 text-[14px] text-brand-soft sm:col-span-2">
          <input name="consent" type="checkbox" value="yes" required className="mt-1 h-5 w-5 shrink-0 accent-brand-link" />
          <span>I agree that DoyinTech can show my photo, name and school on its website. I can ask for it to be removed at any time.</span>
        </label>
        {error && <p role="alert" className="text-[14px] text-red-300 sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <button type="submit" disabled={state === "busy"} className="min-h-11 rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black disabled:opacity-60">
            {state === "busy" ? "Sending…" : "Send my photo"}
          </button>
        </div>
      </div>
      <div className="theme-dark flex flex-col items-center justify-center rounded-2xl bg-[#0b0b0c] p-5 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Preview</p>
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#1d1d1f] shadow-[0_0_0_4px_#0b0b0c,0_0_0_6px_#ff8c14]">
          {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the chosen file */}
          {preview && <img src={preview} alt="" className="h-full w-full object-cover object-top" />}
        </div>
        <span className="-mt-3 max-w-full truncate rounded-full bg-[#ff8c14] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-black">
          {school || "Your school"}
        </span>
      </div>
    </form>
  );
}
