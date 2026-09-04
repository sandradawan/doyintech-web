import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function ToolPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/tools" className="text-sm text-primary hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-gray-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
