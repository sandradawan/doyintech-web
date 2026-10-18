/** Short human-friendly order IDs for Report Studio. */

export function generateReportOrderId(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RPT-${t.slice(-4)}${r}`;
}

export function generateDeliveryToken(): string {
  const a = cryptoRandom(16);
  const b = Date.now().toString(36);
  return `dlv_${a}${b}`;
}

function cryptoRandom(bytes: number): string {
  const arr = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < bytes; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
