"use client";

import ScrollReveal from "../animations/ScrollReveal";

/** Add real video URLs (mp4 or YouTube embed ids) when you have client clips */
const CLIPS: {
  name: string;
  role: string;
  quote: string;
  /** YouTube id or empty for text-only card */
  youtubeId?: string;
}[] = [
  {
    name: "JennyGlams",
    role: "Makeup · Jos",
    quote: "Portfolio + WhatsApp booking — clients stop living only in DMs.",
    // youtubeId: "YOUR_ID",
  },
  {
    name: "LegacyPlay",
    role: "Gaming lounge",
    quote: "Bold site, clear reserve path — stations and tournaments front and centre.",
  },
  {
    name: "Imperial Villa",
    role: "Property",
    quote: "Brand site + tools that match how we actually sell estates.",
  },
];

export default function VideoTestimonials() {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0b] py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              In their words
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Short clips from real projects
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#a1a1a6]">
              Phone testimonials work. Drop YouTube Shorts or unlisted uploads here when ready —
              cards stay useful as quotes until then.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CLIPS.map((c, i) => (
            <ScrollReveal key={c.name} direction="up" delay={i * 0.06}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1d1d1f]">
                {c.youtubeId ? (
                  <div className="relative aspect-[9/16] max-h-[320px] w-full bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${c.youtubeId}`}
                      title={c.name}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#1a2030] to-[#0c1018] px-4 text-center">
                    <p className="text-[13px] text-[#86868b]">
                      Video slot — add youtubeId in VideoTestimonials.tsx
                    </p>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[15px] leading-relaxed text-[#e8eaed]">“{c.quote}”</p>
                  <p className="mt-4 text-[14px] font-semibold text-white">{c.name}</p>
                  <p className="text-[12px] text-[#86868b]">{c.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/case-studies" className="text-[14px] font-semibold text-[#2997ff] hover:underline">
            Full case studies →
          </a>
        </div>
      </div>
    </section>
  );
}
