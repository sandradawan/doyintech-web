/** Human-readable project request IDs: DT-PRJ-YYYY-NNNN */

export function generateProjectRequestId(seq?: number): string {
  const year = new Date().getFullYear();
  const n =
    typeof seq === "number" && seq > 0
      ? seq
      : Math.floor(Math.random() * 9000) + 1000;
  const pad = String(n).padStart(4, "0");
  return `DT-PRJ-${year}-${pad}`;
}

export function isValidProjectRequestId(id: string): boolean {
  return /^DT-PRJ-\d{4}-\d{4}$/i.test(String(id || "").trim());
}
