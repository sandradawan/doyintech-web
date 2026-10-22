import { redirect } from "next/navigation";

/** Old raw database page; every table now lives under /admin/r/<table>. */
export default function DataRedirect() {
  redirect("/admin/r/site_leads");
}
