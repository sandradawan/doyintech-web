import { redirect } from "next/navigation";

/** Old leads page; the CRM pipeline replaces it. */
export default function LeadsRedirect() {
  redirect("/admin/pipeline");
}
