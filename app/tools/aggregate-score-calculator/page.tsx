import AggregateScoreCalculator from "@/components/tools/office/AggregateScoreCalculator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("aggregate-score-calculator");

export default function Page() {
  return <OfficeToolLanding slug="aggregate-score-calculator" tool={<AggregateScoreCalculator />} />;
}
