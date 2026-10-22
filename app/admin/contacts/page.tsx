import { Suspense } from "react";
import type { Metadata } from "next";
import ContactView from "@/components/admin/crm/ContactView";

export const metadata: Metadata = { title: "Contacts" };

export default function ContactsPage() {
  return (
    <Suspense fallback={<p className="text-[13px] text-[#86868b]">Loading…</p>}>
      <ContactView />
    </Suspense>
  );
}
