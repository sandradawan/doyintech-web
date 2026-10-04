"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveReferralCode } from "@/lib/referrals";

/** Captures ?ref=CODE from any page into localStorage */
export default function ReferralCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const ref = params.get("ref") || params.get("referral");
    if (ref) saveReferralCode(ref);
  }, [params]);

  return null;
}
