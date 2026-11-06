import type { Metadata } from "next";
import CommunityQueue from "@/components/admin/CommunityQueue";

export const metadata: Metadata = { title: "Community" };

export default function CommunityAdminPage() {
  return <CommunityQueue />;
}
