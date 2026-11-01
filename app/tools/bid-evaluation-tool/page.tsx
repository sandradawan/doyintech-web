import BidEvaluationTool from "@/components/tools/office/BidEvaluationTool";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("bid-evaluation-tool");

export default function Page() {
  return <OfficeToolLanding slug="bid-evaluation-tool" tool={<BidEvaluationTool />} />;
}
