import { redirect } from "next/navigation";

/** Legacy path — unified under /admin/students */
export default function LegacyStudentProjectsAdmin() {
  redirect("/admin/students");
}
