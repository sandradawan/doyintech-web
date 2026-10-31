import BusinessPlanGenerator from "@/components/tools/office/BusinessPlanGenerator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("business-plan-generator");

export default function Page() {
  return <OfficeToolLanding slug="business-plan-generator" tool={<BusinessPlanGenerator />} />;
}
