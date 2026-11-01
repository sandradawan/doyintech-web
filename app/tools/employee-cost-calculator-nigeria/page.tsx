import EmployeeCostCalculator from "@/components/tools/office/EmployeeCostCalculator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("employee-cost-calculator-nigeria");

export default function Page() {
  return <OfficeToolLanding slug="employee-cost-calculator-nigeria" tool={<EmployeeCostCalculator />} />;
}
