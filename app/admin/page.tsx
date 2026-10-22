import type { Metadata } from "next";
import Overview from "@/components/admin/crm/Overview";

export const metadata: Metadata = { title: "Overview" };

export default function AdminHome() {
  return <Overview />;
}
