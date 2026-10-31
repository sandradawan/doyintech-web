import PayslipGenerator from "@/components/tools/office/PayslipGenerator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("payslip-generator-nigeria");

export default function Page() {
  return <OfficeToolLanding slug="payslip-generator-nigeria" tool={<PayslipGenerator />} />;
}
