/**
 * Consumption-tax rates by country for the global VAT/GST calculator pages (/vat-calculator/<slug>).
 * Standard rates are current for 2026. Reduced rates are listed only where well established;
 * pages tell visitors to confirm with the tax authority because rates change.
 */

export type Region = "Europe" | "Africa" | "Asia-Pacific" | "Middle East" | "Americas";

export type VatCountry = {
  slug: string;
  country: string;
  tax: string; // what people search: VAT, GST, IVA, IGV…
  taxLong?: string;
  standard: number;
  reduced?: number[];
  presets?: { label: string; rate: number }[]; // replaces standard/reduced chips (e.g. Canada provinces)
  currency: string; // ISO 4217
  locale: string;
  authority?: string;
  region: Region;
  note?: string;
};

const c = (x: VatCountry) => x;

export const VAT_COUNTRIES: VatCountry[] = [
  // Europe
  c({ slug: "united-kingdom", country: "United Kingdom", tax: "VAT", standard: 20, reduced: [5, 0], currency: "GBP", locale: "en-GB", authority: "HMRC", region: "Europe" }),
  c({ slug: "ireland", country: "Ireland", tax: "VAT", standard: 23, reduced: [13.5, 9, 4.8, 0], currency: "EUR", locale: "en-IE", authority: "Revenue", region: "Europe" }),
  c({ slug: "germany", country: "Germany", tax: "VAT", taxLong: "Mehrwertsteuer (MwSt)", standard: 19, reduced: [7], currency: "EUR", locale: "de-DE", authority: "the Federal Central Tax Office and local Finanzamt", region: "Europe" }),
  c({ slug: "france", country: "France", tax: "VAT", taxLong: "TVA", standard: 20, reduced: [10, 5.5, 2.1], currency: "EUR", locale: "fr-FR", authority: "DGFiP", region: "Europe" }),
  c({ slug: "spain", country: "Spain", tax: "VAT", taxLong: "IVA", standard: 21, reduced: [10, 4], currency: "EUR", locale: "es-ES", authority: "AEAT (Agencia Tributaria)", region: "Europe" }),
  c({ slug: "italy", country: "Italy", tax: "VAT", taxLong: "IVA", standard: 22, reduced: [10, 5, 4], currency: "EUR", locale: "it-IT", authority: "Agenzia delle Entrate", region: "Europe" }),
  c({ slug: "netherlands", country: "Netherlands", tax: "VAT", taxLong: "BTW", standard: 21, reduced: [9], currency: "EUR", locale: "nl-NL", authority: "Belastingdienst", region: "Europe" }),
  c({ slug: "belgium", country: "Belgium", tax: "VAT", taxLong: "BTW / TVA", standard: 21, reduced: [12, 6], currency: "EUR", locale: "nl-BE", authority: "FPS Finance", region: "Europe" }),
  c({ slug: "portugal", country: "Portugal", tax: "VAT", taxLong: "IVA", standard: 23, reduced: [13, 6], currency: "EUR", locale: "pt-PT", authority: "Autoridade Tributária", region: "Europe", note: "Madeira and the Azores have lower rates." }),
  c({ slug: "poland", country: "Poland", tax: "VAT", standard: 23, reduced: [8, 5], currency: "PLN", locale: "pl-PL", region: "Europe" }),
  c({ slug: "sweden", country: "Sweden", tax: "VAT", taxLong: "moms", standard: 25, reduced: [12, 6], currency: "SEK", locale: "sv-SE", authority: "Skatteverket", region: "Europe" }),
  c({ slug: "denmark", country: "Denmark", tax: "VAT", taxLong: "moms", standard: 25, currency: "DKK", locale: "da-DK", authority: "Skattestyrelsen", region: "Europe" }),
  c({ slug: "norway", country: "Norway", tax: "VAT", taxLong: "MVA", standard: 25, reduced: [15, 12], currency: "NOK", locale: "nb-NO", authority: "Skatteetaten", region: "Europe" }),
  c({ slug: "finland", country: "Finland", tax: "VAT", taxLong: "ALV", standard: 25.5, currency: "EUR", locale: "fi-FI", authority: "Vero Skatt", region: "Europe" }),
  c({ slug: "austria", country: "Austria", tax: "VAT", taxLong: "USt", standard: 20, reduced: [13, 10], currency: "EUR", locale: "de-AT", region: "Europe" }),
  c({ slug: "switzerland", country: "Switzerland", tax: "VAT", taxLong: "MWST / TVA", standard: 8.1, reduced: [3.8, 2.6], currency: "CHF", locale: "de-CH", authority: "the Federal Tax Administration (ESTV)", region: "Europe" }),
  c({ slug: "greece", country: "Greece", tax: "VAT", taxLong: "ΦΠΑ", standard: 24, reduced: [13, 6], currency: "EUR", locale: "el-GR", authority: "AADE", region: "Europe" }),
  c({ slug: "czech-republic", country: "Czech Republic", tax: "VAT", taxLong: "DPH", standard: 21, reduced: [12], currency: "CZK", locale: "cs-CZ", region: "Europe" }),
  c({ slug: "hungary", country: "Hungary", tax: "VAT", taxLong: "ÁFA", standard: 27, reduced: [18, 5], currency: "HUF", locale: "hu-HU", authority: "NAV", region: "Europe" }),
  c({ slug: "romania", country: "Romania", tax: "VAT", taxLong: "TVA", standard: 21, reduced: [11], currency: "RON", locale: "ro-RO", authority: "ANAF", region: "Europe" }),
  c({ slug: "croatia", country: "Croatia", tax: "VAT", taxLong: "PDV", standard: 25, reduced: [13, 5], currency: "EUR", locale: "hr-HR", region: "Europe" }),
  c({ slug: "slovakia", country: "Slovakia", tax: "VAT", taxLong: "DPH", standard: 23, reduced: [19, 5], currency: "EUR", locale: "sk-SK", region: "Europe" }),
  c({ slug: "bulgaria", country: "Bulgaria", tax: "VAT", taxLong: "ДДС", standard: 20, reduced: [9], currency: "EUR", locale: "bg-BG", region: "Europe" }),
  c({ slug: "luxembourg", country: "Luxembourg", tax: "VAT", taxLong: "TVA", standard: 17, reduced: [14, 8, 3], currency: "EUR", locale: "fr-LU", region: "Europe" }),
  c({ slug: "cyprus", country: "Cyprus", tax: "VAT", standard: 19, reduced: [9, 5], currency: "EUR", locale: "el-CY", region: "Europe" }),
  c({ slug: "malta", country: "Malta", tax: "VAT", standard: 18, reduced: [7, 5], currency: "EUR", locale: "en-MT", region: "Europe" }),
  c({ slug: "estonia", country: "Estonia", tax: "VAT", standard: 24, currency: "EUR", locale: "et-EE", region: "Europe" }),
  c({ slug: "latvia", country: "Latvia", tax: "VAT", taxLong: "PVN", standard: 21, reduced: [12, 5], currency: "EUR", locale: "lv-LV", region: "Europe" }),
  c({ slug: "lithuania", country: "Lithuania", tax: "VAT", taxLong: "PVM", standard: 21, currency: "EUR", locale: "lt-LT", region: "Europe" }),
  c({ slug: "slovenia", country: "Slovenia", tax: "VAT", taxLong: "DDV", standard: 22, reduced: [9.5, 5], currency: "EUR", locale: "sl-SI", region: "Europe" }),
  c({ slug: "iceland", country: "Iceland", tax: "VAT", standard: 24, reduced: [11], currency: "ISK", locale: "is-IS", region: "Europe" }),
  c({ slug: "turkey", country: "Turkey", tax: "VAT", taxLong: "KDV", standard: 20, reduced: [10, 1], currency: "TRY", locale: "tr-TR", region: "Europe" }),

  // Africa
  c({ slug: "nigeria", country: "Nigeria", tax: "VAT", standard: 7.5, currency: "NGN", locale: "en-NG", authority: "the Nigeria Revenue Service (NRS)", region: "Africa" }),
  c({ slug: "south-africa", country: "South Africa", tax: "VAT", standard: 15, reduced: [0], currency: "ZAR", locale: "en-ZA", authority: "SARS", region: "Africa" }),
  c({ slug: "kenya", country: "Kenya", tax: "VAT", standard: 16, reduced: [8, 0], currency: "KES", locale: "en-KE", authority: "KRA", region: "Africa", note: "VAT invoices must be issued through KRA's eTIMS system." }),
  c({ slug: "egypt", country: "Egypt", tax: "VAT", standard: 14, currency: "EGP", locale: "ar-EG", authority: "the Egyptian Tax Authority", region: "Africa" }),
  c({ slug: "morocco", country: "Morocco", tax: "VAT", taxLong: "TVA", standard: 20, reduced: [10], currency: "MAD", locale: "fr-MA", region: "Africa" }),
  c({ slug: "tanzania", country: "Tanzania", tax: "VAT", standard: 18, currency: "TZS", locale: "en-TZ", authority: "TRA", region: "Africa" }),
  c({ slug: "uganda", country: "Uganda", tax: "VAT", standard: 18, currency: "UGX", locale: "en-UG", authority: "URA", region: "Africa" }),
  c({ slug: "rwanda", country: "Rwanda", tax: "VAT", standard: 18, currency: "RWF", locale: "en-RW", authority: "RRA", region: "Africa" }),
  c({ slug: "ethiopia", country: "Ethiopia", tax: "VAT", standard: 15, currency: "ETB", locale: "en-ET", region: "Africa" }),
  c({ slug: "zambia", country: "Zambia", tax: "VAT", standard: 16, currency: "ZMW", locale: "en-ZM", authority: "ZRA", region: "Africa" }),
  c({ slug: "senegal", country: "Senegal", tax: "VAT", taxLong: "TVA", standard: 18, currency: "XOF", locale: "fr-SN", region: "Africa" }),
  c({ slug: "cote-divoire", country: "Côte d'Ivoire", tax: "VAT", taxLong: "TVA", standard: 18, currency: "XOF", locale: "fr-CI", region: "Africa" }),
  c({ slug: "cameroon", country: "Cameroon", tax: "VAT", taxLong: "TVA", standard: 19.25, currency: "XAF", locale: "fr-CM", region: "Africa", note: "19.25% is the 17.5% VAT plus the 10% additional council tax on it." }),
  c({ slug: "botswana", country: "Botswana", tax: "VAT", standard: 14, currency: "BWP", locale: "en-BW", authority: "BURS", region: "Africa" }),
  c({ slug: "namibia", country: "Namibia", tax: "VAT", standard: 15, currency: "NAD", locale: "en-NA", region: "Africa" }),
  c({ slug: "mauritius", country: "Mauritius", tax: "VAT", standard: 15, currency: "MUR", locale: "en-MU", authority: "MRA", region: "Africa" }),
  c({ slug: "tunisia", country: "Tunisia", tax: "VAT", taxLong: "TVA", standard: 19, reduced: [13, 7], currency: "TND", locale: "fr-TN", region: "Africa" }),
  c({ slug: "algeria", country: "Algeria", tax: "VAT", taxLong: "TVA", standard: 19, reduced: [9], currency: "DZD", locale: "fr-DZ", region: "Africa" }),

  // Asia-Pacific
  c({ slug: "india", country: "India", tax: "GST", standard: 18, presets: [{ label: "18% standard", rate: 18 }, { label: "5% merit rate", rate: 5 }, { label: "40% special rate", rate: 40 }, { label: "3% gold", rate: 3 }, { label: "0.25% rough diamonds", rate: 0.25 }], currency: "INR", locale: "en-IN", authority: "the GST Council and CBIC", region: "Asia-Pacific", note: "Since 22 September 2025 most goods and services fall into the 5% or 18% slab, with 40% for sin and luxury goods." }),
  c({ slug: "australia", country: "Australia", tax: "GST", standard: 10, reduced: [0], currency: "AUD", locale: "en-AU", authority: "the ATO", region: "Asia-Pacific" }),
  c({ slug: "new-zealand", country: "New Zealand", tax: "GST", standard: 15, reduced: [0], currency: "NZD", locale: "en-NZ", authority: "Inland Revenue (IRD)", region: "Asia-Pacific" }),
  c({ slug: "singapore", country: "Singapore", tax: "GST", standard: 9, reduced: [0], currency: "SGD", locale: "en-SG", authority: "IRAS", region: "Asia-Pacific" }),
  c({ slug: "malaysia", country: "Malaysia", tax: "SST", taxLong: "Sales and Service Tax", standard: 10, presets: [{ label: "10% sales tax", rate: 10 }, { label: "5% sales tax", rate: 5 }, { label: "8% service tax", rate: 8 }, { label: "6% service tax", rate: 6 }], currency: "MYR", locale: "en-MY", authority: "the Royal Malaysian Customs Department", region: "Asia-Pacific" }),
  c({ slug: "philippines", country: "Philippines", tax: "VAT", standard: 12, reduced: [0], currency: "PHP", locale: "en-PH", authority: "the BIR", region: "Asia-Pacific" }),
  c({ slug: "indonesia", country: "Indonesia", tax: "VAT", taxLong: "PPN", standard: 12, presets: [{ label: "11% effective (most goods)", rate: 11 }, { label: "12% luxury goods", rate: 12 }], currency: "IDR", locale: "id-ID", authority: "DJP", region: "Asia-Pacific", note: "The 12% rate applies in full to luxury goods; for most goods and services it is charged on 11/12 of the price, an effective 11%." }),
  c({ slug: "thailand", country: "Thailand", tax: "VAT", standard: 7, currency: "THB", locale: "th-TH", authority: "the Revenue Department", region: "Asia-Pacific" }),
  c({ slug: "vietnam", country: "Vietnam", tax: "VAT", standard: 10, reduced: [8, 5], currency: "VND", locale: "vi-VN", region: "Asia-Pacific", note: "A temporary 8% rate applies to many goods and services in place of 10%." }),
  c({ slug: "japan", country: "Japan", tax: "consumption tax", standard: 10, reduced: [8], currency: "JPY", locale: "ja-JP", authority: "the National Tax Agency", region: "Asia-Pacific" }),
  c({ slug: "south-korea", country: "South Korea", tax: "VAT", standard: 10, currency: "KRW", locale: "ko-KR", authority: "the National Tax Service", region: "Asia-Pacific" }),
  c({ slug: "china", country: "China", tax: "VAT", standard: 13, reduced: [9, 6], currency: "CNY", locale: "zh-CN", authority: "the State Taxation Administration", region: "Asia-Pacific" }),
  c({ slug: "taiwan", country: "Taiwan", tax: "VAT", standard: 5, currency: "TWD", locale: "zh-TW", region: "Asia-Pacific" }),
  c({ slug: "pakistan", country: "Pakistan", tax: "sales tax", standard: 18, currency: "PKR", locale: "en-PK", authority: "the FBR", region: "Asia-Pacific" }),
  c({ slug: "bangladesh", country: "Bangladesh", tax: "VAT", standard: 15, currency: "BDT", locale: "en-BD", authority: "the NBR", region: "Asia-Pacific" }),
  c({ slug: "sri-lanka", country: "Sri Lanka", tax: "VAT", standard: 18, currency: "LKR", locale: "en-LK", region: "Asia-Pacific" }),
  c({ slug: "nepal", country: "Nepal", tax: "VAT", standard: 13, currency: "NPR", locale: "en-NP", region: "Asia-Pacific" }),

  // Middle East
  c({ slug: "uae", country: "United Arab Emirates", tax: "VAT", standard: 5, reduced: [0], currency: "AED", locale: "en-AE", authority: "the Federal Tax Authority (FTA)", region: "Middle East" }),
  c({ slug: "saudi-arabia", country: "Saudi Arabia", tax: "VAT", standard: 15, currency: "SAR", locale: "ar-SA", authority: "ZATCA", region: "Middle East", note: "VAT invoices must meet ZATCA's e-invoicing (Fatoora) rules." }),
  c({ slug: "bahrain", country: "Bahrain", tax: "VAT", standard: 10, currency: "BHD", locale: "en-BH", authority: "the NBR", region: "Middle East" }),
  c({ slug: "oman", country: "Oman", tax: "VAT", standard: 5, currency: "OMR", locale: "en-OM", authority: "the Tax Authority", region: "Middle East" }),
  c({ slug: "israel", country: "Israel", tax: "VAT", standard: 18, currency: "ILS", locale: "he-IL", region: "Middle East" }),
  c({ slug: "jordan", country: "Jordan", tax: "sales tax", standard: 16, currency: "JOD", locale: "en-JO", region: "Middle East" }),

  // Americas
  c({ slug: "canada", country: "Canada", tax: "GST/HST", standard: 13, presets: [{ label: "5% GST (AB, territories)", rate: 5 }, { label: "13% HST Ontario", rate: 13 }, { label: "14% HST Nova Scotia", rate: 14 }, { label: "15% HST NB, NL, PEI", rate: 15 }, { label: "14.975% GST+QST Quebec", rate: 14.975 }, { label: "12% GST+PST BC", rate: 12 }, { label: "12% GST+RST Manitoba", rate: 12 }, { label: "11% GST+PST Saskatchewan", rate: 11 }], currency: "CAD", locale: "en-CA", authority: "the CRA", region: "Americas" }),
  c({ slug: "mexico", country: "Mexico", tax: "VAT", taxLong: "IVA", standard: 16, reduced: [8, 0], currency: "MXN", locale: "es-MX", authority: "SAT", region: "Americas", note: "8% applies in the northern and southern border regions." }),
  c({ slug: "argentina", country: "Argentina", tax: "VAT", taxLong: "IVA", standard: 21, reduced: [10.5, 27], currency: "ARS", locale: "es-AR", authority: "ARCA (formerly AFIP)", region: "Americas" }),
  c({ slug: "chile", country: "Chile", tax: "VAT", taxLong: "IVA", standard: 19, currency: "CLP", locale: "es-CL", authority: "the SII", region: "Americas" }),
  c({ slug: "colombia", country: "Colombia", tax: "VAT", taxLong: "IVA", standard: 19, reduced: [5], currency: "COP", locale: "es-CO", authority: "DIAN", region: "Americas" }),
  c({ slug: "peru", country: "Peru", tax: "VAT", taxLong: "IGV", standard: 18, currency: "PEN", locale: "es-PE", authority: "SUNAT", region: "Americas", note: "18% is the 16% IGV plus the 2% municipal promotion tax (IPM)." }),
  c({ slug: "ecuador", country: "Ecuador", tax: "VAT", taxLong: "IVA", standard: 15, currency: "USD", locale: "es-EC", authority: "the SRI", region: "Americas" }),
  c({ slug: "uruguay", country: "Uruguay", tax: "VAT", taxLong: "IVA", standard: 22, reduced: [10], currency: "UYU", locale: "es-UY", region: "Americas" }),
  c({ slug: "costa-rica", country: "Costa Rica", tax: "VAT", taxLong: "IVA", standard: 13, currency: "CRC", locale: "es-CR", region: "Americas" }),
  c({ slug: "dominican-republic", country: "Dominican Republic", tax: "VAT", taxLong: "ITBIS", standard: 18, currency: "DOP", locale: "es-DO", region: "Americas" }),
  c({ slug: "jamaica", country: "Jamaica", tax: "GCT", taxLong: "General Consumption Tax", standard: 15, currency: "JMD", locale: "en-JM", region: "Americas" }),
  c({ slug: "trinidad-and-tobago", country: "Trinidad and Tobago", tax: "VAT", standard: 12.5, currency: "TTD", locale: "en-TT", region: "Americas" }),
  c({ slug: "paraguay", country: "Paraguay", tax: "VAT", taxLong: "IVA", standard: 10, reduced: [5], currency: "PYG", locale: "es-PY", region: "Americas" }),
  c({ slug: "guatemala", country: "Guatemala", tax: "VAT", taxLong: "IVA", standard: 12, currency: "GTQ", locale: "es-GT", region: "Americas" }),
  c({ slug: "panama", country: "Panama", tax: "VAT", taxLong: "ITBMS", standard: 7, currency: "USD", locale: "es-PA", region: "Americas" }),
  c({ slug: "el-salvador", country: "El Salvador", tax: "VAT", taxLong: "IVA", standard: 13, currency: "USD", locale: "es-SV", region: "Americas" }),
  c({ slug: "honduras", country: "Honduras", tax: "VAT", taxLong: "ISV", standard: 15, currency: "HNL", locale: "es-HN", region: "Americas" }),
  c({ slug: "bolivia", country: "Bolivia", tax: "VAT", taxLong: "IVA", standard: 13, currency: "BOB", locale: "es-BO", region: "Americas" }),
];

export const VAT_REGIONS: Region[] = ["Europe", "Africa", "Asia-Pacific", "Middle East", "Americas"];

/** Nigeria already has its own page; the hub links there instead of a duplicate. */
export const VAT_EXISTING_PAGES: Record<string, string> = { nigeria: "/tools/nigeria-vat-calculator" };

export const vatHref = (v: VatCountry) => VAT_EXISTING_PAGES[v.slug] ?? `/vat-calculator/${v.slug}`;

export function getVatCountry(slug: string) {
  return VAT_COUNTRIES.find((v) => v.slug === slug);
}

/** Rate chips for the calculator: presets, or the standard plus reduced rates. */
export function ratePresets(v: VatCountry): { label: string; rate: number }[] {
  if (v.presets) return v.presets;
  return [{ label: `${v.standard}% standard`, rate: v.standard }, ...(v.reduced || []).map((r) => ({ label: r === 0 ? "0% zero-rated" : `${r}% reduced`, rate: r }))];
}

/** Add tax to a net amount, or take it out of a gross amount. Rounded to 2 decimals. */
export function vatSplit(amount: number, rate: number, mode: "add" | "remove") {
  const a = Number.isFinite(amount) ? amount : 0;
  const r = Number.isFinite(rate) && rate >= 0 ? rate / 100 : 0;
  const round = (n: number) => Math.round(n * 100) / 100;
  if (mode === "add") {
    const tax = round(a * r);
    return { net: round(a), tax, gross: round(a + tax) };
  }
  const net = round(a / (1 + r));
  return { net, tax: round(a - net), gross: round(a) };
}
