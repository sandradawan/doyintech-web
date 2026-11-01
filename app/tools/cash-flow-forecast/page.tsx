import CashFlowForecast from "@/components/tools/office/CashFlowForecast";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("cash-flow-forecast");

export default function Page() {
  return <OfficeToolLanding slug="cash-flow-forecast" tool={<CashFlowForecast />} />;
}
