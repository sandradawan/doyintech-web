import ComplianceCalendar from "@/components/tools/office/ComplianceCalendar";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("compliance-calendar-nigeria");

export default function Page() {
  return <OfficeToolLanding slug="compliance-calendar-nigeria" tool={<ComplianceCalendar />} />;
}
