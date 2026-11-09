import type { Metadata } from "next";
import KidsShell, { SAFETY_FAQ } from "@/components/kids/KidsShell";
import TimesTables from "@/components/kids/TimesTables";

const TITLE = "Times Tables Game: 60-Second Multiplication Race";
const DESCRIPTION = "Free times tables practice game: pick a table from 2 to 12 or mix them, answer as many as you can in 60 seconds and beat your best score.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kids/times-tables" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/kids/times-tables" },
};

const FAQS = [
  { q: "What order should children learn their times tables in?", a: "Usually 10, 2 and 5 first, then 3 and 4, then 6, 7, 8 and 9, and finally 11 and 12. Once each is solid, use Mix to practise them together." },
  { q: "What is a good score?", a: "10 right in a minute is a good start, 20 shows they are getting quick, and 30 or more means the facts are memorised. The game remembers the best score for each table." },
  { q: "How long until my child knows them all?", a: "With a few one-minute rounds a day, most children learn one table every week or two. Regular short practice beats long sessions." },
  SAFETY_FAQ,
];

export default function Page() {
  return (
    <KidsShell
      h1="Times tables race"
      intro="Pick a table, press start and answer as many as you can in 60 seconds. Can you beat your best?"
      tool={<TimesTables />}
      faqs={FAQS}
      appName="Times tables race"
      path="/kids/times-tables"
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Times tables chart 1 to 12</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-center text-[14px]">
            <thead>
              <tr className="text-[#ff8c14]"><th className="p-1">×</th>{Array.from({ length: 12 }, (_, i) => <th key={i} className="p-1">{i + 1}</th>)}</tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, r) => (
                <tr key={r} className="border-t border-white/5">
                  <th className="p-1 text-[#ff8c14]">{r + 1}</th>
                  {Array.from({ length: 12 }, (_, c) => <td key={c} className="p-1">{(r + 1) * (c + 1)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </KidsShell>
  );
}
