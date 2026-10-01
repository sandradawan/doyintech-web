export type NetworkId = "mtn" | "airtel" | "glo" | "etisalat";

export const NETWORKS: {
  id: NetworkId;
  label: string;
  serviceID: string;
  color: string;
}[] = [
  { id: "mtn", label: "MTN", serviceID: "mtn", color: "#ffcc00" },
  { id: "airtel", label: "Airtel", serviceID: "airtel", color: "#ed1c24" },
  { id: "glo", label: "Glo", serviceID: "glo", color: "#50b848" },
  { id: "etisalat", label: "9mobile", serviceID: "etisalat", color: "#006f2f" },
];

export type DataPlan = {
  network: NetworkId;
  variation_code: string;
  name: string;
  amount: number;
};

export const DATA_PLANS: DataPlan[] = [
  { network: "mtn", variation_code: "mtn-10mb-100", name: "MTN 100MB", amount: 100 },
  { network: "mtn", variation_code: "mtn-1gb-350", name: "MTN 1GB", amount: 350 },
  { network: "mtn", variation_code: "mtn-2gb-700", name: "MTN 2GB", amount: 700 },
  { network: "mtn", variation_code: "mtn-3gb-1100", name: "MTN 3GB", amount: 1100 },
  { network: "mtn", variation_code: "mtn-5gb-1800", name: "MTN 5GB", amount: 1800 },
  { network: "airtel", variation_code: "airtel-100mb-100", name: "Airtel 100MB", amount: 100 },
  { network: "airtel", variation_code: "airtel-1gb-500", name: "Airtel 1GB", amount: 500 },
  { network: "airtel", variation_code: "airtel-2gb-1000", name: "Airtel 2GB", amount: 1000 },
  { network: "airtel", variation_code: "airtel-5gb-2000", name: "Airtel 5GB", amount: 2000 },
  { network: "glo", variation_code: "glo-1gb-500", name: "Glo 1GB", amount: 500 },
  { network: "glo", variation_code: "glo-2.5gb-1000", name: "Glo 2.5GB", amount: 1000 },
  { network: "glo", variation_code: "glo-5.8gb-2000", name: "Glo 5.8GB", amount: 2000 },
  { network: "etisalat", variation_code: "9mobile-1gb-500", name: "9mobile 1GB", amount: 500 },
  { network: "etisalat", variation_code: "9mobile-2.5gb-1000", name: "9mobile 2.5GB", amount: 1000 },
  { network: "etisalat", variation_code: "9mobile-5gb-2000", name: "9mobile 5GB", amount: 2000 },
];

export const AIRTIME_PRESETS = [100, 200, 500, 1000, 2000, 5000];

export function normalizeNgPhone(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) return d;
  if (d.length === 13 && d.startsWith("234")) return "0" + d.slice(3);
  if (d.length === 10) return "0" + d;
  return null;
}
