import type { Metadata } from "next";
import StudentSpotlightsAdmin from "@/components/admin/StudentSpotlightsAdmin";

export const metadata: Metadata = { title: "Student magazine" };

export default function StudentMagazineAdminPage() {
  return <StudentSpotlightsAdmin />;
}
