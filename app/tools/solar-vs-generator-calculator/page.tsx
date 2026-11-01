import SolarVsGeneratorCalculator from "@/components/tools/office/SolarVsGeneratorCalculator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("solar-vs-generator-calculator");

export default function Page() {
  return <OfficeToolLanding slug="solar-vs-generator-calculator" tool={<SolarVsGeneratorCalculator />} />;
}
