import Link from "next/link";

/** The items after the current one, wrapping round, so everything in a list is linked from others. */
export function relatedBy<T>(items: T[], key: (item: T) => string, current: string, count: number): T[] {
  const here = items.findIndex((item) => key(item) === current);
  return [...items.slice(here + 1), ...items.slice(0, Math.max(here, 0))].slice(0, count);
}

export default function RelatedLinks({ heading, links }: { heading: string; links: { href: string; label: string }[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={heading} className="mx-auto mt-12 max-w-[980px] border-t border-white/10 px-0 pt-6">
      <h2 className="text-[18px] font-semibold text-white">{heading}</h2>
      <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center text-[15px] text-[#ff8c14] hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
