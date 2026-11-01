import ImportDutyCalculator from "@/components/tools/office/ImportDutyCalculator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("import-duty-calculator-nigeria");

export default function Page() {
  return <OfficeToolLanding slug="import-duty-calculator-nigeria" tool={<ImportDutyCalculator />} />;
}
