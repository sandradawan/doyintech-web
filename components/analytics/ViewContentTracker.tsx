"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/pixel";

/** Fire ViewContent once per mount for product/service pages. */
export default function ViewContentTracker({
  contentName,
  contentCategory,
}: {
  contentName: string;
  contentCategory?: string;
}) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_name: contentName.slice(0, 100),
      content_category: contentCategory || "page",
    });
  }, [contentName, contentCategory]);
  return null;
}
