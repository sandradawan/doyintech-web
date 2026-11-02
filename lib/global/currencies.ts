/** Currencies the invoice tools support, and formatting/locale helpers for them. */

export const INVOICE_CURRENCIES: { code: string; name: string }[] = [
  { code: "NGN", name: "Nigerian naira" },
  { code: "USD", name: "US dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British pound" },
  { code: "CAD", name: "Canadian dollar" },
  { code: "AUD", name: "Australian dollar" },
  { code: "NZD", name: "New Zealand dollar" },
  { code: "CHF", name: "Swiss franc" },
  { code: "SEK", name: "Swedish krona" },
  { code: "NOK", name: "Norwegian krone" },
  { code: "DKK", name: "Danish krone" },
  { code: "PLN", name: "Polish złoty" },
  { code: "CZK", name: "Czech koruna" },
  { code: "HUF", name: "Hungarian forint" },
  { code: "RON", name: "Romanian leu" },
  { code: "ISK", name: "Icelandic króna" },
  { code: "TRY", name: "Turkish lira" },
  { code: "ZAR", name: "South African rand" },
  { code: "KES", name: "Kenyan shilling" },
  { code: "GHS", name: "Ghanaian cedi" },
  { code: "EGP", name: "Egyptian pound" },
  { code: "MAD", name: "Moroccan dirham" },
  { code: "TZS", name: "Tanzanian shilling" },
  { code: "UGX", name: "Ugandan shilling" },
  { code: "RWF", name: "Rwandan franc" },
  { code: "ETB", name: "Ethiopian birr" },
  { code: "ZMW", name: "Zambian kwacha" },
  { code: "XOF", name: "West African CFA franc" },
  { code: "XAF", name: "Central African CFA franc" },
  { code: "BWP", name: "Botswana pula" },
  { code: "NAD", name: "Namibian dollar" },
  { code: "MUR", name: "Mauritian rupee" },
  { code: "TND", name: "Tunisian dinar" },
  { code: "DZD", name: "Algerian dinar" },
  { code: "INR", name: "Indian rupee" },
  { code: "PKR", name: "Pakistani rupee" },
  { code: "BDT", name: "Bangladeshi taka" },
  { code: "LKR", name: "Sri Lankan rupee" },
  { code: "NPR", name: "Nepalese rupee" },
  { code: "SGD", name: "Singapore dollar" },
  { code: "MYR", name: "Malaysian ringgit" },
  { code: "PHP", name: "Philippine peso" },
  { code: "IDR", name: "Indonesian rupiah" },
  { code: "THB", name: "Thai baht" },
  { code: "VND", name: "Vietnamese dong" },
  { code: "JPY", name: "Japanese yen" },
  { code: "KRW", name: "South Korean won" },
  { code: "CNY", name: "Chinese yuan" },
  { code: "TWD", name: "New Taiwan dollar" },
  { code: "HKD", name: "Hong Kong dollar" },
  { code: "AED", name: "UAE dirham" },
  { code: "SAR", name: "Saudi riyal" },
  { code: "QAR", name: "Qatari riyal" },
  { code: "KWD", name: "Kuwaiti dinar" },
  { code: "BHD", name: "Bahraini dinar" },
  { code: "OMR", name: "Omani rial" },
  { code: "JOD", name: "Jordanian dinar" },
  { code: "ILS", name: "Israeli shekel" },
  { code: "MXN", name: "Mexican peso" },
  { code: "BRL", name: "Brazilian real" },
  { code: "ARS", name: "Argentine peso" },
  { code: "CLP", name: "Chilean peso" },
  { code: "COP", name: "Colombian peso" },
  { code: "PEN", name: "Peruvian sol" },
  { code: "UYU", name: "Uruguayan peso" },
  { code: "PYG", name: "Paraguayan guaraní" },
  { code: "BOB", name: "Bolivian boliviano" },
  { code: "CRC", name: "Costa Rican colón" },
  { code: "DOP", name: "Dominican peso" },
  { code: "GTQ", name: "Guatemalan quetzal" },
  { code: "HNL", name: "Honduran lempira" },
  { code: "JMD", name: "Jamaican dollar" },
  { code: "TTD", name: "Trinidad and Tobago dollar" },
];

/** Country (ISO region from the browser locale) → currency, for a sensible default. */
const REGION_CURRENCY: Record<string, string> = {
  NG: "NGN", US: "USD", GB: "GBP", IE: "EUR", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", PT: "EUR", AT: "EUR", FI: "EUR",
  GR: "EUR", SK: "EUR", SI: "EUR", HR: "EUR", LU: "EUR", CY: "EUR", MT: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", BG: "EUR",
  CA: "CAD", AU: "AUD", NZ: "NZD", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", IS: "ISK", TR: "TRY",
  ZA: "ZAR", KE: "KES", GH: "GHS", EG: "EGP", MA: "MAD", TZ: "TZS", UG: "UGX", RW: "RWF", ET: "ETB", ZM: "ZMW", SN: "XOF", CI: "XOF",
  CM: "XAF", BW: "BWP", NA: "NAD", MU: "MUR", TN: "TND", DZ: "DZD", IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR", SG: "SGD",
  MY: "MYR", PH: "PHP", ID: "IDR", TH: "THB", VN: "VND", JP: "JPY", KR: "KRW", CN: "CNY", TW: "TWD", HK: "HKD", AE: "AED", SA: "SAR",
  QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR", JO: "JOD", IL: "ILS", MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN",
  EC: "USD", UY: "UYU", PY: "PYG", BO: "BOB", CR: "CRC", DO: "DOP", GT: "GTQ", HN: "HNL", JM: "JMD", TT: "TTD", PA: "USD", SV: "USD",
};

export function currencyForLocale(locale: string): string | null {
  const region = (locale.split(/[-_]/)[1] || "").toUpperCase();
  return REGION_CURRENCY[region] ?? null;
}

const formatters = new Map<string, Intl.NumberFormat>();

/** Amount in the currency's usual format; naira without kobo, as on the rest of the site. */
export function formatMoney(n: number, code: string): string {
  let f = formatters.get(code);
  if (!f) {
    try {
      f = new Intl.NumberFormat(code === "NGN" ? "en-NG" : "en", { style: "currency", currency: code, ...(code === "NGN" ? { maximumFractionDigits: 0 } : {}) });
    } catch {
      f = new Intl.NumberFormat("en", { style: "currency", currency: "USD" });
    }
    formatters.set(code, f);
  }
  return f.format(Number.isFinite(n) ? n : 0);
}

export function currencySymbol(code: string): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency: code, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

/** Currencies whose everyday prices run into the thousands; the sample invoice line uses a bigger number. */
const LARGE_UNIT = new Set(["NGN", "KES", "TZS", "UGX", "RWF", "ETB", "XOF", "XAF", "INR", "PKR", "BDT", "LKR", "NPR", "JPY", "KRW", "IDR", "VND", "PYG", "CLP", "COP", "ARS", "HUF", "ISK", "CRC", "DZD"]);

/** A believable price for the example line on a new invoice. */
export function samplePrice(code: string): number {
  return LARGE_UNIT.has(code) ? 150000 : 1500;
}
