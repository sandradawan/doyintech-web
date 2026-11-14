/** The paid unlock for downloading a Chapter Four from the data analysis tool. */
export const DATA_ANALYSIS_PRODUCT = {
  id: "student-data-analysis",
  name: "Chapter Four Data Analysis (Word + PDF)",
  priceNgn: "₦5,000",
  amountKobo: 500_000,
  path: "/students/data-analysis",
} as const;

/** SHA-256 fingerprint of the uploaded responses, as lowercase hex. One payment unlocks one data set. */
export const DATASET_HASH_RE = /^[a-f0-9]{64}$/;
