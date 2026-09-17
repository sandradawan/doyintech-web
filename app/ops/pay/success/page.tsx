import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment received — DoyinOps",
  robots: { index: false, follow: false },
};

export default async function OpsPaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string; reference?: string; trxref?: string }>;
}) {
  const q = await searchParams;
  const invoice = q.invoice || "";
  const reference = q.reference || q.trxref || "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1220] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-white">Payment received</h1>
        <p className="mt-2 text-sm text-white/55">
          Thank you. Your payment was submitted successfully
          {invoice ? (
            <>
              {" "}
              for invoice <span className="font-mono text-[#ff8c14]">{invoice}</span>
            </>
          ) : null}
          .
        </p>
        {reference && (
          <p className="mt-3 break-all text-[11px] text-white/35">Reference: {reference}</p>
        )}
        <p className="mt-4 text-[13px] text-white/45">
          You can close this tab. The business will confirm on their side shortly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#ff8c14] px-6 py-2.5 text-sm font-semibold text-black"
        >
          DoyinTech home
        </Link>
      </div>
    </main>
  );
}
