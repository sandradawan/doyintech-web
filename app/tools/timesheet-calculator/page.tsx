import TimesheetCalculator from "@/components/tools/office/TimesheetCalculator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("timesheet-calculator");

export default function Page() {
  return <OfficeToolLanding slug="timesheet-calculator" tool={<TimesheetCalculator />} />;
}
