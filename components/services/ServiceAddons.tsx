import { SERVICE_ADDONS } from "@/lib/service-offers";
import { getPayItem } from "@/lib/paystack-catalog";
import AddonBuyButton from "@/components/services/AddonBuyButton";

const naira = (kobo: number) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");

/** Fixed-price extras. Prices come from the pay catalog so admin price changes show here too. */
export default async function ServiceAddons() {
  const addons = await Promise.all(
    SERVICE_ADDONS.map(async (a) => ({ ...a, amountKobo: (await getPayItem(a.id))?.amountKobo ?? a.amountKobo }))
  );

  return (
    <section id="add-ons" className="mt-16 scroll-mt-28">
      <h2 className="text-[24px] font-semibold text-white">Add-ons</h2>
      <p className="mt-2 max-w-2xl text-[15px] text-[#a1a1a6]">
        Fixed-price extras you can add to any package, or buy on their own. Paid in full; we start as soon as we have your details.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addons.map((a) => (
          <article key={a.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h3 className="text-[16px] font-semibold text-white">{a.name}</h3>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">{a.blurb}</p>
            <p className="mt-3 text-[22px] font-semibold text-white">{naira(a.amountKobo)}</p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {a.includes.map((x) => (
                <li key={x} className="flex gap-2 text-[13px] text-[#e8eaed]">
                  <span className="text-[#ff8c14]">✓</span> {x}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-[#86868b]">{a.delivery}</p>
            <div className="mt-4">
              <AddonBuyButton id={a.id} name={a.name} price={naira(a.amountKobo)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
