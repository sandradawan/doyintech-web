import { TOOLS_CONFIG } from "@/lib/tools/config";

const TRACK_LINKS: Record<string, string> = {
  backend: TOOLS_CONFIG.academyUrl,
  frontend: TOOLS_CONFIG.academyUrl,
  mobile: TOOLS_CONFIG.academyUrl,
  fullstack: TOOLS_CONFIG.academyUrl,
  ai: TOOLS_CONFIG.academyUrl,
  general: TOOLS_CONFIG.academyUrl,
};

export default function AcademyCta({
  track = "general",
  skills = [],
}: {
  track?: string;
  skills?: string[];
}) {
  const href = TRACK_LINKS[track] || TOOLS_CONFIG.academyUrl;
  const skillText =
    skills.length > 0
      ? `Focus next: ${skills.slice(0, 3).join(", ")}.`
      : "Structured lessons and practical projects.";

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Learn this skill
      </p>
      <h3 className="mt-1 font-display text-lg font-bold text-white">
        Continue on DoyinTech Academy
      </h3>
      <p className="mt-2 text-sm text-gray-300">
        {skillText} Build real projects with guidance — not random tutorials.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/90"
      >
        Explore Academy →
      </a>
    </div>
  );
}
