"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi, adminUpload } from "@/lib/admin/client";

type Row = { id: number; name: string; school: string; work: string; photo_url: string; banner_url: string | null; created_at: string };

const input = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link";
const label = "block text-[13px] font-medium text-brand-muted";

/** Shrinks a phone photo in the browser so the upload is small and quick. */
async function shrink(file: File, maxSide: number): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.86));
    return blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

export default function StudentSpotlightsAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [school, setSchool] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const load = useCallback(() => {
    adminApi<{ students: Row[] }>("/api/admin/student-spotlights")
      .then((d) => setRows(d.students))
      .catch((e: Error) => {
        setRows([]);
        setError(e.message);
      });
  }, []);

  useEffect(load, [load]);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    const data = new FormData(e.currentTarget);
    const photo = data.get("photo");
    const banner = data.get("banner");
    if (!(photo instanceof File) || !photo.size) return setError("Choose a photo of the student.");
    setSaving(true);
    try {
      data.set("photo", await shrink(photo, 1400));
      if (banner instanceof File && banner.size) data.set("banner", await shrink(banner, 1920));
      else data.delete("banner");
      await adminUpload("/api/admin/student-spotlights", data);
      formRef.current?.reset();
      setPreview("");
      setSchool("");
      setNotice("Added. It appears on the Students page within a minute.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Remove ${row.name || "this student"} (${row.school}) from the magazine?`)) return;
    setError("");
    try {
      await adminApi(`/api/admin/student-spotlights?id=${row.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't work.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold text-brand-ink">Student magazine</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-brand-muted">
          Add each student you have worked with. They appear in the slideshow and the e-magazine on the Students page.
          Only add students who have agreed to be shown.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[14px] text-emerald-300">{notice}</p>}

      <form ref={formRef} onSubmit={add} className="grid gap-5 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 md:grid-cols-[1fr_200px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>
            Photo of the student (required)
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
            School name tag (required)
            <input name="school" required minLength={2} maxLength={80} placeholder="FCAHPT Vom" className={input} value={school} onChange={(e) => setSchool(e.target.value)} />
          </label>
          <label className={label}>
            Student name (optional)
            <input name="name" maxLength={80} placeholder="Full name" className={input} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            What you worked on (optional)
            <input name="work" maxLength={120} placeholder="Project research and writing" className={input} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Ready-made thank-you banner, 16:9 (optional)
            <input name="banner" type="file" accept="image/jpeg,image/png,image/webp" className={`${input} file:mr-3 file:rounded-full file:border-0 file:bg-brand-ink/10 file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-brand-ink`} />
            <span className="mt-1 block text-[12px] text-brand-subtle">Leave empty and the slideshow draws the slide from the photo, name and school.</span>
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="min-h-11 rounded-full bg-brand-accent px-6 text-[14px] font-semibold text-black disabled:opacity-60">
              {saving ? "Uploading…" : "Add student"}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#093b1d] p-5 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Preview</p>
          <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#0d4a25] shadow-[0_0_0_4px_#093b1d,0_0_0_6px_#ff8c14]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the chosen file */}
            {preview && <img src={preview} alt="" className="h-full w-full object-cover object-top" />}
          </div>
          <span className="-mt-3 max-w-full truncate rounded-full bg-[#ff8c14] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-black">
            {school || "School tag"}
          </span>
        </div>
      </form>

      <section>
        <h2 className="text-[16px] font-semibold text-brand-ink">In the magazine {rows ? `(${rows.length})` : ""}</h2>
        {!rows && <p className="mt-3 text-[13px] text-brand-subtle">Loading…</p>}
        {rows && !rows.length && <p className="mt-3 text-[14px] text-brand-muted">No students added here yet. The two built-in students still show on the page.</p>}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows?.map((r) => (
            <li key={r.id} className="flex items-center gap-3 rounded-xl border border-brand-ink/10 bg-brand-surface p-3">
              <Image src={r.photo_url} alt="" width={56} height={56} unoptimized className="h-14 w-14 shrink-0 rounded-full object-cover object-top" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-brand-ink">{r.name || "No name"}</p>
                <p className="truncate text-[12px] font-semibold uppercase tracking-wide text-brand-link">{r.school}</p>
                <p className="truncate text-[12px] text-brand-subtle">{r.work || "No work added"}{r.banner_url ? " · has banner" : ""}</p>
              </div>
              <button type="button" onClick={() => remove(r)} className="min-h-10 shrink-0 rounded-full border border-brand-ink/20 px-3 text-[12px] font-semibold text-brand-ink hover:border-red-500/50">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
